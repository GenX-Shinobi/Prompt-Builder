// Reproduction for PB-550-01 short-viewport split reveal. Usage: node repro.js path/to/index.html
const { chromium } = require('playwright');
const path = require('path');
const FILE = 'file://' + path.resolve(process.argv[2]);
const SIZES = (process.env.SIZES || '320x640,320x568,320x480,320x420,320x360,360x400').split(',').map(s => s.split('x').map(Number));
const CASES = [
  { name: 'guided task box', hash: '#guided', field: '#guideTask', btn: 'guideLaunchBtn' },
  { name: 'standard core', hash: '', field: '#corePrompt', btn: 'coreLaunchBtn' },
  { name: 'standard console', hash: '', field: '#corePrompt', btn: 'launchBtn' },
  { name: 'guided console (edited)', hash: '#guided', field: '#guideTask', btn: 'launchBtn', edit: true },
];
(async () => {
  const b = await chromium.launch();
  let bad = 0;
  for (const [w, h] of SIZES) for (const c of CASES) {
    const ctx = await b.newContext({ hasTouch: !!process.env.TOUCH, isMobile: !!process.env.TOUCH, viewport: { width: w, height: h }, permissions: ['clipboard-read', 'clipboard-write'] });
    const p = await ctx.newPage();
    await p.addInitScript(() => { window.open = () => ({}); window.confirm = () => true; });
    await p.goto(FILE + c.hash); await p.waitForTimeout(250);
    await p.click('.botcard[data-bot="Claude"]');
    const limit = await p.evaluate(() => currentBot.limit);
    const para = 'context '.repeat(60).trim() + '.';
    const n = Math.ceil(limit * 5.3 / (para.length + 1));
    const text = Array.from({ length: n }, (_, i) => 'Note ' + (i + 1) + ': ' + para).join('\n');
    await p.evaluate(([sel, t]) => { const e = document.querySelector(sel); e.value = t; e.dispatchEvent(new Event('input', { bubbles: true })); }, [c.field, text]);
    await p.waitForTimeout(100);
    if (c.edit) {
      const ok = await p.evaluate(() => { const e = document.getElementById('promptPreview'); if (!e.isContentEditable) return false; e.textContent += '\nEDITED'; e.dispatchEvent(new Event('input', { bubbles: true })); return true; });
      if (!ok) { await ctx.close(); continue; }
    }
    // put the pressed button near the top of the visible area
    await p.evaluate(id => { const e = document.getElementById(id); window.scrollBy({ top: e.getBoundingClientRect().top - 12, behavior: 'instant' }); }, c.btn);
    await p.waitForTimeout(200); const pre = await p.evaluate(id => Math.round(document.getElementById(id).getBoundingClientRect().top), c.btn);
    if (process.env.TOUCH) await p.tap('#' + c.btn); else await p.click('#' + c.btn); await p.waitForTimeout(700);
    const m = await p.evaluate(id => {
      const R = e => { const r = e.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom)]; };
      const btn = document.getElementById(id), box = document.getElementById('splitBox'), first = box.querySelector('.parts button');
      return { parts: splitParts.length, vh: innerHeight, btn: R(btn), box: R(box), p1: first ? R(first) : null };
    }, c.btn);
    const p1vis = m.p1 && m.p1[0] >= 0 && m.p1[1] <= m.vh, bvis = m.btn[0] >= 0 && m.btn[1] <= m.vh;
    if (!p1vis) bad++;
    console.log(`${w}x${h} ${c.name.padEnd(24)} pre=${pre} parts=${m.parts} btn=${m.btn} box=${m.box} part1=${m.p1} -> part1 ${p1vis ? 'VISIBLE' : 'OFFSCREEN'}, button ${bvis ? 'visible' : 'off'}`);
    await ctx.close();
  }
  console.log('Copy part 1 offscreen in ' + bad + ' case(s)');
  await b.close();
})();
