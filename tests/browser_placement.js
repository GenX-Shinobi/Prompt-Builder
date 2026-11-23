/* PB-550-01 launch and split placement checks (v5.5.0-test.3).
   - Copy & launch within reach of where the user types: Core prompt (Standard), task box (Guided),
     console button under the editable prompt (Guided, after editing).
   - Over-budget prompts: the ONE existing split box (Copy part 1..N) appears right after the
     Copy & launch the user pressed, in both modes, with no second or stale set elsewhere.
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
const nOpened = p => p.evaluate(() => window.__opened.length);
const MULTI = 'Line one of my request\nLine two with more detail\n\nLine four after a blank line';
const TASK = 'Plan a cheap weekly dinner menu for two people.\nWe have no oven.\nOne of us is vegetarian.';
const LONG_STD = Array.from({ length: 60 }, (_, i) => 'Paragraph ' + (i + 1) + ': ' + 'detail '.repeat(30).trim() + '.').join('\n\n'); // ~13k chars
const LONG_GUIDE = Array.from({ length: 60 }, (_, i) => 'Note ' + (i + 1) + ': ' + 'context '.repeat(28).trim() + '.').join('\n');

/* Geometry of a launch button relative to the field the user types in. */
const geom = (p, fieldSel, btnSel) => p.evaluate(([f, bt]) => {
  const fe = document.querySelector(f), be = document.querySelector(bt);
  const fr = fe.getBoundingClientRect(), br = be.getBoundingClientRect();
  const vis = getComputedStyle(be).display !== 'none' && !be.hidden && br.width > 0 && br.height > 0;
  return { vis, gap: Math.round(br.top - fr.bottom), sameCard: fe.closest('.card') === be.closest('.card'), h: Math.round(br.height), w: Math.round(br.width),
    inWidth: br.left >= -1 && br.right <= document.documentElement.clientWidth + 1 };
}, [fieldSel, btnSel]);
/* With the field scrolled to the top of the screen, is the button fully on screen? */
const onScreenFrom = (p, fieldSel, btnSel) => p.evaluate(([f, bt]) => {
  document.querySelector(f).scrollIntoView({ block: 'start', behavior: 'instant' });
  const br = document.querySelector(bt).getBoundingClientRect();
  return br.top >= 0 && br.bottom <= window.innerHeight;
}, [fieldSel, btnSel]);
/* State of the split box after a launch from button `id`. */
const splitState = (p, id) => p.evaluate(bid => {
  const btn = document.getElementById(bid), box = document.getElementById('splitBox');
  const anchor = btn.closest('.launch-near, .console-actions');
  const r = box.getBoundingClientRect(), first = box.querySelector('.parts button'), fr = first ? first.getBoundingClientRect() : null;
  return {
    shown: !box.hidden && r.height > 0, adjacent: !!anchor && anchor.nextElementSibling === box,
    boxes: document.querySelectorAll('#splitBox').length, sets: document.querySelectorAll('.parts').length,
    partBtns: [...box.querySelectorAll('.parts button')].map(x => x.textContent), n: splitParts.length,
    firstOnScreen: !!fr && fr.top >= 0 && fr.bottom <= window.innerHeight && fr.left >= -1 && fr.right <= document.documentElement.clientWidth + 1,
    firstH: fr ? Math.round(fr.height) : 0,
    btnOnScreen: (() => { const q = btn.getBoundingClientRect(); return q.top >= 0 && q.bottom <= window.innerHeight; })(),
    clearOfToast: !!fr && fr.bottom <= window.innerHeight - (window.innerWidth < 600 ? 150 : 96) + 1,
    gap: Math.round(r.top - (anchor ? anchor.getBoundingClientRect().bottom : 0)),
    parts: splitParts.slice()
  };
}, id);

