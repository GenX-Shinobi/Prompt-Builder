// Read-only gate probe for a standalone index.html. Usage: node gates.js <index.html>
const { chromium } = require('playwright'); const path = require('path');
const FILE = 'file://' + path.resolve(process.argv[2]);
const R = { file: FILE, responsive: [], offline: {}, a11y: {} };
(async () => {
  const b = await chromium.launch();
  // Responsive
  for (const [w,h] of [[320,640],[375,812],[414,896],[768,1024],[1024,768],[1440,1000],[1920,1080]]) {
    const p = await b.newPage({ viewport:{width:w,height:h} }); const errs=[];
    p.on('pageerror',e=>errs.push(String(e)));
    await p.goto(FILE); await p.waitForTimeout(500);
    R.responsive.push(await p.evaluate(([w,errs])=>{
      const de=document.documentElement;
      const over=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>innerWidth+1&&getComputedStyle(e).position!=='fixed'&&!e.closest('[hidden],details:not([open])');}).slice(0,5).map(e=>e.tagName+(e.id?'#'+e.id:'')+'.'+String(e.className).split(' ')[0]);
      const hdr=document.querySelector('header, .hero, [class*=hero]');
      let overlap=null;
      if(hdr){ const btns=[...hdr.querySelectorAll('button,select')].filter(x=>x.offsetParent); const txt=[...hdr.querySelectorAll('*')].filter(x=>x.children.length===0&&x.textContent.trim()&&!x.closest('button,select'));
        overlap=[]; for(const bt of btns){const a=bt.getBoundingClientRect(); for(const t of txt){const c=t.getBoundingClientRect(); if(a.left<c.right&&a.right>c.left&&a.top<c.bottom&&a.bottom>c.top) overlap.push((bt.textContent.trim()||bt.tagName)+' x '+t.textContent.trim().slice(0,25));}} }
      const small=[...document.querySelectorAll('button,a,input,select,[role=tab],[role=radio]')].filter(e=>e.offsetParent).filter(e=>{const r=e.getBoundingClientRect();return r.height<24||r.width<24;}).length;
      return {width:w,scrollWidth:de.scrollWidth,hOverflow:de.scrollWidth>innerWidth,offenders:over,headerOverlap:overlap,targetsUnder24px:small,errors:errs};
    },[w,errs])); await p.close();
  }
  // Offline: block every non-file request, then exercise core flow
  { const ctx=await b.newContext({ offline:true }); const p=await ctx.newPage(); const net=[], errs=[];
    await ctx.route('**/*', r => { const u=r.request().url(); if(u.startsWith('file:')||u.startsWith('data:')||u.startsWith('blob:')) return r.continue(); net.push(u); return r.abort(); });
    p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
    await p.goto(FILE); await p.waitForTimeout(800);
    const ta = p.locator('textarea').first(); await ta.fill('Offline probe: summarise this note in three bullets.');
    await p.waitForTimeout(400);
    const compiled = await p.evaluate(()=>document.body.innerText.includes('Offline probe: summarise'));
    const bots = await p.$$eval('[role=radio], .bot-card, [data-bot]', els=>els.length);
    R.offline={blockedRequests:net, compiledContainsInput:compiled, botControls:bots, errors:errs};
    await ctx.close(); }
  // Static source: external references
  { const p=await b.newPage(); await p.goto(FILE);
    R.offline.externalLoads = await p.evaluate(()=>[...document.querySelectorAll('script[src],link[href],img[src],iframe[src]')].map(e=>e.src||e.href).filter(u=>!/^(file|data|blob):/.test(u)));
  // Accessibility basics
    R.a11y = await p.evaluate(()=>{
      const vis=e=>!!(e.offsetParent||e.getClientRects().length);
      const name=e=>(e.getAttribute('aria-label')||e.getAttribute('aria-labelledby')&&document.getElementById(e.getAttribute('aria-labelledby'))?.textContent||e.labels&&[...e.labels].map(l=>l.textContent).join(' ')||e.getAttribute('title')||e.getAttribute('placeholder')||e.textContent||'').trim();
      const ctrls=[...document.querySelectorAll('button,a[href],input:not([type=hidden]),select,textarea,[role=button],[role=tab],[role=radio],[role=switch]')].filter(vis);
      return { lang:document.documentElement.lang, title:document.title, controls:ctrls.length,
        unnamed: ctrls.filter(e=>!name(e)).map(e=>e.outerHTML.slice(0,120)),
        imgsNoAlt:[...document.images].filter(i=>!i.hasAttribute('alt')).length,
        tablists:document.querySelectorAll('[role=tablist]').length, radiogroups:document.querySelectorAll('[role=radiogroup]').length,
        ariaSelected:document.querySelectorAll('[aria-selected]').length, h1:document.querySelectorAll('h1').length,
        landmarks:['main','header','footer','nav'].map(t=>t+':'+document.querySelectorAll(t+',[role='+(t==='header'?'banner':t==='footer'?'contentinfo':t==='nav'?'navigation':'main')+']').length).join(' ') };
    });
    // Keyboard: Tab through first 40 stops, record focus visibility
    const stops=[]; await p.focus('body');
    for(let i=0;i<40;i++){ await p.keyboard.press('Tab'); stops.push(await p.evaluate(()=>{const e=document.activeElement; if(!e||e===document.body) return null; const cs=getComputedStyle(e); const vis=(cs.outlineStyle!=='none'&&parseFloat(cs.outlineWidth)>0)||cs.boxShadow!=='none'; return {t:e.tagName,txt:(e.getAttribute('aria-label')||e.textContent||e.placeholder||'').trim().slice(0,30),focusIndicator:vis};})); }
    R.a11y.tabStops=stops.filter(Boolean).length; R.a11y.tabStopsWithoutIndicator=stops.filter(s=>s&&!s.focusIndicator);
    await p.close(); }
  console.log(JSON.stringify(R,null,1)); await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
