const { chromium } = require('playwright'); const path=require('path');
(async()=>{ const b=await chromium.launch(); const F='file://'+path.resolve(process.argv[2]);
for (const w of [320,375,414,600,768,1024,1440]) { const p=await b.newPage({viewport:{width:w,height:900}}); await p.goto(F); await p.waitForTimeout(300);
 const o=await p.evaluate(()=>{ const hdr=document.querySelector('header'); const btns=[...hdr.querySelectorAll('button,select')].filter(x=>x.offsetParent);
  const tw=document.createTreeWalker(hdr,NodeFilter.SHOW_TEXT); const hits=new Set(); let n;
  while((n=tw.nextNode())){ if(!n.data.trim()||n.parentElement.closest('button,select')) continue; const rg=document.createRange(); rg.selectNodeContents(n);
   for(const c of rg.getClientRects()) for(const bt of btns){const a=bt.getBoundingClientRect(); if(a.left<c.right&&a.right>c.left&&a.top<c.bottom&&a.bottom>c.top) hits.add(n.data.trim().slice(0,22));}}
  return [...hits]; });
 console.log(w, JSON.stringify(o)); await p.close(); }
 await b.close(); })();
