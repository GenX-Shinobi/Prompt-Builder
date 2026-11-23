/* PB-550-01 placement follow-up checks (v5.5.0-test.2): Copy & launch within easy reach
   of the field where the user finishes typing, in Standard builder and Guided path.
   Usage: node tests/browser_placement.js [path/to/index.html] [screenshot-dir]
   Automated headless Chromium plus device emulation. Emulation is not a real-device test. */
const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path'), os = require('os');
const ROOT = path.join(__dirname, '..');
const SRC = path.resolve(process.argv[2] || path.join(ROOT, 'index.html'));
const FILE = 'file://' + SRC;
const SHOTS = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'pb-place-'));
fs.mkdirSync(SHOTS, { recursive: true });
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('PASS ' + m); } else { fail++; console.log('FAIL ' + m); } };

async function open(b, opts, url) {
  const ctx = await b.newContext(Object.assign({ permissions: ['clipboard-read', 'clipboard-write'], viewport: { width: 1360, height: 900 } }, opts || {}));
  const p = await ctx.newPage();
  const errs = [], net = [];
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  p.on('request', r => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) net.push(r.url()); });
  await p.addInitScript(() => { window.__opened = []; window.open = u => { window.__opened.push(u); return {}; }; window.confirm = () => true; });
  await p.goto(url || FILE); await p.waitForTimeout(300);
  return { ctx, p, errs, net };
}
const clip = p => p.evaluate(() => navigator.clipboard.readText());
const resetClip = p => p.evaluate(() => navigator.clipboard.writeText('__EMPTY__'));
const lastOpened = p => p.evaluate(() => window.__opened.slice(-1)[0] || '');
const MULTI = 'Line one of my request\nLine two with more detail\n\nLine four after a blank line';
const TASK = 'Plan a cheap weekly dinner menu for two people.\nWe have no oven.\nOne of us is vegetarian.';

/* Geometry of a launch button relative to the field the user finishes typing in. */
const geom = (p, fieldSel, btnSel) => p.evaluate(([f, bt]) => {
  const fe = document.querySelector(f), be = document.querySelector(bt);
  const fr = fe.getBoundingClientRect(), br = be.getBoundingClientRect();
  const vis = getComputedStyle(be).display !== 'none' && !be.hidden && br.width > 0 && br.height > 0;
  return { vis, gap: Math.round(br.top - fr.bottom), sameCard: fe.closest('.card') === be.closest('.card'), h: Math.round(br.height), w: Math.round(br.width),
    inWidth: br.left >= -1 && br.right <= document.documentElement.clientWidth + 1 };
}, [fieldSel, btnSel]);
/* After the field is scrolled to the top of the screen, is the button fully on screen? */
const onScreenFrom = (p, fieldSel, btnSel) => p.evaluate(([f, bt]) => {
  document.querySelector(f).scrollIntoView({ block: 'start', behavior: 'instant' });
  const br = document.querySelector(bt).getBoundingClientRect();
  return br.top >= 0 && br.bottom <= window.innerHeight;
}, [fieldSel, btnSel]);

