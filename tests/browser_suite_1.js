const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path'), os = require('os');
const ROOT = path.join(__dirname, '..');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'pb-suite1-'));
const FILE = 'file://' + path.resolve(process.argv[2] || path.join(ROOT, 'index.html'));
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('PASS ' + m); } else { fail++; console.log('FAIL ' + m); } };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ acceptDownloads: true, permissions: ['clipboard-read', 'clipboard-write'], viewport: { width: 1360, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED/.test(m.text())) errs.push('CONSOLE ' + m.text()); }); /* ERR_FAILED = the test's own simulated offline request */
  await p.addInitScript(() => { window.__opened = []; window.open = u => { window.__opened.push(u); return {}; }; window.confirm = () => true; });
  await p.goto(FILE); await p.waitForTimeout(400);

  // 1 basics
  const base = await p.evaluate(() => ({
    bots: CHATBOTS.length, tabs: document.querySelectorAll('[role=tab]').length, rev: CATALOG.rev, src: CATALOG_SRC,
    ver: (document.body.innerHTML.match(/currentVersion: "([^"]+)"/) || [])[1],
    cmds: Object.values(BOT_CMDS).flat().length, secs: document.querySelectorAll('main > section[data-sec]').length,
    status: document.getElementById('catStatus').textContent
  }));
  ok(base.bots === 9 && base.tabs === 2 && base.cmds === 81, 'baseline: 9 bots, 2 tabs, 81 commands ' + JSON.stringify([base.bots, base.tabs, base.cmds]));
  ok(base.rev === 1 && base.src === 'built-in', 'built-in catalog rev 1');
  ok(base.secs === 4, 'layout still has 4 sections');
  ok(/rev 1/.test(base.status), 'catalog status shown: ' + base.status);

  // 2 chips + all bots
  for (const name of ['ChatGPT', 'Gemini', 'Claude', 'Perplexity', 'Grok', 'Microsoft Copilot', 'DeepSeek', 'Meta AI', 'Mistral']) {
    await p.click('.botcard[data-bot="' + name + '"]');
    const r = await p.evaluate(() => ({ note: document.getElementById('botNote').textContent, chips: document.querySelectorAll('#botCmdPills .vchip').length, sug: document.querySelectorAll('#botCmdPills [data-sug]').length, items: document.querySelectorAll('#botCmdPills .cmditem').length }));
    ok(/Notes checked 2026-11-19/.test(r.note) && r.sug === r.items && r.items > 0, name + ': note date, ' + r.items + ' items, ' + r.chips + ' chips, suggest buttons match');
  }
  await p.click('.botcard[data-bot="ChatGPT"]');

  // 3 validation
  const v = await p.evaluate(() => {
    const clone = () => JSON.parse(JSON.stringify(BUILTIN_CATALOG));
    const t = {};
    t.valid = validateCatalog(clone()).length;
    let c = clone(); c.CHATBOTS[0].url = 'http://x.com'; t.http = validateCatalog(c).length;
    c = clone(); c.BOT_CMDS.ChatGPT[0].tier = 'gold'; t.tier = validateCatalog(c).length;
    c = clone(); delete c.BOT_NOTES.Grok; t.note = validateCatalog(c).length;
    c = clone(); c.rev = 'x'; t.rev = validateCatalog(c).length;
    c = clone(); c.BOT_CMDS.Claude[0].st = 'great'; t.st = validateCatalog(c).length;
    c = clone(); c.CHATBOTS[0].extra = 'zzz'; c.BOT_CMDS.ChatGPT[0].evil = '<img>'; const cc = cleanCatalog(c); t.extraDropped = !('extra' in cc.CHATBOTS[0]) && !('evil' in cc.BOT_CMDS.ChatGPT[0]);
    t.arr = validateCatalog([]).length; t.nul = validateCatalog(null).length;
    return t;
  });
  ok(v.valid === 0, 'built-in catalog validates');
  ok(v.http > 0 && v.tier > 0 && v.note > 0 && v.rev > 0 && v.st > 0 && v.arr > 0 && v.nul > 0, 'bad catalogs rejected ' + JSON.stringify(v));
  ok(v.extraDropped, 'cleanCatalog drops unknown fields');

  // 4 clean source
  await p.fill('#corePrompt', 'SECRET TYPED TEXT 12345');
  await p.fill('#presetName', 'Secret preset');
  await p.click('#presetSaveBtn');
  const cs = await p.evaluate(() => {
    const s = getCleanSource();
    const m = s.match(/<script type="application\/json" id="catalogData">([\s\S]*?)<\/script>/);
    let parsed = null; try { parsed = JSON.parse(m[1]); } catch (e) {}
    return { leakText: s.includes('SECRET TYPED TEXT'), leakPreset: s.includes('Secret preset'), hasBlock: !!m, parsedOk: !!parsed && parsed.rev === 1 && parsed.CHATBOTS.length === 9, doctype: s.startsWith('<!DOCTYPE html>'), end: s.trim().endsWith('</html>'), ver: (s.match(/currentVersion: "([^"]+)"/) || [])[1], details: /<details[^>]*id="startHere"[^>]*open/.test(s), len: s.length };
  });
  ok(!cs.leakText && !cs.leakPreset, 'clean source has no typed text or presets');
  ok(cs.hasBlock && cs.parsedOk, 'clean source embeds valid catalog JSON');
  ok(cs.doctype && cs.end && cs.ver === '5.5.0-test.3' && cs.details, 'clean source structure + version 5.5.0-test.3 + start panel open');

  // 5 import flow
  const mod = await p.evaluate(() => {
    const c = JSON.parse(JSON.stringify(BUILTIN_CATALOG)); c.rev = 2; c.updated = '2026-12-01';
    c.CHATBOTS[0].limit = 12345; c.CHATBOTS[0].v = '2026-12-01'; c.CHATBOTS[0].st = 'confirmed';
    c.BOT_CMDS.ChatGPT[0].d = 'Changed description for testing.'; c.BOT_CMDS.ChatGPT[0].v = '2026-12-01'; c.BOT_CMDS.ChatGPT[0].st = 'confirmed';
    c.BOT_CMDS.ChatGPT.push({ g: 'Type in the message box', k: 'type', tier: 'free', t: '/new ', l: '/new', w: 'Test', d: 'A new command.', v: '2026-12-01', st: 'confirmed' });
    return JSON.stringify(c);
  });
  await p.click('#catImportBtn');
  await p.fill('#catImportText', 'Here is your catalog:\n```json\n' + mod + '\n```\nSummary: changed things {ok}.');
  await p.click('#catImportGo');
  const diffTxt = await p.textContent('#catDiff');
  ok(/rev 2/.test(diffTxt) && /\/new/.test(diffTxt) && /limit 24000 -> 12345/.test(diffTxt) && /Install and reload/.test(diffTxt), 'import shows diff (fence + trailing words handled)');
  await p.fill('#catImportText', '{ not json');
  await p.click('#catImportGo');
  ok(/not valid JSON/.test(await p.textContent('#catDiff')), 'invalid JSON refused');
  await p.fill('#catImportText', mod.replace('"https://chatgpt.com"', '"http://chatgpt.com"'));
  await p.click('#catImportGo');
  ok(/problems/.test(await p.textContent('#catDiff')) && !(await p.$('#catInstallBtn')), 'invalid catalog (http url) refused, no install button');
  await p.fill('#catImportText', mod);
  await p.click('#catImportGo');
  await Promise.all([p.waitForEvent('load'), p.click('#catInstallBtn')]);
  await p.waitForTimeout(400);
  const after = await p.evaluate(() => ({ rev: CATALOG.rev, src: CATALOG_SRC, lim: CHATBOTS[0].limit, n: BOT_CMDS.ChatGPT.length, presets: readPresets().length, cs: (() => { const s = getCleanSource(); const m = s.match(/id="catalogData">([\s\S]*?)<\/script>/); return JSON.parse(m[1]).rev; })(), builtin: BUILTIN_CATALOG.rev }));
  ok(after.rev === 2 && after.src === 'saved' && after.lim === 12345 && after.n === 12, 'installed catalog active after reload ' + JSON.stringify(after));
  ok(after.presets === 1, 'presets survive catalog install');
  ok(after.cs === 2 && after.builtin === 1, 'clean source embeds the NEWEST (installed) catalog');
  // package + download
  await p.selectOption('#catEngine', 'Perplexity');
  await p.click('#catPackBtn');
  const pk = await p.evaluate(async () => ({ clip: await navigator.clipboard.readText(), opened: window.__opened, box: document.getElementById('catSplitBox').textContent, parts: document.querySelectorAll('#catSplitBox [data-cpart]').length }));
  ok(/CATALOG REFRESH REQUEST/.test(pk.clip) && pk.opened.length === 1 && /perplexity/.test(pk.opened[0]) && pk.parts > 1, 'package catalog only: copied, opened Perplexity, split into ' + pk.parts + ' parts');
  await p.click('#catSplitBox [data-cpart="1"]');
  const part2 = await p.evaluate(() => navigator.clipboard.readText());
  ok(part2 !== pk.clip && part2.length > 100, 'part 2 copy button works');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#catDlBtn')]);
  const dlp = await dl.path(); const dj = JSON.parse(fs.readFileSync(dlp, 'utf8'));
  ok(dl.suggestedFilename() === 'catalog.json' && dj.rev === 2, 'download catalog.json valid, rev 2');
  // reset to built-in
  await Promise.all([p.waitForEvent('load'), p.click('#catResetBtn')]);
  await p.waitForTimeout(300);
  ok(await p.evaluate(() => CATALOG.rev === 1 && CATALOG_SRC === 'built-in'), 'Use built-in catalog restores rev 1');
  // stale/older-than-builtin override ignored
  await p.evaluate(() => { const c = JSON.parse(JSON.stringify(BUILTIN_CATALOG)); c.rev = 0; localStorage.setItem('pb-catalog-v1', JSON.stringify(c)); });
  await p.reload(); await p.waitForTimeout(300);
  ok(await p.evaluate(() => CATALOG_SRC === 'built-in'), 'invalid/older saved catalog ignored at load');
  await p.evaluate(() => localStorage.setItem('pb-catalog-v1', '{broken'));
  await p.reload(); await p.waitForTimeout(300);
  ok(await p.evaluate(() => CATALOG_SRC === 'built-in'), 'corrupt saved catalog ignored at load');
  await p.evaluate(() => localStorage.removeItem('pb-catalog-v1'));

  // 6 check for newer (routes)
  await p.route('**/catalog.json', r => r.abort());
  await p.route('https://raw.githubusercontent.com/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: mod }));
  await p.click('#catCheckBtn'); await p.waitForTimeout(800);
  ok(/GitHub copy/.test(await p.textContent('#catDiff')) && !!(await p.$('#catInstallBtn')), 'check for newer: falls back to GitHub copy and shows diff');
  await p.click('#catCancelBtn');
  ok(await p.evaluate(() => document.getElementById('catDiff').hidden), 'cancel hides diff, nothing installed');
  await p.unroute('https://raw.githubusercontent.com/**');
  await p.route('https://raw.githubusercontent.com/**', r => r.abort());
  await p.click('#catCheckBtn'); await p.waitForTimeout(800);
  ok(/Could not reach/.test(await p.textContent('#toast')), 'offline check shows friendly message');
  await p.unroute('https://raw.githubusercontent.com/**');
  await p.route('https://raw.githubusercontent.com/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(JSON.parse(fs.readFileSync(path.join(ROOT, 'catalog.json'), 'utf8'))) }));
  await p.click('#catCheckBtn'); await p.waitForTimeout(800);
  ok(/up to date/.test(await p.textContent('#catDiff')), 'identical catalog reports up to date');

  // 7 suggest
  await p.click('#botCmdPills [data-sug="0"]');
  const sg = await p.evaluate(() => navigator.clipboard.readText());
  ok(/Suggested correction/.test(sg) && /Chatbot: ChatGPT/.test(sg) && /\/Deepresearch/.test(sg), 'command suggest note copied');
  await p.click('#botNote [data-sug="bot"]');
  ok(/ChatGPT card and free-plan notes/.test(await p.evaluate(() => navigator.clipboard.readText())), 'bot-level suggest note copied');

  // 8 presets export/import
  const [pd] = await Promise.all([p.waitForEvent('download'), p.click('#presetExportBtn')]);
  const pj = JSON.parse(fs.readFileSync(await pd.path(), 'utf8'));
  ok(pd.suggestedFilename() === 'pb-presets.json' && pj.presets.length >= 1 && pj.presets[0].name === 'Secret preset', 'export presets file');
  const many = []; for (let i = 0; i < 60; i++) many.push({ name: 'P' + i, bot: 'Grok', core: 'x'.repeat(5), evil: 'zz', mods: [{ k: 'a|b', f: ['q'], extra: 1 }], flags: { examine: false } });
  many.push({ name: '' }, 'junk', null);
  fs.writeFileSync(path.join(TMP, 'imp.json'), JSON.stringify({ presets: many }));
  await p.setInputFiles('#presetImportFile', path.join(TMP, 'imp.json')); await p.waitForTimeout(300);
  const pc = await p.evaluate(() => ({ n: readPresets().length, evil: JSON.stringify(readPresets()).includes('evil'), flag: readPresets().find(x => x.name === 'P1').flags.examine }));
  ok(pc.n === 50 && !pc.evil && pc.flag === false, 'import: capped at 50, junk skipped, unknown fields dropped ' + JSON.stringify(pc));
  fs.writeFileSync(path.join(TMP, 'imp2.json'), JSON.stringify([{ name: 'P1', core: 'replaced' }]));
  await p.setInputFiles('#presetImportFile', path.join(TMP, 'imp2.json')); await p.waitForTimeout(300);
  ok(await p.evaluate(() => readPresets().find(x => x.name === 'P1').core === 'replaced' && readPresets().length === 50), 'import merges by name (replace)');
  fs.writeFileSync(path.join(TMP, 'imp3.json'), 'not json');
  await p.setInputFiles('#presetImportFile', path.join(TMP, 'imp3.json')); await p.waitForTimeout(300);
  ok(/not valid JSON/.test(await p.textContent('#toast')), 'bad preset file refused');
  await p.evaluate(() => localStorage.removeItem('pb-presets-v1'));

  // 9 start panel
  await p.click('#startHere summary'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => localStorage.getItem('pb-start-closed') === '1' && !document.getElementById('startHere').open), 'start panel closes and remembers');
  await p.reload(); await p.waitForTimeout(300);
  ok(await p.evaluate(() => !document.getElementById('startHere').open), 'start panel stays closed after reload');
  await p.click('#startHere summary'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => document.getElementById('startHere').open && localStorage.getItem('pb-start-closed') === '0'), 'start panel reopens');

  // 10 dev bay package
  await p.evaluate(() => openModificationModal());
  await p.fill('#modalChange', 'Test change'); await p.fill('#modalWhy', 'Test reason');
  await p.evaluate(() => compileModificationPayload());
  const pre = await p.textContent('#modificationPreview');
  ok(/id="catalogData"/.test(pre) && /catalogData: CHATBOTS, TIERS/.test(pre) && /raise its rev by 1/.test(pre), 'Dev Bay package carries catalog block + new freshness wording');
  ok(await p.evaluate(() => document.querySelector('#modLaunchBtn').textContent.length > 0), 'Dev Bay buttons intact');

  // 11 prompt compile, split
  await p.click('.botcard[data-bot="Perplexity"]');
  await p.fill('#corePrompt', 'word '.repeat(3000));
  await p.waitForTimeout(200);
  await p.click('#launchBtn'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => !document.getElementById('splitBox').hidden), 'auto-split still works on Perplexity budget');

  // screenshots
  await p.click('.botcard[data-bot="ChatGPT"]');
  await p.fill('#corePrompt', '');
  await p.screenshot({ path: path.join(TMP, 'shot_top.png'), fullPage: false });
  await p.evaluate(() => document.getElementById('catBox').scrollIntoView());
  await p.screenshot({ path: path.join(TMP, 'shot_dev.png') });
  await p.evaluate(() => document.querySelector('#botCmdPills').scrollIntoView());
  await p.screenshot({ path: path.join(TMP, 'shot_cmds.png') });
  await p.emulateMedia({ colorScheme: 'dark' });
  await p.setViewportSize({ width: 390, height: 844 });
  await p.evaluate(() => { document.documentElement.setAttribute('data-theme', 'dark'); window.scrollTo(0, 0); });
  await p.screenshot({ path: path.join(TMP, 'shot_mobile.png') });
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  ok(!overflow, 'no horizontal overflow at 390px');

  console.log('\nconsole/page errors:', JSON.stringify(errs));
  ok(errs.length === 0, 'no console or page errors');
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  await b.close();
  process.exit(fail ? 1 : 0);
})();
