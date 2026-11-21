const { chromium } = require('playwright'); const path=require('path');
(async()=>{ const b=await chromium.launch(); const out={};
for (const f of process.argv.slice(2)) { const p=await b.newPage({viewport:{width:1440,height:1000}});
 await p.goto('file://'+path.resolve(f)); await p.waitForTimeout(800);
 out[f]=await p.evaluate(()=>{ const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
  while((n=w.nextNode())) if(/Versatile all-rounder/.test(n.data)&&n.parentElement.tagName!=='SCRIPT'){ const e=n.parentElement; const host=e.closest('[id]');
   const cs=getComputedStyle(e); return {tag:e.tagName,cls:e.className,hostId:host&&host.id,hostCls:host&&host.className,font:cs.fontSize,hostFont:host&&getComputedStyle(host).fontSize}; } return null;});
 await p.close(); }
 console.log(JSON.stringify(out,null,1)); await b.close(); })();
