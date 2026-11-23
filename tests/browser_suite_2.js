const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const FILE = path.resolve(process.argv[2] || path.join(ROOT, 'index.html'));
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('PASS ' + m); } else { fail++; console.log('FAIL ' + m); } };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ acceptDownloads: true, permissions: ['clipboard-read', 'clipboard-write'], viewport: { width: 1360, height: 900 } });
  const p = await ctx.newPage();
  const errs = [], reqs = [];
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_|Failed to load resource/.test(m.text())) errs.push('CONSOLE ' + m.text()); });
  p.on('request', r => { if (!r.url().startsWith('file:') && !r.url().startsWith('blob:') && !r.url().startsWith('data:')) reqs.push(r.method() + ' ' + r.url()); });
  await p.addInitScript(() => { window.__opened = []; window.open = (u, ...a) => { window.__opened.push([u, ...a].join('|')); return {}; }; window.confirm = () => true; });
  await p.goto('file://' + FILE); await p.waitForTimeout(500);
  ok(reqs.length === 0, 'NO network requests on page load (' + reqs.length + ')');

  // typical usage with NO catalog check: type, pick commands, attach, presets, launch, dev bay, downloads
  await p.fill('#corePrompt', 'PRIVATE-MARKER-9137 résumé 😀 日本語');
  await p.click('.tab[data-target="botcmds"]');
  await p.locator('#botCmdPills .prompt-mod').first().check({ force: true });
  await p.click('.tab:nth-of-type(2)'); await p.waitForTimeout(100);
  await p.setInputFiles('#fileInput', [{ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('ATTACHED-TEXT-5521 hello') }, { name: 'pic.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==', 'base64') }]);
  await p.waitForTimeout(400);
  const compiled = await p.textContent('#promptPreview');
  ok(/PRIVATE-MARKER-9137/.test(compiled) && /ATTACHED-TEXT-5521/.test(compiled) && /pic\.png/.test(compiled), 'attachments: text inlined, image listed in compiled prompt');
  await p.fill('#presetName', 'dup'); await p.click('#presetSaveBtn'); await p.click('#presetSaveBtn');
  ok(await p.evaluate(() => readPresets().filter(x => x.name === 'dup').length === 1), 'saving the same preset name twice keeps one (duplicate handling)');
  await p.click('#launchBtn'); await p.waitForTimeout(300);
  const opened = await p.evaluate(() => window.__opened);
  ok(opened.length === 1 && /chatgpt\.com/.test(opened[0]) && !/PRIVATE-MARKER/.test(opened[0]) && !/\?/.test(opened[0].split('|')[0]), 'Copy & launch opens the bare chatbot URL only: ' + opened[0]);
  await p.evaluate(() => openModificationModal()); await p.fill('#modalChange', 'x'); await p.fill('#modalWhy', 'y');
  await p.evaluate(() => compileModificationPayload());
  const [d1] = await Promise.all([p.waitForEvent('download'), p.click('#modDownloadBtn')]);
  const html = fs.readFileSync(await d1.path(), 'utf8');
  ok(!/PRIVATE-MARKER|ATTACHED-TEXT|Secret|"name":"dup"/.test(html) && /currentVersion: "5\.5\.0-test\.4"/.test(html) && html.trim().endsWith('</html>'), 'Download clean .html: complete, v5.5.0-test.4, no typed text/attachment/preset data');
  await p.click('#presetExportBtn');
  ok(reqs.length === 0, 'STILL zero network requests after typing, attaching, presets, launch, Dev Bay, downloads (' + reqs.length + ')');

  // manual catalog check = the only request
  await p.route('**/raw.githubusercontent.com/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: fs.readFileSync(path.join(ROOT, 'catalog.json'), 'utf8') }));
  await p.click('#catCheckBtn'); await p.waitForTimeout(700);
  ok(reqs.length === 1 && /^GET https:\/\/raw\.githubusercontent\.com\/GenX-Shinobi\/Prompt-Builder\/main\/catalog\.json$/.test(reqs[0]), 'Manual check makes exactly one GET to the GitHub raw URL (no body): ' + JSON.stringify(reqs));
  await p.unroute('**/raw.githubusercontent.com/**');

  // confirm-before-install + failed import does not damage installed catalog
  const rev2 = await p.evaluate(() => { const c = JSON.parse(JSON.stringify(BUILTIN_CATALOG)); c.rev = 2; c.updated = '2026-12-01'; c.CHATBOTS[1].limit = 50000; return JSON.stringify(c); });
  await p.click('#catImportBtn'); await p.fill('#catImportText', rev2); await p.click('#catImportGo');
  ok(await p.evaluate(() => localStorage.getItem('pb-catalog-v1') === null), 'validated + diff shown but NOTHING stored before Install is clicked');
  await Promise.all([p.waitForEvent('load'), p.click('#catInstallBtn')]); await p.waitForTimeout(400);
  ok(await p.evaluate(() => CATALOG.rev === 2 && CHATBOTS[1].limit === 50000), 'installed rev 2 after explicit click');
  const before = await p.evaluate(() => localStorage.getItem('pb-catalog-v1'));
  for (const bad of ['{ nope', '{"rev":3}', JSON.stringify({ rev: 5, updated: '2026-12-02', CHATBOTS: [{ name: 'X' }], TIERS: {}, BOT_NOTES: {}, BOT_CMDS: {} }), '<script>alert(1)</script>']) {
    await p.click('#catImportBtn').catch(() => {});
    await p.evaluate(() => { document.getElementById('catImportBox').hidden = false; });
    await p.fill('#catImportText', bad); await p.click('#catImportGo');
  }
  ok(await p.evaluate(() => localStorage.getItem('pb-catalog-v1')) === before && await p.evaluate(() => CATALOG.rev === 2), 'four invalid imports left the installed catalog untouched');
  ok(await p.evaluate(() => readPresets().length >= 1), 'presets retained after catalog install');
  await p.evaluate(() => localStorage.removeItem('pb-catalog-v1'));

  // theme / palette / layout persistence
  await p.reload(); await p.waitForTimeout(300);
  await p.click('#themeBtn'); await p.selectOption('#paletteSel', 'ocean');
  await p.locator('main > section[data-sec="devbay"] .sec-tools button[aria-label="Pin to top"]').click();
  await p.locator('main > section[data-sec="core"] .sec-tools button[aria-label="Move down"]').click();
  const st1 = await p.evaluate(() => ({ t: document.documentElement.getAttribute('data-theme'), pal: document.documentElement.getAttribute('data-palette'), order: [...document.querySelectorAll('main > section[data-sec]')].map(x => x.dataset.sec).join(',') }));
  await p.reload(); await p.waitForTimeout(300);
  const st2 = await p.evaluate(() => ({ t: document.documentElement.getAttribute('data-theme'), pal: document.documentElement.getAttribute('data-palette'), order: [...document.querySelectorAll('main > section[data-sec]')].map(x => x.dataset.sec).join(',') }));
  ok(JSON.stringify(st1) === JSON.stringify(st2) && st2.pal === 'ocean' && /^devbay/.test(st2.order), 'theme, palette, pin and reorder persist across reload ' + JSON.stringify(st2));
  await p.click('#layoutResetBtn');
  ok(await p.evaluate(() => [...document.querySelectorAll('main > section[data-sec]')].map(x => x.dataset.sec).join(',') === 'modules,core,presets,devbay'), 'Reset layout restores default order');

  // Unicode-safe splitting
  const uni = await p.evaluate(() => {
    const text = Array.from({ length: 400 }, (_, i) => 'P' + i + ' 😀日本語 émoji 👨‍👩‍👧 line ' + 'x'.repeat(30)).join('\n\n');
    const parts = splitPrompt(text, 3000);
    const lone = parts.some(s => /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(s));
    const all = parts.join('');
    let missing = 0; for (let i = 0; i < 400; i++) if (!all.includes('P' + i + ' ')) missing++;
    return { n: parts.length, lone, missing, maxLen: Math.max(...parts.map(s => s.length)) };
  });
  ok(uni.n > 1 && !uni.lone && uni.missing === 0, 'Unicode splitting: ' + JSON.stringify(uni));

  // offline: page works, check fails gracefully
  await ctx.setOffline(true);
  await p.reload().catch(() => {}); await p.waitForTimeout(300);
  await p.fill('#corePrompt', 'offline test');
  ok(/offline test/.test(await p.textContent('#promptPreview')) && await p.evaluate(() => CHATBOTS.length === 9), 'works offline: loads, 9 bots, prompt compiles');
  await p.click('#catCheckBtn'); await p.waitForTimeout(800);
  ok(/Could not reach/.test(await p.textContent('#toast')), 'offline catalog check shows friendly message');
  await ctx.setOffline(false);

  // accessibility basics
  const a11y = await p.evaluate(() => ({
    tablist: !!document.querySelector('[role=tablist]'), radiogroup: !!document.querySelector('[role=radiogroup]'),
    dialog: document.getElementById('modModal').getAttribute('role') === 'dialog',
    unlabeledButtons: [...document.querySelectorAll('button')].filter(x => !(x.textContent.trim() || x.getAttribute('aria-label') || x.title)).length,
    unlabeledInputs: [...document.querySelectorAll('input:not([type=hidden]),textarea,select')].filter(x => !(x.getAttribute('aria-label') || x.id && document.querySelector('label[for="' + x.id + '"]') || x.closest('label') || x.getAttribute('placeholder'))).length
  }));
  ok(a11y.tablist && a11y.radiogroup && a11y.dialog && a11y.unlabeledButtons === 0, 'a11y roles present, no unlabeled buttons ' + JSON.stringify(a11y));
  await p.keyboard.press('Escape');

  console.log('\nrequests seen overall:', JSON.stringify(reqs));
  console.log('errors:', JSON.stringify(errs));
  ok(errs.length === 0, 'no console/page errors');
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  await b.close(); process.exit(fail ? 1 : 0);
})();