(async () => {
  const b = await chromium.launch();

  /* ---------- 1. Markup ---------- */
  let { ctx, p, errs, net } = await open(b);
  let st = await p.evaluate(() => [...document.querySelectorAll('[data-launch]')].map(x => ({ id: x.id, tag: x.tagName, type: x.type, oc: x.getAttribute('onclick'), txt: x.textContent, bc: x.style.getPropertyValue('--bc') })));
  ok(st.map(x => x.id).sort().join() === 'coreLaunchBtn,guideLaunchBtn,launchBtn', 'three Copy & launch buttons: console, Core prompt, Guided task box (' + st.map(x => x.id).join() + ')');
  ok(st.every(x => x.tag === 'BUTTON' && x.type === 'button' && x.oc === 'launchBot(this)'), 'every Copy & launch is a native <button type=button> running the shared launchBot(this)');
  ok(st.every(x => x.txt === st[0].txt && /ChatGPT/.test(x.txt) && x.bc === st[0].bc && x.bc), 'all three show the selected chatbot name and colour (' + st[0].txt + ')');
  ok(await p.evaluate(() => document.getElementById('launchBtn').closest('.console-actions') !== null && document.querySelector('.console-actions').nextElementSibling.id === 'splitBox'), 'console Copy & launch and the split box start in their console home');
  ok(await p.evaluate(() => { const t = document.getElementById('guideTask'); return t.nextElementSibling && t.nextElementSibling.contains(document.getElementById('guideLaunchBtn')); }), 'Guided Copy & launch sits directly after the task box, before the optional format choices');
  await p.click('.botcard[data-bot="Claude"]');
  ok((await p.evaluate(() => [...document.querySelectorAll('[data-launch]')].map(x => x.textContent))).every(t => /Claude/.test(t)), 'switching chatbot relabels all three buttons');
  await p.click('.botcard[data-bot="ChatGPT"]');

  /* ---------- 2. Standard: copy/launch parity, multiline, keyboard ---------- */
  await p.click('#corePrompt'); await p.keyboard.type('Line one of my request'); await p.keyboard.press('Enter');
  await p.keyboard.type('Line two with more detail'); await p.keyboard.press('Enter'); await p.keyboard.press('Enter'); await p.keyboard.type('Line four after a blank line');
  ok((await p.inputValue('#corePrompt')) === MULTI && (await nOpened(p)) === 0, 'standard: Enter in the Core prompt adds new lines and never launches');
  const prevStd = await p.textContent('#promptPreview');
  await resetClip(p); await p.click('#coreLaunchBtn'); const cStd = await clip(p), oStd = await lastOpened(p);
  await resetClip(p); await p.click('#launchBtn');
  ok(cStd === prevStd && (await clip(p)) === prevStd && cStd.includes(MULTI), 'standard: Core prompt and console buttons copy the same prompt, line breaks intact');
  ok(/chatgpt\.com/.test(oStd) && oStd === (await lastOpened(p)), 'standard: both open the same chatbot');
  ok(await p.evaluate(() => document.getElementById('splitBox').hidden), 'standard: within budget, no split box is shown');
  await p.focus('#corePrompt'); await p.keyboard.press('Tab');
  ok(await p.evaluate(() => document.activeElement.id) === 'coreLaunchBtn', 'keyboard: Tab from the Core prompt goes straight to its Copy & launch');
  let n0 = await nOpened(p);
  await resetClip(p); await p.keyboard.press('Enter');
  ok((await clip(p)) === prevStd && (await nOpened(p)) === n0 + 1, 'keyboard: Enter on Core prompt Copy & launch copies and launches');
  await resetClip(p); await p.keyboard.press('Space');
  ok((await clip(p)) === prevStd && (await nOpened(p)) === n0 + 2, 'keyboard: Space on Core prompt Copy & launch copies and launches');

  /* ---------- 3. Standard: split follows the launch ---------- */
  await p.click('.botcard[data-bot="Perplexity"]');
  await p.fill('#corePrompt', LONG_STD); await p.waitForTimeout(80);
  n0 = await nOpened(p);
  await resetClip(p); await p.click('#coreLaunchBtn'); await p.waitForTimeout(120);
  let sp = await splitState(p, 'coreLaunchBtn');
  ok(sp.shown && sp.adjacent && sp.gap >= 0 && sp.gap <= 24, 'standard split from Core prompt: Copy part controls appear right under that button (gap ' + sp.gap + 'px)');
  ok(sp.boxes === 1 && sp.sets === 1, 'standard split from Core prompt: exactly one split box and one set of part buttons on the page');
  ok(sp.n > 1 && sp.partBtns.length === sp.n && sp.partBtns.every((t, i) => t === 'Copy part ' + (i + 1) + ' of ' + sp.n), 'standard split: ' + sp.n + ' part buttons in order 1..' + sp.n);
  ok((await clip(p)) === sp.parts[0] && (await nOpened(p)) === n0 + 1 && /perplexity/.test(await lastOpened(p)), 'standard split: part 1 copied and the chatbot opened once');
  ok(sp.firstOnScreen, 'standard split from Core prompt: Copy part 1 is on screen after launch');
  ok(await p.evaluate(() => getComputedStyle(document.getElementById('toast')).pointerEvents === 'none'), 'the launch toast never blocks taps or clicks on the part buttons (pointer-events: none)');
  for (const i of [1, sp.n - 1]) { await resetClip(p); await p.click('#splitBox .parts button >> nth=' + i); ok((await clip(p)) === sp.parts[i], 'standard split: Copy part ' + (i + 1) + ' copies part ' + (i + 1) + ' exactly'); }
  ok(/FINAL PART/.test(sp.parts[sp.n - 1]) && sp.parts.slice(0, -1).every(x => !/FINAL PART/.test(x.slice(0, 200))), 'standard split: last part is marked final, earlier parts are not');
  // keyboard: next Tab after the activated launch button reaches Copy part 1
  await p.focus('#coreLaunchBtn'); await p.keyboard.press('Tab');
  ok(await p.evaluate(() => document.activeElement.closest('#splitBox') !== null && document.activeElement.textContent.startsWith('Copy part 1')), 'keyboard: Tab from Core prompt Copy & launch goes to Copy part 1');
  await resetClip(p); await p.keyboard.press('Tab'); await p.keyboard.press('Enter');
  ok((await clip(p)) === sp.parts[1], 'keyboard: Enter on Copy part 2 copies part 2');
  // now launch from the console: the same box moves there, nothing left under the Core prompt
  await resetClip(p); await p.click('#launchBtn'); await p.waitForTimeout(120);
  let sp2 = await splitState(p, 'launchBtn');
  ok(sp2.shown && sp2.adjacent && sp2.boxes === 1 && sp2.sets === 1, 'standard split from console: the one split box moved under the console button');
  ok(await p.evaluate(() => !document.querySelector('[data-sec="core"] #splitBox')), 'standard: no stale part controls remain in the Core prompt card');
  ok(JSON.stringify(sp2.parts) === JSON.stringify(sp.parts) && (await clip(p)) === sp.parts[0], 'standard: console split produces identical parts and copies part 1');
  ok(sp2.firstOnScreen, 'standard split from console: Copy part 1 is on screen after launch');
  // back under budget hides it and returns it home
  await p.fill('#corePrompt', 'short again'); await p.waitForTimeout(80);
  ok(await p.evaluate(() => document.getElementById('splitBox').hidden && document.querySelector('.console-actions').nextElementSibling.id === 'splitBox'), 'editing back under budget hides the part controls and returns the box to its console home');
  ok(errs.length === 0 && net.length === 0, 'standard: no errors, no network ' + JSON.stringify(errs.concat(net).slice(0, 3)));
  await ctx.close();

  /* ---------- 4. Guided: reach from the task box, formats skipped or chosen, editing, split ---------- */
  ({ ctx, p, errs, net } = await open(b, null, FILE + '#guided'));
  await p.click('#guideTask'); await p.keyboard.type('Plan a cheap weekly dinner menu for two people.'); await p.keyboard.press('Enter');
  await p.keyboard.type('We have no oven.'); await p.keyboard.press('Enter'); await p.keyboard.type('One of us is vegetarian.');
  ok((await p.inputValue('#guideTask')) === TASK && (await nOpened(p)) === 0, 'guided: Enter in the task box adds new lines and never launches');
  ok(await p.evaluate(() => guideFormat() === ''), 'guided: format choices skipped (No preference)');
  let g = await geom(p, '#guideTask', '#guideLaunchBtn');
  ok(g.vis && g.sameCard && g.gap >= 0 && g.gap <= 24, 'guided (format skipped): Copy & launch directly under the task box (gap ' + g.gap + 'px)');
  const prevNoFmt = await p.textContent('#promptPreview');
  await resetClip(p); await p.click('#guideLaunchBtn');
  ok((await clip(p)) === prevNoFmt && prevNoFmt.includes(TASK) && !/ANSWER FORMAT/.test(prevNoFmt) && /chatgpt\.com/.test(await lastOpened(p)), 'guided (format skipped): task-box button copies the prompt with line breaks and launches');
  await p.focus('#guideTask'); await p.keyboard.press('Tab');
  ok(await p.evaluate(() => document.activeElement.id) === 'guideLaunchBtn', 'keyboard: Tab from the task box goes straight to its Copy & launch');
  n0 = await nOpened(p);
  await resetClip(p); await p.keyboard.press('Enter');
  ok((await clip(p)) === prevNoFmt && (await nOpened(p)) === n0 + 1, 'keyboard: Enter on task-box Copy & launch copies and launches');
  await resetClip(p); await p.keyboard.press('Space');
  ok((await clip(p)) === prevNoFmt && (await nOpened(p)) === n0 + 2, 'keyboard: Space on task-box Copy & launch copies and launches');
  await p.click('label.pill:has(input[name="guideFmt"][value="checklist"])');
  const prevFmt = await p.textContent('#promptPreview');
  await resetClip(p); await p.click('#guideLaunchBtn'); const cG = await clip(p);
  await resetClip(p); await p.click('#launchBtn');
  ok(cG === prevFmt && (await clip(p)) === prevFmt && /checklist/.test(cG), 'guided (format chosen): task-box and console buttons copy the same prompt');
  await p.click('#promptPreview'); await p.keyboard.press('Control+End'); await p.keyboard.press('Enter'); await p.keyboard.type('EDITED-LINE');
  const edited = await p.textContent('#promptPreview');
  g = await geom(p, '#promptPreview', '#launchBtn');
  ok(/\nEDITED-LINE$/.test(edited) && g.vis && g.gap >= 0 && g.gap <= 40, 'guided (editing): console Copy & launch directly under the editable prompt (gap ' + g.gap + 'px)');
  await resetClip(p); await p.click('#launchBtn'); const e1 = await clip(p);
  await resetClip(p); await p.click('#guideLaunchBtn');
  ok(e1 === edited && (await clip(p)) === edited, 'guided (editing): console and task-box buttons both copy the edited prompt exactly');
  // split from the task-box button (task over budget)
  await p.evaluate(() => rebuildGuided());
  await p.click('.botcard[data-bot="Perplexity"]');
  await p.fill('#guideTask', LONG_GUIDE); await p.waitForTimeout(80);
  n0 = await nOpened(p);
  await resetClip(p); await p.click('#guideLaunchBtn'); await p.waitForTimeout(120);
  sp = await splitState(p, 'guideLaunchBtn');
  ok(sp.shown && sp.adjacent && sp.gap >= 0 && sp.gap <= 24 && sp.boxes === 1 && sp.sets === 1, 'guided split from task box: Copy part controls right under that button, one set only (gap ' + sp.gap + 'px)');
  ok(sp.n > 1 && sp.partBtns.every((t, i) => t === 'Copy part ' + (i + 1) + ' of ' + sp.n) && (await clip(p)) === sp.parts[0] && (await nOpened(p)) === n0 + 1, 'guided split from task box: ' + sp.n + ' parts in order, part 1 copied, chatbot opened once');
  ok(sp.firstOnScreen, 'guided split from task box: Copy part 1 is on screen after launch');
  await resetClip(p); await p.click('#splitBox .parts button >> nth=1');
  ok((await clip(p)) === sp.parts[1], 'guided split: Copy part 2 copies part 2 exactly');
  await p.focus('#guideLaunchBtn'); await p.keyboard.press('Tab');
  ok(await p.evaluate(() => document.activeElement.closest('#splitBox') !== null), 'keyboard: Tab from task-box Copy & launch goes to Copy part 1');
  // edit the generated prompt, then split from the console button
  await p.click('#promptPreview'); await p.keyboard.press('Control+End'); await p.keyboard.type(' EDIT-TAIL');
  ok(await p.evaluate(() => document.getElementById('splitBox').hidden), 'guided: editing the prompt clears the old part controls (no stale parts)');
  await resetClip(p); await p.click('#launchBtn'); await p.waitForTimeout(120);
  sp2 = await splitState(p, 'launchBtn');
  ok(sp2.shown && sp2.adjacent && sp2.boxes === 1 && sp2.sets === 1 && !(await p.evaluate(() => !!document.querySelector('#guideCard #splitBox'))), 'guided split from console after editing: part controls under the console button, none left in the guided card');
  ok(/EDIT-TAIL/.test(sp2.parts.join('')) && (await clip(p)) === sp2.parts[0], 'guided split after editing: parts built from the edited prompt, part 1 copied');
  ok(sp2.firstOnScreen, 'guided split from console: Copy part 1 is on screen after launch');
  await p.focus('#launchBtn'); await p.keyboard.press('Tab');
  ok(await p.evaluate(() => document.activeElement.textContent) === 'Reset all', 'keyboard (console): Tab order unchanged, Reset all comes first');
  await p.keyboard.press('Tab');
  ok(await p.evaluate(() => document.activeElement.closest('#splitBox') !== null), 'keyboard (console): the next Tab reaches Copy part 1');
  await p.click('#modeStandard');
  ok(await p.evaluate(() => document.getElementById('splitBox').hidden), 'switching mode hides the part controls');
  ok(errs.length === 0 && net.length === 0, 'guided: no errors, no network ' + JSON.stringify(errs.concat(net).slice(0, 3)));
  await ctx.close();

  /* ---------- 5. Clean export ---------- */
  ({ ctx, p } = await open(b));
  await p.click('.botcard[data-bot="Perplexity"]'); await p.fill('#corePrompt', LONG_STD); await p.click('#coreLaunchBtn'); await p.waitForTimeout(100);
  const cs = await p.evaluate(() => getCleanSource());
  const lbs = cs.match(/<button[^>]*data-launch[^>]*>[^<]*<\/button>/g) || [];
  ok(lbs.length === 3 && lbs.every(x => />Copy &amp; launch<\/button>$/.test(x) && !/style=/.test(x)), 'clean source: all three Copy & launch buttons at default label, no bot colour');
  ok((cs.match(/id="splitBox"/g) || []).length === 1 && /<\/div>\s*<div id="splitBox" data-render="" hidden=""><\/div>\s*<\/aside>/.test(cs), 'clean source: one empty, hidden split box in its console home even after a live split elsewhere');
  await ctx.close();

  /* ---------- 6. Reach across widths: typing position and part controls after launch ---------- */
  for (const [w, h] of [[320, 568], [360, 640], [375, 667], [414, 896], [768, 1024], [1024, 768], [1360, 900], [1920, 1080]]) {
    const tag = w + 'x' + h;
    ({ ctx, p, errs } = await open(b, { viewport: { width: w, height: h } }));
    await p.fill('#corePrompt', MULTI);
    g = await geom(p, '#corePrompt', '#coreLaunchBtn');
    ok(g.vis && g.sameCard && g.inWidth && g.gap >= 0 && g.gap <= 24 && g.h >= 44, tag + ' standard: Copy & launch under the Core prompt (gap ' + g.gap + 'px, ' + g.w + 'x' + g.h + ')');
    ok(await onScreenFrom(p, '#corePrompt', '#coreLaunchBtn'), tag + ' standard: Core prompt at top of screen, Copy & launch on screen too');
    await p.click('.botcard[data-bot="Perplexity"]'); await p.fill('#corePrompt', LONG_STD);
    await p.evaluate(() => document.getElementById('coreLaunchBtn').scrollIntoView({ block: 'center', behavior: 'instant' }));
    await p.click('#coreLaunchBtn'); await p.waitForTimeout(100);
    sp = await splitState(p, 'coreLaunchBtn');
    ok(sp.adjacent && sp.firstOnScreen && sp.firstH >= 44 && sp.sets === 1, tag + ' standard split: Copy part 1 right under the pressed button and on screen (' + sp.firstH + 'px tall)');
    ok(sp.btnOnScreen, tag + ' standard split: the pressed Copy & launch stays on screen too');
    ok(sp.clearOfToast, tag + ' standard split: Copy part 1 sits clear of the launch toast');
    const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(over <= 0, tag + ' standard: no sideways scrolling (' + over + ')');
    if ([320, 1360].includes(w)) await p.screenshot({ path: path.join(SHOTS, 'standard-split-' + w + '.png') });
    // worst case: the button is pressed while sitting at the very bottom of the screen
    await p.fill('#corePrompt', 'reset'); await p.fill('#corePrompt', LONG_STD);
    await p.evaluate(() => document.getElementById('coreLaunchBtn').scrollIntoView({ block: 'end', behavior: 'instant' }));
    await p.click('#coreLaunchBtn'); await p.waitForTimeout(100);
    sp = await splitState(p, 'coreLaunchBtn');
    ok(sp.firstOnScreen && sp.btnOnScreen && sp.clearOfToast, tag + ' standard split (button at screen bottom): page scrolls so Copy part 1 and the pressed button are both on screen, clear of the toast');

    await p.click('.botcard[data-bot="ChatGPT"]');
    await p.click('#modeGuided');
    await p.fill('#guideTask', TASK);
    g = await geom(p, '#guideTask', '#guideLaunchBtn');
    ok(g.vis && g.sameCard && g.inWidth && g.gap >= 0 && g.gap <= 24 && g.h >= 44, tag + ' guided (format skipped): Copy & launch under the task box (gap ' + g.gap + 'px, ' + g.w + 'x' + g.h + ')');
    ok(await onScreenFrom(p, '#guideTask', '#guideLaunchBtn'), tag + ' guided: task box at top of screen, Copy & launch on screen too, no scrolling past format choices');
    await p.click('label.pill:has(input[name="guideFmt"][value="steps"])');
    g = await geom(p, '#guideTask', '#guideLaunchBtn');
    ok(g.gap >= 0 && g.gap <= 24, tag + ' guided (format chosen): still directly under the task box');
    g = await geom(p, '#promptPreview', '#launchBtn');
    ok(g.vis && g.gap >= 0 && g.gap <= 40, tag + ' guided (editing): console Copy & launch under the editable prompt (gap ' + g.gap + 'px)');
    await p.click('.botcard[data-bot="Perplexity"]'); await p.fill('#guideTask', LONG_GUIDE);
    await p.evaluate(() => document.getElementById('guideLaunchBtn').scrollIntoView({ block: 'center', behavior: 'instant' }));
    await p.click('#guideLaunchBtn'); await p.waitForTimeout(100);
    sp = await splitState(p, 'guideLaunchBtn');
    ok(sp.adjacent && sp.firstOnScreen && sp.sets === 1, tag + ' guided split: Copy part 1 right under the pressed button and on screen');
    ok(sp.btnOnScreen, tag + ' guided split: the pressed Copy & launch stays on screen too');
    ok(sp.clearOfToast, tag + ' guided split: Copy part 1 sits clear of the launch toast');
    await p.evaluate(() => document.getElementById('launchBtn').scrollIntoView({ block: 'center', behavior: 'instant' }));
    await p.click('#launchBtn'); await p.waitForTimeout(100);
    sp = await splitState(p, 'launchBtn');
    ok(sp.adjacent && sp.firstOnScreen && sp.sets === 1, tag + ' guided split from console: Copy part 1 under the console button and on screen');
    const over2 = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(over2 <= 0 && errs.length === 0, tag + ' guided: no sideways scrolling, no errors');
    if ([320, 1360].includes(w)) await p.screenshot({ path: path.join(SHOTS, 'guided-split-' + w + '.png') });
    await ctx.close();
  }

  /* ---------- 7. Emulated phones with touch ---------- */
  for (const dn of ['Pixel 7', 'iPhone 13', 'iPhone SE']) {
    const d = Object.assign({}, devices[dn]); delete d.defaultBrowserType;
    ({ ctx, p, errs } = await open(b, d));
    await p.tap('#corePrompt'); await p.keyboard.type('Touch line one'); await p.keyboard.press('Enter'); await p.keyboard.type('Touch line two');
    await resetClip(p); await p.tap('#coreLaunchBtn');
    ok(/Touch line one\nTouch line two/.test(await clip(p)) && (await nOpened(p)) === 1, dn + ' (emulated touch) standard: tap Copy & launch under the Core prompt');
    await p.tap('.botcard[data-bot="Perplexity"]'); await p.fill('#corePrompt', LONG_STD);
    await p.evaluate(() => document.getElementById('coreLaunchBtn').scrollIntoView({ block: 'center', behavior: 'instant' }));
    await p.tap('#coreLaunchBtn'); await p.waitForTimeout(100);
    sp = await splitState(p, 'coreLaunchBtn');
    await resetClip(p); await p.tap('#splitBox .parts button >> nth=1');
    ok(sp.adjacent && sp.firstOnScreen && (await clip(p)) === sp.parts[1], dn + ' (emulated touch) standard split: parts under the tapped button; tap Copy part 2 copies part 2');
    await p.tap('.botcard[data-bot="ChatGPT"]');
    await p.tap('#modeGuided');
    await p.tap('#guideTask'); await p.keyboard.type('Touch task'); await p.keyboard.press('Enter'); await p.keyboard.type('second line');
    await resetClip(p); await p.tap('#guideLaunchBtn');
    ok(/Touch task\nsecond line/.test(await clip(p)), dn + ' (emulated touch) guided: tap Copy & launch under the task box (no format picked)');
    await p.tap('#promptPreview'); await p.keyboard.press('Control+End'); await p.keyboard.type(' TOUCH-EDIT');
    await resetClip(p); await p.tap('#launchBtn');
    ok(/TOUCH-EDIT$/.test(await clip(p)), dn + ' (emulated touch) guided: after editing, tap console Copy & launch copies the edit');
    await p.evaluate(() => rebuildGuided());
    await p.tap('.botcard[data-bot="Perplexity"]'); await p.fill('#guideTask', LONG_GUIDE);
    await p.evaluate(() => document.getElementById('guideLaunchBtn').scrollIntoView({ block: 'center', behavior: 'instant' }));
    await p.tap('#guideLaunchBtn'); await p.waitForTimeout(100);
    sp = await splitState(p, 'guideLaunchBtn');
    await resetClip(p); await p.tap('#splitBox .parts button >> nth=0');
    ok(sp.adjacent && sp.firstOnScreen && (await clip(p)) === sp.parts[0], dn + ' (emulated touch) guided split: parts under the tapped button; tap Copy part 1 works');
    ok(errs.length === 0, dn + ': no errors');
    await p.screenshot({ path: path.join(SHOTS, 'touch-split-' + dn.replace(/\s/g, '') + '.png') });
    await ctx.close();
  }

  /* ---------- 7b. Dark theme screenshots for contrast review ---------- */
  ({ ctx, p } = await open(b, { viewport: { width: 1360, height: 900 } }));
  await p.evaluate(() => applyTheme('dark')); await p.click('.botcard[data-bot="Perplexity"]'); await p.fill('#corePrompt', LONG_STD);
  await p.evaluate(() => document.getElementById('coreLaunchBtn').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await p.click('#coreLaunchBtn'); await p.mouse.move(5, 5); await p.waitForTimeout(3000);
  await p.screenshot({ path: path.join(SHOTS, 'standard-split-dark-1360.png') });
  await p.click('#modeGuided'); await p.fill('#guideTask', LONG_GUIDE);
  await p.evaluate(() => document.getElementById('launchBtn').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await p.click('#launchBtn'); await p.mouse.move(5, 5); await p.waitForTimeout(3000);
  await p.screenshot({ path: path.join(SHOTS, 'guided-console-split-dark-1360.png') });
  await ctx.close();

  /* ---------- 8. On-screen keyboard PROXY (not a real keyboard) ----------
     A Pixel 7 profile with the viewport height cut to 480px stands in for the space left above
     an open Android keyboard. Real Chrome on Android may resize differently; see the evidence README. */
  {
    const d = Object.assign({}, devices['Pixel 7'], { viewport: { width: 412, height: 480 } }); delete d.defaultBrowserType;
    ({ ctx, p, errs } = await open(b, d));
    await p.tap('#corePrompt'); await p.keyboard.type(MULTI);
    ok(await onScreenFrom(p, '#corePrompt', '#coreLaunchBtn'), 'keyboard-open proxy 412x480 standard: Core prompt at top, Copy & launch still on screen');
    await p.tap('#modeGuided'); await p.tap('#guideTask'); await p.keyboard.type(TASK);
    ok(await onScreenFrom(p, '#guideTask', '#guideLaunchBtn'), 'keyboard-open proxy 412x480 guided: task box at top, Copy & launch still on screen');
    await p.screenshot({ path: path.join(SHOTS, 'keyboard-proxy-412x480.png') });
    await ctx.close();
  }

  await b.close();
  console.log('Screenshots: ' + SHOTS);
  console.log(pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