(async () => {
  const b = await chromium.launch();

  /* ---------- 1. Markup: three Copy & launch buttons, all native buttons running the same action ---------- */
  let { ctx, p, errs, net } = await open(b);
  let st = await p.evaluate(() => [...document.querySelectorAll('[data-launch]')].map(x => ({ id: x.id, tag: x.tagName, type: x.type, oc: x.getAttribute('onclick'), txt: x.textContent, bc: x.style.getPropertyValue('--bc') })));
  ok(st.map(x => x.id).sort().join() === 'coreLaunchBtn,guideLaunchBtn,launchBtn', 'three Copy & launch buttons: console, Core prompt, Guided step 3 (' + st.map(x => x.id).join() + ')');
  ok(st.every(x => x.tag === 'BUTTON' && x.type === 'button' && x.oc === 'launchBot()'), 'every Copy & launch is a native <button type=button> running launchBot()');
  ok(st.every(x => x.txt === st[0].txt && /ChatGPT/.test(x.txt) && x.bc === st[0].bc && x.bc), 'all three show the selected chatbot name and colour (' + st[0].txt + ')');
  ok(await p.evaluate(() => document.getElementById('launchBtn').closest('.console-actions') !== null), 'console Copy & launch is still in the console, unchanged');
  await p.click('.botcard[data-bot="Claude"]');
  st = await p.evaluate(() => [...document.querySelectorAll('[data-launch]')].map(x => x.textContent));
  ok(st.every(t => /Claude/.test(t)), 'switching chatbot relabels all three buttons');

  /* ---------- 2. Standard builder: copy and launch identical from either button, multiline kept ---------- */
  await p.click('.botcard[data-bot="ChatGPT"]');
  await p.click('#corePrompt'); await p.keyboard.type('Line one of my request'); await p.keyboard.press('Enter');
  await p.keyboard.type('Line two with more detail'); await p.keyboard.press('Enter'); await p.keyboard.press('Enter'); await p.keyboard.type('Line four after a blank line');
  ok((await p.inputValue('#corePrompt')) === MULTI, 'standard: Enter in the Core prompt adds new lines (multiline text typed by keyboard)');
  ok((await p.evaluate(() => window.__opened.length)) === 0, 'standard: pressing Enter while typing never launches');
  const prevStd = await p.textContent('#promptPreview');
  await resetClip(p); await p.click('#coreLaunchBtn');
  const cStd = await clip(p), oStd = await lastOpened(p);
  await resetClip(p); await p.click('#launchBtn');
  ok(cStd === prevStd && (await clip(p)) === prevStd && cStd.includes(MULTI), 'standard: Core prompt button and console button copy the same compiled prompt, line breaks intact');
  ok(/chatgpt\.com/.test(oStd) && oStd === (await lastOpened(p)), 'standard: both open the same chatbot (' + oStd + ')');
  // keyboard activation: Tab from the Core prompt reaches the button
  await p.focus('#corePrompt'); await p.keyboard.press('Tab');
  ok(await p.evaluate(() => document.activeElement.id) === 'coreLaunchBtn', 'keyboard: Tab from the Core prompt goes straight to its Copy & launch');
  ok(await p.evaluate(() => getComputedStyle(document.activeElement).outlineStyle !== 'none' || getComputedStyle(document.activeElement).boxShadow !== 'none'), 'keyboard: focused Core prompt Copy & launch shows a focus indicator');
  let n0 = await p.evaluate(() => window.__opened.length);
  await resetClip(p); await p.keyboard.press('Enter');
  ok((await clip(p)) === prevStd && (await p.evaluate(() => window.__opened.length)) === n0 + 1, 'keyboard: Enter on the Core prompt Copy & launch copies and launches');
  await resetClip(p); await p.keyboard.press('Space');
  ok((await clip(p)) === prevStd && (await p.evaluate(() => window.__opened.length)) === n0 + 2, 'keyboard: Space on the Core prompt Copy & launch copies and launches');

  /* ---------- 3. Standard builder: split behaviour identical ---------- */
  await p.click('.botcard[data-bot="Perplexity"]');
  await p.fill('#corePrompt', 'word '.repeat(4000)); await p.waitForTimeout(100);
  await resetClip(p); await p.click('#coreLaunchBtn'); await p.waitForTimeout(150);
  const sA = await p.evaluate(() => ({ hidden: document.getElementById('splitBox').hidden, parts: splitParts.length, first: splitParts[0], o: window.__opened.slice(-1)[0] }));
  const cA = await clip(p);
  await resetClip(p); await p.click('#launchBtn'); await p.waitForTimeout(150);
  const sB = await p.evaluate(() => ({ hidden: document.getElementById('splitBox').hidden, parts: splitParts.length, first: splitParts[0], o: window.__opened.slice(-1)[0] }));
  ok(!sA.hidden && sA.parts > 1 && cA === sA.first && /perplexity/.test(sA.o), 'standard: over-budget prompt from the Core prompt button splits, copies part 1 and opens the bot (' + sA.parts + ' parts)');
  ok(sA.parts === sB.parts && sA.first === sB.first && (await clip(p)) === cA, 'standard: split result identical from either button');
  // empty Core prompt: both buttons behave the same (the safeguard lines still compile, as before this change)
  await p.click('.botcard[data-bot="ChatGPT"]'); await p.fill('#corePrompt', ''); await p.waitForTimeout(50);
  n0 = await p.evaluate(() => window.__opened.length);
  await resetClip(p); await p.click('#coreLaunchBtn'); const e1 = await clip(p), n1 = await p.evaluate(() => window.__opened.length);
  await resetClip(p); await p.click('#launchBtn'); const e2 = await clip(p), n2 = await p.evaluate(() => window.__opened.length);
  ok(e1 === e2 && n1 - n0 === n2 - n1, 'standard: empty Core prompt behaves identically from either button');
  await ctx.close();

  /* ---------- 4. Guided path: same action, including after editing the generated prompt ---------- */
  ({ ctx, p, errs, net } = await open(b, null, FILE + '#guided'));
  await p.click('#guideTask'); await p.keyboard.type('Plan a cheap weekly dinner menu for two people.'); await p.keyboard.press('Enter');
  await p.keyboard.type('We have no oven.'); await p.keyboard.press('Enter'); await p.keyboard.type('One of us is vegetarian.');
  ok((await p.inputValue('#guideTask')) === TASK && (await p.evaluate(() => window.__opened.length)) === 0, 'guided: Enter in the task box adds new lines and never launches');
  await p.click('label.pill:has(input[name="guideFmt"][value="checklist"])');
  const prevG = await p.textContent('#promptPreview');
  await resetClip(p); await p.click('#guideLaunchBtn');
  const cG = await clip(p), oG = await lastOpened(p);
  await resetClip(p); await p.click('#launchBtn');
  ok(cG === prevG && (await clip(p)) === prevG && cG.includes(TASK) && /checklist/.test(cG), 'guided: step 3 button and console button copy the same prompt, line breaks intact');
  ok(/chatgpt\.com/.test(oG) && oG === (await lastOpened(p)), 'guided: both open the same chatbot');
  await p.click('#promptPreview'); await p.keyboard.press('Control+End'); await p.keyboard.press('Enter'); await p.keyboard.type('EDITED-LINE');
  const edited = await p.textContent('#promptPreview');
  ok(/\nEDITED-LINE$/.test(edited), 'guided: generated prompt edited with an added line');
  await resetClip(p); await p.click('#guideLaunchBtn');
  ok((await clip(p)) === edited, 'guided: after editing, the step 3 button copies the edited prompt exactly');
  await resetClip(p); await p.click('#launchBtn');
  ok((await clip(p)) === edited, 'guided: after editing, the console button copies the edited prompt exactly');
  // keyboard: from the last format choice, Tab reaches step 3's Copy & launch
  await p.focus('input[name="guideFmt"][value="checklist"]'); await p.keyboard.press('Tab');
  ok(await p.evaluate(() => document.activeElement.id) === 'guideLaunchBtn', 'keyboard: Tab from the answer-format choices goes straight to step 3 Copy & launch');
  n0 = await p.evaluate(() => window.__opened.length);
  await resetClip(p); await p.keyboard.press('Enter');
  ok((await clip(p)) === edited && (await p.evaluate(() => window.__opened.length)) === n0 + 1, 'keyboard: Enter on step 3 Copy & launch copies the edited prompt and launches');
  await resetClip(p); await p.keyboard.press('Space');
  ok((await clip(p)) === edited && (await p.evaluate(() => window.__opened.length)) === n0 + 2, 'keyboard: Space on step 3 Copy & launch copies and launches');
  // split in guided
  await p.click('.botcard[data-bot="Perplexity"]');
  await p.evaluate(() => { promptPreviewEl.textContent = 'long '.repeat(3000); promptPreviewEl.dispatchEvent(new Event('input')); });
  await p.click('#guideLaunchBtn'); await p.waitForTimeout(150);
  const sg = await p.evaluate(() => ({ hidden: document.getElementById('splitBox').hidden, parts: splitParts.length, first: splitParts[0] }));
  ok(!sg.hidden && sg.parts > 1 && (await clip(p)) === sg.first, 'guided: over-budget edited prompt splits from the step 3 button (' + sg.parts + ' parts)');
  // mode visibility: each near button only shows in its own mode
  ok(await p.evaluate(() => { const v = id => { const r = document.getElementById(id).getBoundingClientRect(); return r.width > 0 && r.height > 0; }; return v('guideLaunchBtn') && !v('coreLaunchBtn') && v('launchBtn'); }), 'guided: step 3 button shown, Core prompt button hidden with its section');
  await p.click('#modeStandard');
  ok(await p.evaluate(() => { const v = id => { const r = document.getElementById(id).getBoundingClientRect(); return r.width > 0 && r.height > 0; }; return !v('guideLaunchBtn') && v('coreLaunchBtn') && v('launchBtn'); }), 'standard: Core prompt button shown, step 3 button hidden with the guided card');
  ok(errs.length === 0, 'no page or console errors ' + JSON.stringify(errs));
  ok(net.length === 0, 'no network requests ' + JSON.stringify(net.slice(0, 3)));
  await ctx.close();

  /* ---------- 5. Clean export resets every Copy & launch ---------- */
  ({ ctx, p } = await open(b));
  await p.click('.botcard[data-bot="Gemini"]');
  const cs = await p.evaluate(() => getCleanSource());
  const doc = cs.match(/<button[^>]*data-launch[^>]*>[^<]*<\/button>/g) || [];
  ok(doc.length === 3 && doc.every(x => />Copy &amp; launch<\/button>$/.test(x) && !/style=/.test(x)), 'clean source: all three Copy & launch buttons back to default label, no bot colour (' + doc.length + ')');
  await ctx.close();

  /* ---------- 6. Reach across widths (desktop and narrow) ---------- */
  for (const [w, h] of [[320, 568], [360, 640], [375, 667], [414, 896], [768, 1024], [1024, 768], [1360, 900], [1920, 1080]]) {
    ({ ctx, p, errs } = await open(b, { viewport: { width: w, height: h } }));
    await p.fill('#corePrompt', MULTI);
    let g = await geom(p, '#corePrompt', '#coreLaunchBtn');
    ok(g.vis && g.sameCard && g.inWidth && g.gap >= 0 && g.gap <= 24, w + 'x' + h + ' standard: Copy & launch directly under the Core prompt, same card (gap ' + g.gap + 'px)');
    ok(g.h >= 44, w + 'x' + h + ' standard: touch target ' + g.w + 'x' + g.h + 'px');
    ok(await onScreenFrom(p, '#corePrompt', '#coreLaunchBtn'), w + 'x' + h + ' standard: with the Core prompt at the top of the screen, Copy & launch is on screen too');
    const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(over <= 0, w + 'x' + h + ' standard: no sideways scrolling (' + over + ')');
    if ([320, 1360].includes(w)) await p.screenshot({ path: path.join(SHOTS, 'standard-' + w + '.png'), fullPage: false });

    await p.click('#modeGuided');
    await p.fill('#guideTask', TASK); await p.click('label.pill:has(input[name="guideFmt"][value="steps"])');
    g = await geom(p, '#guideFormats', '#guideLaunchBtn');
    ok(g.vis && g.sameCard && g.inWidth && g.gap >= 0 && g.gap <= 140, w + 'x' + h + ' guided: Copy & launch in step 3 just below the answer choices, same card (gap ' + g.gap + 'px)');
    ok(g.h >= 44, w + 'x' + h + ' guided: touch target ' + g.w + 'x' + g.h + 'px');
    ok(await onScreenFrom(p, '#guideFormats', '#guideLaunchBtn'), w + 'x' + h + ' guided: with the answer choices at the top of the screen, Copy & launch is on screen too');
    const g2 = await p.evaluate(() => { const a = document.getElementById('guideTask').getBoundingClientRect(), c = document.getElementById('guideLaunchBtn').getBoundingClientRect(); return Math.round(c.top - a.bottom); });
    console.log('INFO ' + w + 'x' + h + ' guided: task box bottom to step 3 button = ' + g2 + 'px');
    g = await geom(p, '#promptPreview', '#launchBtn');
    ok(g.vis && g.gap >= 0 && g.gap <= 40, w + 'x' + h + ' guided: console Copy & launch directly under the editable prompt (gap ' + g.gap + 'px)');
    const over2 = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(over2 <= 0 && errs.length === 0, w + 'x' + h + ' guided: no sideways scrolling, no errors');
    if ([320, 1360].includes(w)) await p.screenshot({ path: path.join(SHOTS, 'guided-' + w + '.png'), fullPage: false });
    await ctx.close();
  }

  /* ---------- 7. Emulated phones with touch ---------- */
  for (const dn of ['Pixel 7', 'iPhone 13', 'iPhone SE']) {
    const d = Object.assign({}, devices[dn]); delete d.defaultBrowserType;
    ({ ctx, p, errs } = await open(b, d));
    await p.tap('#corePrompt'); await p.keyboard.type('Touch line one'); await p.keyboard.press('Enter'); await p.keyboard.type('Touch line two');
    await resetClip(p); await p.tap('#coreLaunchBtn');
    ok(/Touch line one\nTouch line two/.test(await clip(p)) && (await p.evaluate(() => window.__opened.length)) === 1, dn + ' (emulated touch) standard: tap Core prompt Copy & launch copies multiline prompt and launches');
    await p.tap('#modeGuided');
    await p.tap('#guideTask'); await p.keyboard.type('Touch task'); await p.keyboard.press('Enter'); await p.keyboard.type('second line');
    await p.tap('label.pill:has(input[value="summary"])');
    await resetClip(p); await p.tap('#guideLaunchBtn');
    const c1 = await clip(p);
    ok(/Touch task\nsecond line/.test(c1) && /Keep it short/.test(c1), dn + ' (emulated touch) guided: tap step 3 Copy & launch copies the guided prompt');
    await p.tap('#promptPreview'); await p.keyboard.press('Control+End'); await p.keyboard.type(' TOUCH-EDIT');
    await resetClip(p); await p.tap('#guideLaunchBtn');
    ok(/TOUCH-EDIT$/.test(await clip(p)) && (await p.evaluate(() => window.__opened.length)) === 3, dn + ' (emulated touch) guided: after editing, tap step 3 Copy & launch copies the edit');
    ok(errs.length === 0, dn + ': no errors');
    await p.screenshot({ path: path.join(SHOTS, 'touch-' + dn.replace(/\s/g, '') + '.png'), fullPage: false });
    await ctx.close();
  }

  /* ---------- 8. Dark theme screenshot for contrast review ---------- */
  ({ ctx, p } = await open(b, { viewport: { width: 1360, height: 900 } }));
  await p.evaluate(() => applyTheme('dark')); await p.fill('#corePrompt', MULTI); await p.mouse.move(5, 5); await p.waitForTimeout(600);
  await p.evaluate(() => document.getElementById('corePrompt').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await p.screenshot({ path: path.join(SHOTS, 'standard-dark-1360.png') });
  await ctx.close();

  await b.close();
  console.log('Screenshots: ' + SHOTS);
  console.log(pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
