/* PB-550-01 Guided Path checks (v5.5.0 test build).
   Usage: node tests/browser_guided.js [path/to/index.html] [screenshot-dir]
   Automated headless Chromium, plus device emulation for narrow touch screens.
   Emulation is not a real-device test. */
const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path'), os = require('os');
const ROOT = path.join(__dirname, '..');
const FILE = 'file://' + path.resolve(process.argv[2] || path.join(ROOT, 'index.html'));
const SHOTS = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'pb-guided-'));
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
const shown = (p, sel) => p.evaluate(s => { const e = document.querySelector(s); if (!e) return false; const r = e.getBoundingClientRect(); return getComputedStyle(e).display !== 'none' && !e.hidden && r.width > 0 && r.height > 0; }, sel);

(async () => {
  const b = await chromium.launch();

  /* ---------- 1. Default stays the standard builder ---------- */
  let { ctx, p, errs, net } = await open(b);
  let st = await p.evaluate(() => ({
    gp: document.getElementById('modeGuided').getAttribute('aria-pressed'), sp: document.getElementById('modeStandard').getAttribute('aria-pressed'),
    card: document.getElementById('guideCard').hidden, ce: document.getElementById('promptPreview').hasAttribute('contenteditable'),
    secs: [...document.querySelectorAll('main > section[data-sec]')].map(s => s.dataset.sec + ':' + (getComputedStyle(s).display !== 'none')).join(','),
    title: document.getElementById('consoleTitle').textContent
  }));
  ok(st.gp === 'false' && st.sp === 'true' && st.card && !st.ce && st.title === 'COMPILED PROMPT', 'default: standard builder selected, guided card hidden, preview read-only');
  ok(st.secs === 'modules:true,core:true,presets:true,devbay:true', 'default: all four standard sections visible ' + st.secs);

  /* ---------- 2. Enter the Guided path ---------- */
  await p.click('#modeGuided');
  st = await p.evaluate(() => ({
    gp: document.getElementById('modeGuided').getAttribute('aria-pressed'), card: document.getElementById('guideCard').hidden,
    secs: [...document.querySelectorAll('main > section[data-sec]')].map(s => s.dataset.sec + ':' + (getComputedStyle(s).display !== 'none')).join(','),
    ce: document.getElementById('promptPreview').getAttribute('contenteditable'), role: document.getElementById('promptPreview').getAttribute('role'),
    title: document.getElementById('consoleTitle').textContent, hash: location.hash, prev: document.getElementById('promptPreview').textContent,
    start: getComputedStyle(document.getElementById('startHere')).display
  }));
  ok(st.gp === 'true' && !st.card, 'guided: switch pressed and guided card shown');
  ok(st.secs === 'modules:false,core:false,presets:false,devbay:false', 'guided: standard build sections and Dev Bay hidden, so the prompt follows the guided card ' + st.secs);
  ok(st.ce === 'plaintext-only' && st.role === 'textbox' && /EDITABLE/.test(st.title), 'guided: console preview is an editable plain-text textbox');
  ok(st.hash === '#guided' && st.prev === '' && st.start === 'none', 'guided: #guided in address, empty preview, Start here panel hidden');

  /* ---------- 3. Empty task cannot be launched ---------- */
  await p.click('#launchBtn');
  st = await p.evaluate(() => ({ t: document.getElementById('toast').textContent, n: window.__opened.length }));
  ok(/Describe your task first/.test(st.t) && st.n === 0, 'guided: empty task gives a plain message and opens nothing');

  /* ---------- 4. Without the optional answer format ---------- */
  const TASK = 'I need to write a polite email asking my landlord to fix the heating before the weekend.';
  await p.fill('#guideTask', TASK);
  let prev = await p.textContent('#promptPreview');
  ok(prev.includes('MY TASK:\n' + TASK) && !/ANSWER FORMAT/.test(prev), 'no format: prompt has the task and no answer-format section');
  ok(/ask me up to 3 short questions/.test(prev), 'no format: prompt asks the AI to check for missing details first');
  ok(+(await p.textContent('#tokenCount')).replace(/,/g, '') > 0 && /characters/.test(await p.textContent('#charCount')), 'no format: size meters update');
  await p.click('#launchBtn');
  st = await p.evaluate(() => ({ o: window.__opened.slice(-1)[0], t: document.getElementById('toast').textContent }));
  ok((await clip(p)) === prev && /chatgpt\.com|openai/.test(st.o || ''), 'no format: Copy & launch copies exactly the prompt and opens the selected chatbot');

  /* ---------- 5. With each answer format ---------- */
  const fm = { steps: /numbered steps/, compare: /side by side in a table/, draft: /ready-to-use draft/, summary: /key points/, checklist: /checklist/ };
  for (const [v, re] of Object.entries(fm)) {
    await p.click('label.pill:has(input[name=\"guideFmt\"][value=\"' + v + '\"])');
    prev = await p.textContent('#promptPreview');
    ok(/ANSWER FORMAT:\n/.test(prev) && re.test(prev) && prev.includes(TASK), 'format "' + v + '": answer-format line added');
  }
  await p.click('label.pill:has(input[name=\"guideFmt\"][value=\"\"])');
  ok(!/ANSWER FORMAT/.test(await p.textContent('#promptPreview')), 'format back to "No preference" removes the format line');
  await p.click('label.pill:has(input[name=\"guideFmt\"][value=\"steps\"])');

  /* ---------- 6. Edit the prompt by keyboard ---------- */
  await p.focus('#promptPreview');
  await p.keyboard.press('Control+End');
  await p.keyboard.press('Enter');
  await p.keyboard.type('Keep it under 120 words.');
  prev = await p.textContent('#promptPreview');
  ok(/numbered steps I can follow in order\.\nKeep it under 120 words\.$/.test(prev), 'edit: typed text and a new line stay plain text in the preview');
  ok(await p.evaluate(() => !document.getElementById('promptPreview').querySelector('*')), 'edit: no markup inserted into the preview');
  ok(await shown(p, '#guideRebuild'), 'edit: Rebuild from my answers appears');
  await p.click('#launchBtn');
  ok((await clip(p)) === prev, 'edit: Copy & launch copies the edited prompt exactly');
  await p.fill('#guideTask', TASK + ' The flat is in Leeds.');
  ok((await p.textContent('#promptPreview')) === prev && /not applied/.test(await p.textContent('#guideStatus')), 'edit: changing answers never overwrites edits, and says so');
  await p.click('#guideRebuild');
  prev = await p.textContent('#promptPreview');
  ok(prev.includes('The flat is in Leeds.') && !/120 words/.test(prev) && !(await shown(p, '#guideRebuild')), 'rebuild: prompt rebuilt from the new answers');

  /* ---------- 7. Reused chatbot selector, budget and splitting ---------- */
  await p.click('.botcard[data-bot="Claude"]');
  st = await p.evaluate(() => ({ lb: document.getElementById('launchBtn').textContent, prev: document.getElementById('promptPreview').textContent, lim: LIMIT_CHARS }));
  ok(/Claude/.test(st.lb) && st.prev === prev, 'chatbot switch: launch button follows the bot and the guided prompt is kept');
  await p.click('#launchBtn');
  ok(/claude\.ai/.test(await p.evaluate(() => window.__opened.slice(-1)[0])), 'chatbot switch: Copy & launch opens the newly selected chatbot');
  const long = 'Please help me tidy this list. '.repeat(Math.ceil(st.lim / 30) + 40);
  await p.fill('#guideTask', long);
  await p.click('#launchBtn');
  st = await p.evaluate(() => ({ box: !document.getElementById('splitBox').hidden, parts: document.querySelectorAll('#splitBox .parts button').length, warn: document.getElementById('limitStatus').className }));
  ok(st.box && st.parts >= 2, 'over budget: guided prompt is split into ' + st.parts + ' parts with the existing splitter');
  ok(/^\[PART 1 OF/.test(await clip(p)), 'over budget: part 1 is on the clipboard');
  await p.fill('#guideTask', TASK);

  /* ---------- 8. Standard builder still builds and copies ---------- */
  await p.focus('#promptPreview'); await p.keyboard.press('Control+End'); await p.keyboard.type(' EDITED-MARK');
  const guidedEdited = await p.textContent('#promptPreview');
  await p.click('#modeStandard');
  st = await p.evaluate(() => ({ ce: document.getElementById('promptPreview').hasAttribute('contenteditable'), hash: location.hash, title: document.getElementById('consoleTitle').textContent, secs: [...document.querySelectorAll('main > section[data-sec]')].filter(s => getComputedStyle(s).display !== 'none').length }));
  ok(!st.ce && st.hash === '' && st.title === 'COMPILED PROMPT' && st.secs === 4, 'back to standard: preview read-only, sections back, #guided removed');
  await p.fill('#corePrompt', 'Standard builder check');
  await p.locator('#panels .panel.active .pill').first().click();
  prev = await p.textContent('#promptPreview');
  ok(/USER PROMPT:\nStandard builder check/.test(prev) && /SYSTEM COMMANDS/.test(prev) && !/EDITED-MARK/.test(prev), 'standard: compiles commands + core prompt, no guided text leaks in');
  await p.click('#launchBtn');
  ok((await clip(p)) === prev, 'standard: Copy & launch copies the compiled prompt');
  await p.click('#modeGuided');
  ok((await p.textContent('#promptPreview')) === guidedEdited, 'return to guided: your edited guided prompt is restored');

  /* ---------- 9. Reset all clears guided answers ---------- */
  await p.click('.console-actions .btn-ghost');
  st = await p.evaluate(() => ({ t: document.getElementById('guideTask').value, f: document.querySelector('input[name="guideFmt"]:checked').value, prev: document.getElementById('promptPreview').textContent, rb: document.getElementById('guideRebuild').hidden }));
  ok(st.t === '' && st.f === '' && st.prev === '' && st.rb, 'Reset all: clears the task, format and edits');

  /* ---------- 10. Clean export never carries guided state ---------- */
  await p.fill('#guideTask', 'PRIVATE-GUIDED-MARKER'); await p.click('label.pill:has(input[name=\"guideFmt\"][value=\"draft\"])');
  const cs = await p.evaluate(() => getCleanSource());
  ok(!/PRIVATE-GUIDED-MARKER/.test(cs) && !/class="wrap guided"/.test(cs) && /id="guideCard" hidden=""/.test(cs) && /currentVersion: "5\.5\.0-test\.2"/.test(cs), 'clean source: no guided text or mode, card hidden, version 5.5.0-test.2');
  const cdoc = await p.evaluate(h => { const d = new DOMParser().parseFromString(h, 'text/html'); const pv = d.getElementById('promptPreview'); return { ce: pv.hasAttribute('contenteditable'), chk: [...d.querySelectorAll('input[name="guideFmt"]')].filter(r => r.hasAttribute('checked')).map(r => r.value).join('|') }; }, cs);
  ok(!cdoc.ce && cdoc.chk === '', 'clean source: preview read-only, only "No preference" pre-checked');

  /* ---------- 11. Keyboard-only path ---------- */
  await p.click('#modeStandard');
  await p.focus('#modeStandard'); await p.keyboard.press('Shift+Tab');
  ok(await p.evaluate(() => document.activeElement.id === 'modeGuided'), 'keyboard: mode buttons are in tab order');
  await p.keyboard.press('Enter');
  ok(await p.evaluate(() => guideMode), 'keyboard: Enter on Guided path switches mode');
  await p.focus('#modeStandard'); await p.keyboard.press('Space');
  ok(await p.evaluate(() => !guideMode), 'keyboard: Space on Standard builder switches back');
  await p.focus('#modeGuided'); await p.keyboard.press('Space');
  await p.focus('#guideTask'); await p.keyboard.type('Plan a cheap weekly dinner menu for two.');
  await p.keyboard.press('Tab');
  st = await p.evaluate(() => document.activeElement.name);
  ok(st === 'guideFmt', 'keyboard: Tab moves from the task box to the format choices');
  const order = ['', 'steps', 'compare', 'draft', 'summary', 'checklist'];
  const before = await p.evaluate(() => guideFormat());
  await p.keyboard.press('ArrowRight');
  const after = await p.evaluate(() => guideFormat()), want = order[(order.indexOf(before) + 1) % order.length];
  ok(after === want && (want === '' || /ANSWER FORMAT/.test(await p.textContent('#promptPreview'))), 'keyboard: arrow keys choose the next format (' + JSON.stringify(before) + ' to ' + JSON.stringify(after) + ') and the prompt follows');
  const ring = await p.evaluate(() => { const r = document.activeElement; const pill = r.nextElementSibling; return getComputedStyle(pill).outlineStyle; });
  ok(ring !== 'none', 'keyboard: focused format choice shows a visible focus ring (' + ring + ')');
  await p.focus('#promptPreview');
  ok(await p.evaluate(() => getComputedStyle(document.activeElement).outlineStyle !== 'none'), 'keyboard: editable prompt shows a visible focus outline');
  await p.focus('#launchBtn'); await p.keyboard.press('Enter');
  ok(/Plan a cheap weekly dinner menu/.test(await clip(p)), 'keyboard: Enter on Copy & launch copies the guided prompt');
  ok(errs.length === 0, 'no page or console errors in the desktop flow ' + JSON.stringify(errs));
  ok(net.length === 0, 'no network requests during the whole flow ' + JSON.stringify(net.slice(0, 3)));
  await p.screenshot({ path: path.join(SHOTS, 'guided-desktop-1360.png'), fullPage: false });
  await p.evaluate(() => applyTheme('dark')); await p.mouse.move(5, 5); await p.waitForTimeout(800); await p.screenshot({ path: path.join(SHOTS, 'guided-desktop-dark-1360.png') });
  await ctx.close();

  /* ---------- 12. #guided address opens the Guided path ---------- */
  ({ ctx, p, errs } = await open(b, null, FILE + '#guided'));
  ok(await p.evaluate(() => guideMode && !document.getElementById('guideCard').hidden), '#guided link opens straight into the Guided path');
  await ctx.close();

  /* ---------- 13. Widths: no sideways scrolling, controls reachable ---------- */
  for (const w of [320, 375, 414, 768, 1024, 1360, 1920]) {
    ({ ctx, p, errs } = await open(b, { viewport: { width: w, height: 900 } }, FILE + '#guided'));
    await p.fill('#guideTask', TASK); await p.click('label.pill:has(input[name=\"guideFmt\"][value=\"checklist\"])');
    const m = await p.evaluate(() => {
      const r = id => document.getElementById(id).getBoundingClientRect();
      const inView = id => { const x = r(id); return x.left >= -1 && x.right <= document.documentElement.clientWidth + 1 && x.width > 0; };
      return { over: document.documentElement.scrollWidth - document.documentElement.clientWidth, card: inView('guideCard'), task: inView('guideTask'), prev: inView('promptPreview'), launch: inView('launchBtn'), mg: r('modeGuided').height, ms: r('modeStandard').height, lh: r('launchBtn').height };
    });
    ok(m.over <= 0, w + 'px: no sideways scrolling (overflow ' + m.over + 'px)');
    ok(m.card && m.task && m.prev && m.launch, w + 'px: guided card, task box, prompt and Copy & launch all within the width');
    ok(m.mg >= 44 && m.ms >= 44 && m.lh >= 40, w + 'px: mode buttons ' + Math.round(m.mg) + 'px tall, launch ' + Math.round(m.lh) + 'px');
    ok(errs.length === 0, w + 'px: no errors');
    if ([320, 768, 1920].includes(w)) await p.screenshot({ path: path.join(SHOTS, 'guided-' + w + '.png'), fullPage: true });
    await ctx.close();
  }

  /* ---------- 14. Emulated phone with touch ---------- */
  for (const dn of ['Pixel 7', 'iPhone 13']) {
    const d = Object.assign({}, devices[dn]); delete d.defaultBrowserType;
    ({ ctx, p, errs } = await open(b, d));
    await p.tap('#modeGuided');
    await p.tap('#guideTask'); await p.keyboard.type(TASK);
    await p.tap('label.pill:has(input[value="draft"])');
    ok(guidedOk = /ready-to-use draft/.test(await p.textContent('#promptPreview')), dn + ' (emulated touch): tap to switch mode, type the task and pick a format');
    await p.tap('#promptPreview'); await p.keyboard.press('Control+End'); await p.keyboard.type(' TOUCH-EDIT');
    await p.tap('#launchBtn');
    ok(/TOUCH-EDIT$/.test(await clip(p)) && (await p.evaluate(() => window.__opened.length)) === 1, dn + ' (emulated touch): edit and Copy & launch by tap');
    ok(errs.length === 0, dn + ': no errors');
    await p.screenshot({ path: path.join(SHOTS, 'guided-' + dn.replace(/\s/g, '') + '.png'), fullPage: true });
    await ctx.close();
  }

  /* ---------- 15. Offline: the downloaded file works with the network off ---------- */
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pb-offline-'));
  const copyPath = path.join(tmp, 'Prompt Builder download.html');
  fs.copyFileSync(path.resolve(process.argv[2] || path.join(ROOT, 'index.html')), copyPath);
  {
    const ctx2 = await b.newContext({ offline: true, permissions: ['clipboard-read', 'clipboard-write'] });
    await ctx2.route(/^(?!file:|data:)/, r => r.abort());
    const p2 = await ctx2.newPage(); const e2 = [];
    p2.on('pageerror', e => e2.push(e.message));
    await p2.addInitScript(() => { window.__opened = []; window.open = u => { window.__opened.push(u); return {}; }; });
    await p2.goto('file://' + copyPath + '#guided'); await p2.waitForTimeout(300);
    await p2.fill('#guideTask', TASK); await p2.click('label.pill:has(input[name=\"guideFmt\"][value=\"compare\"])');
    await p2.click('#launchBtn');
    const c2 = await p2.evaluate(() => navigator.clipboard.readText());
    ok(/side by side/.test(c2) && c2.includes(TASK) && e2.length === 0, 'offline downloaded file: Guided path builds and copies with the network off');
    await p2.click('#modeStandard'); await p2.fill('#corePrompt', 'offline standard'); await p2.click('#launchBtn');
    ok(/offline standard/.test(await p2.evaluate(() => navigator.clipboard.readText())), 'offline downloaded file: standard builder still copies');
    await ctx2.close();
  }

  await b.close();
  console.log('Screenshots: ' + SHOTS);
  console.log(pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
let guidedOk;
