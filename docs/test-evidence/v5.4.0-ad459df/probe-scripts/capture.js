const { chromium } = require('playwright');
const path = require('path');
const [,, file, out, scheme, w, h, full] = process.argv;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, colorScheme: scheme });
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve(file), { waitUntil: 'load' });
  await p.waitForTimeout(1500);
  const info = await p.evaluate(() => {
    const n = [...document.querySelectorAll('*')].find(e => e.children.length===0 && /Versatile all-rounder/.test(e.textContent));
    const host = n && n.closest('[id],[class]');
    return { theme: document.documentElement.getAttribute('data-theme') || document.documentElement.className,
      noteTag: host && host.tagName, noteId: host && host.id, noteClass: host && host.className,
      noteFont: n && getComputedStyle(n).fontSize, hOverflow: document.documentElement.scrollWidth > innerWidth,
      scrollW: document.documentElement.scrollWidth, version: (document.documentElement.outerHTML.match(/currentVersion["']?\s*[:=]\s*["']([\d.]+)/)||[])[1] };
  });
  await p.screenshot({ path: out, type: out.endsWith('.png')?'png':'jpeg', ...(out.endsWith('.png')?{}:{quality:90}), fullPage: full==='1' });
  console.log(JSON.stringify({ out, scheme, w, h, ...info, errors: errs }));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
