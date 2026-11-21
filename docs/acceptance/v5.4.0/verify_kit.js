/* Maintainer check (the owner does not run this): acts like the owner, using the kit page's Copy buttons and the REAL release index.html,
   and confirms each case shows what the kit tells the owner to expect.
   Usage: node verify_kit.js <path to release index.html>   (needs Playwright) */
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const APP = 'file://' + path.resolve(process.argv[2]), KIT = 'file://' + path.join(__dirname, 'acceptance-kit.html');
const cases = JSON.parse(fs.readFileSync(path.join(__dirname, 'catalogs', 'cases.json'), 'utf8'));
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ permissions: ['clipboard-read', 'clipboard-write'], viewport: { width: 1280, height: 900 } });
  const kit = await ctx.newPage(), app = await ctx.newPage(); const errs = [], dialogs = [], reqs = [];
  for (const p of [kit, app]) { p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => { dialogs.push(d.message()); d.dismiss(); }); p.on('request', r => { if (!/^(file|blob|data):/.test(r.url())) reqs.push(r.url()); }); }
  await app.addInitScript(() => { window.__pwn = 0; window.open = () => ({}); });
  await kit.goto(KIT); await app.goto(APP); await app.waitForTimeout(300);
  ok(await app.evaluate(() => /5\.4\.0/.test(document.documentElement.innerHTML.match(/currentVersion: "([^"]+)"/)[1]) && CATALOG.rev === 1 && CHATBOTS.length === 9), 'app under test is the release build: v5.4.0, catalog rev 1, 9 chatbots');
  const paste = async n => {
    await kit.bringToFront(); await kit.click('button.copy[data-n="' + n + '"]'); await kit.waitForTimeout(150);
    const text = await kit.evaluate(() => navigator.clipboard.readText());
    await app.bringToFront(); if (await app.locator('#catImportBox').isHidden()) await app.click('#catImportBtn');
    await app.fill('#catImportText', ''); await app.locator('#catImportText').focus(); await app.evaluate(t => { const ta = document.getElementById('catImportText'); ta.value = t; ta.dispatchEvent(new Event('input')); }, text);
    await app.click('#catImportGo'); return text;
  };
  const diffText = () => app.textContent('#catDiff');
  const rowOf = p => app.locator('#catDiffList > li').filter({ has: app.locator('summary', { hasText: p }) }).first();
  const open = async li => { await li.locator('summary').click(); return li.locator('details').evaluate(d => d.open); };
  for (const k of cases) {
    const text = await paste(k.id), d = await diffText();
    if (k.id === '6') { ok(/Not installed: this catalog has problems/.test(d) && (await app.$('#catInstallBtn')) === null && (await app.$('#catCancelBtn')) === null, 'Test 6: broken catalogue is refused in plain English, with no Install button'); continue; }
    ok(new RegExp('\\(' + k.total + ' in total\\)').test(d), 'Test ' + k.id + ': summary says ' + k.total + ' in total');
    if (k.id === '1') {
      const add = rowOf('+ ChatGPT: ACCEPTANCE TEST added command (Acceptance Group)'), rm = rowOf('- Claude:');
      ok(await add.count() === 1 && await rm.count() === 1 && /Catalog revision: rev 1 -> 2/.test(d), 'Test 1: added line, removed line and revision line are all present');
      ok(await open(add), 'Test 1: added line opens'); const t = await add.textContent();
      ok(['Acceptance Group', 'ask', 'account', 'ACCEPTANCE prompt text for ACCEPTANCE TEST added command', 'ACCEPTANCE description', 'ACCEPTANCE where-to-find', 'Acceptance box', '2026-11-20', 'confirmed'].every(v => t.indexOf(v) >= 0), 'Test 1: opened added record shows group, kind, badge, text, description, location, fill-in box, date, status');
      ok(await open(rm), 'Test 1: removed line opens'); const rt = (await rm.locator('pre').allTextContents()).filter(x => x && x !== 'none'); ok(rt.length >= 6, 'Test 1: removed record shows its old values (' + rt.length + ' non-empty)');
      // keyboard exactly as the instructions say, on a fresh preview (all lines closed, as the owner would see it)
      await app.click('#catCancelBtn'); await paste('1');
      await app.focus('#catImportGo'); await app.keyboard.press('Tab'); let k1 = await app.evaluate(() => document.activeElement.tagName); await app.keyboard.press('Enter');
      let o1 = await app.evaluate(() => document.activeElement.parentElement.open); await app.keyboard.press('Enter'); let o2 = await app.evaluate(() => document.activeElement.parentElement.open); await app.keyboard.press('Space'); let o3 = await app.evaluate(() => document.activeElement.parentElement.open); await app.keyboard.press('Space'); let o4 = await app.evaluate(() => document.activeElement.parentElement.open);
      ok(k1 === 'SUMMARY' && o1 === true && o2 === false && o3 === true && o4 === false, 'Test 1: Tab reaches a line; Enter opens/closes; Space opens/closes');
    }
    if (k.id === '2') {
      const card = rowOf('+ New chatbot: Acceptance Bot (2 commands'), c1 = rowOf('+ Acceptance Bot: Acceptance command one'), c2 = rowOf('+ Acceptance Bot: Acceptance command two');
      ok(await card.count() === 1 && await c1.count() === 1 && await c2.count() === 1, 'Test 2: new-chatbot line and both command lines are present');
      await open(card); await open(c2); const ct = await card.textContent(), t2 = await c2.textContent();
      ok(['Acceptance Maker', '12345', 'ACCEPTANCE card summary', 'ACCEPTANCE free-plan note', 'ACCEPTANCE notes for the new chatbot'].every(v => ct.indexOf(v) >= 0) && /paid/.test(t2), 'Test 2: chatbot details, notes and the second command\'s paid badge are shown');
    }
    if (k.id === '3') {
      const lines = await app.$$eval('#catDiffList > li', e => e.map(x => x.textContent)); const head = lines.find(x => /^- Removed chatbot: /.test(x)); const cm = lines.filter(x => /^- [A-Za-z ]+: /.test(x) && !/Removed chatbot/.test(x));
      ok(!!head && cm.length === k.total - 2, 'Test 3: removed-chatbot line plus ' + cm.length + ' command lines');
      const li = app.locator('#catDiffList > li').filter({ hasText: '- Removed chatbot: ' }).first(); await open(li); const pres = (await li.locator('pre').allTextContents()).filter(x => x && x !== 'none'); ok(pres.length >= 9, 'Test 3: removed chatbot record shows card details and notes (' + pres.length + ' non-empty values)');
    }
    if (k.id === '4') {
      ok(/Showing 500 of 631 changes\. Install is turned off/.test(d) && await app.locator('#catShowAllBtn').count() === 1 && await app.locator('#catInstallBtn').isDisabled(), 'Test 4: "Showing 500 of 631", Show-all button present, Install greyed out');
      await app.locator('#catInstallBtn').click({ force: true, timeout: 1500 }).catch(() => {}); await app.focus('#catInstallBtn').catch(() => {}); await app.keyboard.press('Enter');
      ok(await app.evaluate(() => localStorage.getItem('pb-catalog-v1') === null), 'Test 4: pressing the greyed-out button (click and Enter) installs nothing');
      await app.click('#catShowAllBtn'); ok(/Showing all 631 of 631/.test(await app.textContent('#catShownCount')) && !(await app.locator('#catInstallBtn').isDisabled()), 'Test 4: after Show all, it says all 631 are shown and Install becomes usable');
    }
    if (k.id === '5') {
      const li = rowOf('+ ChatGPT: Hostile <b>bold</b> test'); ok(await li.count() === 1, 'Test 5: the label shows the angle brackets literally'); await open(li);
      const pres = await li.locator('pre').allTextContents(); const HT = '<img src=x onerror="alert(1)"> <script>alert(2)</script> <b>bold?</b>';
      ok(pres.filter(x => x === HT).length === 3 && (await app.$$('#catDiff img')).length === 0 && (await app.$$('#catDiff script')).length === 0 && dialogs.length === 0, 'Test 5: booby-trapped text appears exactly as plain characters; no image, no script, no pop-up');
      ok(await app.evaluate(() => ![...document.querySelectorAll('#catDiffList summary b, #catDiffList pre b, #catDiffList pre *')].length), 'Test 5: nothing inside the text itself was turned into bold or any other element');
    }
    ok(await app.evaluate(() => localStorage.getItem('pb-catalog-v1') === null && CATALOG.rev === 1), 'Test ' + k.id + ': nothing was installed');
    if (await app.$('#catCancelBtn')) await app.click('#catCancelBtn');
    ok(await app.locator('#catDiff').isHidden() && await app.evaluate(() => localStorage.getItem('pb-catalog-v1') === null), 'Test ' + k.id + ': Cancel closes the preview and installs nothing');
  }
  // kit page itself: results box works, no errors, no network, usable on a phone-width screen
  await kit.bringToFront(); await kit.check('input[name=r1][value=PASS]'); await kit.check('input[name=r4][value=FAIL]'); await kit.fill('#note4', 'test note');
  const rep = await kit.inputValue('#report'); ok(/Test 1: Add one command and remove another -> PASS/.test(rep) && /Test 4: .* -> FAIL \(test note\)/.test(rep) && /Test 2: .* -> SKIPPED/.test(rep), 'kit: results summary reflects Pass/Fail/Not tried and notes');
  await kit.setViewportSize({ width: 390, height: 800 }); ok(await kit.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'kit: no sideways scrolling at phone width (390px)');
  await kit.screenshot({ path: process.env.KIT_SHOT || '/tmp/kit.png', fullPage: false });
  ok(errs.length === 0 && reqs.length === 0 && dialogs.length === 0, 'no page errors, no network requests, no pop-ups (' + JSON.stringify({ errs, reqs, dialogs }) + ')');
  console.log(pass + ' passed, ' + fail + ' failed'); await b.close(); process.exit(fail ? 1 : 0);
})();
