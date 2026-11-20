/* Regression tests for the v5.4.0 corrective pass:
   A) the catalog review diff covers every installable field (schema-driven, with a canary)
   B) the catalog status / chip wording is accurate (fresh and stale)
   C) one multi-part transfer protocol everywhere
   Run:  node tests/browser_corrective.js [path/to/index.html]     (needs Playwright; the app itself needs nothing) */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HTML_PATH = path.resolve(process.argv[2] || path.join(ROOT, 'index.html'));
const FILE = 'file://' + HTML_PATH;
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('PASS ' + m); } else { fail++; console.log('FAIL ' + m); } };

(async () => {
  const b = await chromium.launch();
  const errs = [], reqs = [];
  async function open(opts) {
    const ctx = await b.newContext({ permissions: ['clipboard-read', 'clipboard-write'], viewport: { width: 1360, height: 900 } });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
    p.on('console', m => { if (m.type() === 'error' && !/ERR_|Failed to load resource/.test(m.text())) errs.push('CONSOLE ' + m.text()); });
    p.on('request', r => { if (!/^(file|blob|data):/.test(r.url())) reqs.push(r.url()); });
    await p.addInitScript(() => { window.__opened = []; window.open = u => { window.__opened.push(u); return {}; }; window.confirm = () => true; });
    if (opts && opts.plusDays) await p.addInitScript(d => { const real = Date.now.bind(Date); Date.now = () => real() + d * 864e5; }, opts.plusDays);
    await p.goto(FILE); await p.waitForTimeout(400);
    return p;
  }

  /* =============================== A: diff completeness =============================== */
  let p = await open();
  const A = await p.evaluate(() => {
    const B = () => JSON.parse(JSON.stringify(cleanCatalog(BUILTIN_CATALOG)));
    const diff = fn => { const a = B(), c = B(); fn(c); const d = diffCatalogs(a, cleanCatalog(c)); return { n: d.lines.length, content: d.content, meta: d.meta, text: d.lines.join(' | ') }; };
    const r = {};
    r.identical = diffCatalogs(B(), B()).lines.length;
    r.maker = diff(c => { c.CHATBOTS[0].maker = 'Other Corp'; });
    r.color = diff(c => { c.CHATBOTS[0].color = '#000000'; });
    const fi = BUILTIN_CATALOG.BOT_CMDS.ChatGPT.findIndex(x => x.f);
    r.fHas = fi >= 0;
    r.fChange = diff(c => { c.BOT_CMDS.ChatGPT[fi].f = ['A different placeholder']; });
    r.fAdd = diff(c => { c.BOT_CMDS.ChatGPT[0].f = ['New box']; });
    r.fRemove = diff(c => { delete c.BOT_CMDS.ChatGPT[fi].f; });
    r.tierLabel = diff(c => { c.TIERS.free[0] = 'Gratis'; });
    r.tierHelp = diff(c => { c.TIERS.paid[1] = 'Costs money, skip it.'; });
    r.url = diff(c => { c.CHATBOTS[1].url = 'https://example.com'; });
    r.limit = diff(c => { c.CHATBOTS[1].limit = 31000; });
    r.notes = diff(c => { c.BOT_NOTES.Grok += ' More.'; });
    r.cmdText = diff(c => { c.BOT_CMDS.Claude[0].t = 'changed '; });
    r.cmdKind = diff(c => { c.BOT_CMDS.Claude[0].k = c.BOT_CMDS.Claude[0].k === 'ui' ? 'ask' : 'ui'; });
    r.cmdTier = diff(c => { c.BOT_CMDS.Claude[0].tier = c.BOT_CMDS.Claude[0].tier === 'paid' ? 'free' : 'paid'; });
    r.cmdWhere = diff(c => { c.BOT_CMDS.Claude[0].w += ' x'; });
    r.cmdDesc = diff(c => { c.BOT_CMDS.Claude[0].d += ' x'; });
    r.cmdAdd = diff(c => { c.BOT_CMDS.Claude.push({ g: 'New group', k: 'ask', tier: 'free', t: 'x', l: 'brand new', w: 'w', d: 'd' }); });
    r.cmdRemove = diff(c => { c.BOT_CMDS.Claude.pop(); });
    r.cmdGroup = diff(c => { c.BOT_CMDS.Claude[0].g += ' moved'; });
    r.cmdOrder = diff(c => { c.BOT_CMDS.Claude.reverse(); });
    r.botOrder = diff(c => { c.CHATBOTS.reverse(); });
    r.botAdd = diff(c => { c.CHATBOTS.push(Object.assign({}, c.CHATBOTS[0], { name: 'Newbot' })); c.BOT_NOTES.Newbot = 'n'; c.BOT_CMDS.Newbot = []; });
    r.botRemove = diff(c => { const n = c.CHATBOTS.pop().name; delete c.BOT_NOTES[n]; delete c.BOT_CMDS[n]; });
    r.rev = diff(c => { c.rev += 1; });
    r.updated = diff(c => { c.updated = '2030-01-01'; });
    r.metaV = diff(c => { c.BOT_CMDS.Claude[0].v = '2030-01-01'; });
    r.metaSt = diff(c => { c.CHATBOTS[0].st = 'unverified'; });
    // duplicate label + group inside one bot must not be mismatched
    r.dup = diff(c => { const x = Object.assign({}, c.BOT_CMDS.Claude[0]); c.BOT_CMDS.Claude.push(x, Object.assign({}, x, { d: 'second copy differs' })); });
    return r;
  });
  ok(A.identical === 0, 'A: identical catalogs produce no diff lines');
  ok(A.maker.content === 1 && /maker/.test(A.maker.text), 'A: chatbot maker change detected -> ' + A.maker.text);
  ok(A.color.content === 1 && /colour/.test(A.color.text), 'A: chatbot colour change detected -> ' + A.color.text);
  ok(A.fHas && A.fChange.content === 1 && /fill-in boxes/.test(A.fChange.text), 'A: command placeholder (f) change detected -> ' + A.fChange.text);
  ok(A.fAdd.content === 1 && /fill-in boxes/.test(A.fAdd.text), 'A: placeholder added detected');
  ok(A.fRemove.content === 1 && /fill-in boxes/.test(A.fRemove.text), 'A: placeholder removed detected');
  ok(A.tierLabel.content === 1 && /Free-tier badge "free": label/.test(A.tierLabel.text), 'A: TIERS label change detected -> ' + A.tierLabel.text);
  ok(A.tierHelp.content === 1 && /Free-tier badge "paid": help/.test(A.tierHelp.text), 'A: TIERS description change detected -> ' + A.tierHelp.text);
  for (const k of ['url', 'limit', 'notes', 'cmdText', 'cmdKind', 'cmdTier', 'cmdWhere', 'cmdDesc', 'cmdAdd', 'cmdRemove', 'cmdGroup', 'cmdOrder', 'botOrder', 'botAdd', 'botRemove'])
    ok(A[k].content >= 1, 'A: ' + k + ' change detected as a content change -> ' + A[k].text.slice(0, 90));
  ok(A.cmdOrder.content === 1 && /command order changed/.test(A.cmdOrder.text), 'A: command order change reported');
  ok(/Default \(first\) chatbot/.test(A.botOrder.text), 'A: default chatbot change reported when order changes');
  ok(A.rev.meta === 1 && A.rev.content === 0 && /Catalog revision/.test(A.rev.text), 'A: revision-only change is reported (not "up to date")');
  ok(A.updated.meta === 1 && /Catalog revision/.test(A.updated.text), 'A: updated-date-only change reported');
  ok(A.metaV.meta === 1 && A.metaV.content === 0 && A.metaSt.meta === 1, 'A: check date / status changes reported as meta updates');
  ok(A.dup.content >= 1, 'A: duplicate label+group entries handled (' + A.dup.content + ' lines)');

  // Schema-driven coverage: every accepted field, mutated generically, must show up in the diff
  const S = await p.evaluate(() => {
    const B = () => JSON.parse(JSON.stringify(cleanCatalog(BUILTIN_CATALOG)));
    const mut = (o, k) => { const v = o[k]; o[k] = typeof v === 'string' ? v + '~' : typeof v === 'number' ? v + 1 : Array.isArray(v) ? v.concat(['extra~']) : 'new~'; };
    const missed = [], tried = [];
    const check = (label, fn) => { const c = B(); fn(c); tried.push(label); const d = diffCatalogs(B(), cleanCatalog(c)); if (!d.lines.length) missed.push(label); };
    CATALOG_FIELDS.bot.forEach(k => check('bot.' + k, c => {
      if (k === 'name') { const old = c.CHATBOTS[0].name; c.CHATBOTS[0].name = old + '2'; c.BOT_NOTES[old + '2'] = c.BOT_NOTES[old]; delete c.BOT_NOTES[old]; c.BOT_CMDS[old + '2'] = c.BOT_CMDS[old]; delete c.BOT_CMDS[old]; }
      else mut(c.CHATBOTS[0], k);
    }));
    CATALOG_FIELDS.cmd.forEach(k => check('cmd.' + k, c => { const e = c.BOT_CMDS.ChatGPT.find(x => x[k] !== undefined) || c.BOT_CMDS.ChatGPT[0]; mut(e, k); }));
    TIER_KEYS.forEach(tk => CATALOG_FIELDS.tierParts.forEach((part, i) => check('tier.' + tk + '.' + part, c => { c.TIERS[tk][i] += '~'; })));
    // every accepted field must also be validated (garbage value rejected)
    const unvalidated = () => {
      const bad = [], inv = {};
      CATALOG_FIELDS.bot.forEach(k => { const c = B(); c.CHATBOTS[0][k] = inv; if (!validateCatalog(c).length) bad.push('bot.' + k); });
      CATALOG_FIELDS.cmd.forEach(k => { const c = B(); c.BOT_CMDS.ChatGPT[0][k] = inv; if (!validateCatalog(c).length) bad.push('cmd.' + k); });
      CATALOG_FIELDS.tierParts.forEach((_, i) => { const c = B(); c.TIERS.free[i] = inv; if (!validateCatalog(c).length) bad.push('tier.' + i); });
      return bad;
    };
    const unvalidatedNow = unvalidated();
    // CANARY: a brand-new installable field must be diffed automatically, and the coverage test must flag it if it is unvalidated
    CATALOG_FIELDS.cmd.push('zzzNew');
    const a = B(), c = B(); c.BOT_CMDS.ChatGPT[0].zzzNew = 'hello';
    const kept = cleanCatalog(c).BOT_CMDS.ChatGPT[0].zzzNew === 'hello';
    const dc = diffCatalogs(cleanCatalog(a), cleanCatalog(c));
    const canaryUnvalidated = unvalidated();
    CATALOG_FIELDS.cmd.pop();
    const dropped = cleanCatalog(c).BOT_CMDS.ChatGPT[0].zzzNew === undefined;
    return { tried: tried.length, missed, unvalidatedNow, kept, canaryDiff: dc.lines.join(' | '), canaryUnvalidated, dropped };
  });
  ok(S.tried >= 24 && S.missed.length === 0, 'A: schema-driven: all ' + S.tried + ' accepted fields are covered by the diff (missed: ' + JSON.stringify(S.missed) + ')');
  ok(S.unvalidatedNow.length === 0, 'A: every accepted field is also validated (unvalidated: ' + JSON.stringify(S.unvalidatedNow) + ')');
  ok(S.kept && /zzzNew/.test(S.canaryDiff), 'A: canary: a new installable field is installed AND automatically appears in the diff -> ' + S.canaryDiff);
  ok(S.canaryUnvalidated.join() === 'cmd.zzzNew', 'A: canary: the coverage test would flag a new field that is not validated');
  ok(S.dropped, 'A: fields outside CATALOG_FIELDS are dropped by cleanCatalog (not installable)');

  // UI-level: each omitted field shows in the on-page review and is never reported as "no changes"
  const base = await p.evaluate(() => JSON.parse(JSON.stringify(cleanCatalog(BUILTIN_CATALOG))));
  const fi2 = base.BOT_CMDS.ChatGPT.findIndex(x => x.f);
  const cases = {
    maker: c => { c.CHATBOTS[0].maker = 'Other Corp'; }, color: c => { c.CHATBOTS[0].color = '#112233'; },
    f: c => { c.BOT_CMDS.ChatGPT[fi2].f = ['Changed placeholder']; }, tierLabel: c => { c.TIERS.limited[0] = 'Small quota'; },
    tierHelp: c => { c.TIERS.limited[1] = 'A different help sentence.'; }, revOnly: c => { c.rev = 7; }
  };
  const needs = { maker: /maker Meta|maker OpenAI/, color: /colour #10a37f -> #112233/, f: /fill-in boxes/, tierLabel: /Free-tier badge "limited": label/, tierHelp: /Free-tier badge "limited": help/, revOnly: /Catalog revision: rev 1 -> 7/ };
  for (const [name, fn] of Object.entries(cases)) {
    const c = JSON.parse(JSON.stringify(base)); fn(c);
    await p.evaluate(() => { document.getElementById('catImportBox').hidden = false; });
    await p.fill('#catImportText', JSON.stringify(c)); await p.click('#catImportGo');
    const t = await p.textContent('#catDiff'), hasInstall = !!(await p.$('#catInstallBtn'));
    ok(needs[name].test(t) && hasInstall && !/No changes|up to date/.test(t) && /Installing would apply/.test(t), 'A (UI): ' + name + ' change is shown in the review with an Install button');
  }
  await p.evaluate(() => { document.getElementById('catImportBox').hidden = false; });
  await p.fill('#catImportText', JSON.stringify(base)); await p.click('#catImportGo');
  ok(/up to date/.test(await p.textContent('#catDiff')) && !(await p.$('#catInstallBtn')), 'A (UI): an identical catalog says up to date and offers no install');

  // The diff compares exactly what gets installed: unknown fields are dropped, and diff(clean(import), installed) is empty
  const inst = JSON.parse(JSON.stringify(base)); inst.rev = 2; inst.CHATBOTS[0].maker = 'Installed Co'; inst.CHATBOTS[0].evilField = 'nope'; inst.BOT_CMDS.ChatGPT[0].evil2 = 'nope'; inst.TIERS.free[1] = 'Installed help text.';
  await p.evaluate(() => { document.getElementById('catImportBox').hidden = false; });
  await p.fill('#catImportText', JSON.stringify(inst)); await p.click('#catImportGo');
  ok(!/evilField|evil2/.test(await p.textContent('#catDiff')), 'A (UI): unknown fields are not shown (they are not installable)');
  await Promise.all([p.waitForEvent('load'), p.click('#catInstallBtn')]); await p.waitForTimeout(400);
  const eq = await p.evaluate(inst => {
    const stored = localStorage.getItem('pb-catalog-v1'), want = cleanCatalog(inst);
    return { sameAsReviewed: JSON.stringify(JSON.parse(stored)) === JSON.stringify(want), diffEmpty: diffCatalogs(want, JSON.parse(stored)).lines.length, noEvil: !/evil/.test(stored), maker: CHATBOTS[0].maker, tier: TIERS.free[1], active: CATALOG_SRC };
  }, inst);
  ok(eq.sameAsReviewed && eq.diffEmpty === 0 && eq.noEvil && eq.maker === 'Installed Co' && eq.tier === 'Installed help text.' && eq.active === 'saved', 'A: installed data is exactly the normalized data that was reviewed ' + JSON.stringify(eq));
  await p.evaluate(() => localStorage.removeItem('pb-catalog-v1'));
  await p.context().close();

  /* ============ A2: every changed value is inspectable; long lists cannot be installed unseen ============ */
  {
    const q = await open();
    // (1) schema-driven: EVERY field in CATALOG_FIELDS shows its old and new text, never just "changed"
    const R = await q.evaluate(() => {
      const base = cleanCatalog(BUILTIN_CATALOG), out = { missing: [], vague: [], tried: 0 };
      const val = (k, tag) => k === 'f' ? ['f-' + tag] : k === 'limit' ? (tag === 'OLD' ? 11111 : 22222) : tag + '-' + k;
      for (const [scope, keys] of [['bot', CATALOG_FIELDS.bot], ['cmd', CATALOG_FIELDS.cmd]]) {
        keys.filter(k => k !== 'name' && k !== 'g' && k !== 'l').forEach(k => {
          const a = JSON.parse(JSON.stringify(base)), b = JSON.parse(JSON.stringify(base));
          if (scope === 'bot') { a.CHATBOTS[0][k] = val(k, 'OLD'); b.CHATBOTS[0][k] = val(k, 'NEW'); }
          else { const n = a.CHATBOTS[0].name; a.BOT_CMDS[n][0][k] = val(k, 'OLD'); b.BOT_CMDS[n][0][k] = val(k, 'NEW'); }
          const d = diffCatalogs(a, b); out.tried++;
          const s = k === 'f' ? 'f-OLD' : String(val(k, 'OLD')), t = k === 'f' ? 'f-NEW' : String(val(k, 'NEW'));
          const line = d.lines.find(l => l.indexOf(s) >= 0 && l.indexOf(t) >= 0);
          if (!line) out.missing.push(scope + '.' + k);
          if (d.lines.some(l => / changed$/.test(l))) out.vague.push(scope + '.' + k);
        });
      }
      const a = JSON.parse(JSON.stringify(base)), b = JSON.parse(JSON.stringify(base)), n = a.CHATBOTS[0].name;
      a.BOT_NOTES[n] = 'OLD-NOTE'; b.BOT_NOTES[n] = 'NEW-NOTE';
      const dn = diffCatalogs(a, b).lines.join('|');
      out.notes = /OLD-NOTE/.test(dn) && /NEW-NOTE/.test(dn);
      return out;
    });
    ok(R.tried >= 12 && R.missing.length === 0 && R.vague.length === 0 && R.notes, 'A2: all ' + R.tried + ' bot/command fields and the chatbot notes show before -> after text (missing: ' + R.missing.join(',') + '; vague: ' + R.vague.join(',') + ')');

    // (2) long values: truncated preview + full before/after on demand; markup in values stays inert text
    const evil = '<img src=x onerror="window.__pwn=1">';
    const base = await q.evaluate(() => JSON.parse(JSON.stringify(cleanCatalog(BUILTIN_CATALOG))));
    const c = JSON.parse(JSON.stringify(base)); const oldD = base.BOT_CMDS.ChatGPT[0].d;
    c.rev = 2; const longNew = evil + ' ' + 'LONGTEXT '.repeat(80) + 'THE-END-MARKER';
    c.BOT_CMDS.ChatGPT[0].d = longNew;
    const openDiff = async cat => { await q.evaluate(() => { document.getElementById('catImportBox').hidden = false; }); await q.fill('#catImportText', JSON.stringify(cat)); await q.click('#catImportGo'); };
    await openDiff(c);
    const row = q.locator('#catDiff li details').first();
    const summary = await row.locator('summary').textContent();
    ok(/description /.test(summary) && summary.length < 260 && !/THE-END-MARKER/.test(summary) && /\.\.\./.test(summary), 'A2: a long changed value shows a short before -> after preview (' + summary.length + ' chars)');
    await row.locator('summary').click();
    const fullTxt = await row.textContent();
    ok(fullTxt.indexOf('THE-END-MARKER') >= 0 && fullTxt.indexOf(oldD) >= 0 && /Before \(full\)/.test(fullTxt) && /After \(full\)/.test(fullTxt), 'A2: opening the line shows the complete old and new values');
    ok((await q.$$('#catDiff img')).length === 0 && (await q.evaluate(() => window.__pwn)) === undefined && fullTxt.indexOf(evil) >= 0, 'A2: markup inside catalog values is shown as text and never runs');
    ok(/Showing all \d+ changes/.test(await q.textContent('#catShownCount')) && !(await q.locator('#catInstallBtn').isDisabled()), 'A2: a short list states it shows all changes and Install is available');

    // (3) cap: >500 changes -> total vs shown stated, Install disabled until every change is displayed
    const big = JSON.parse(JSON.stringify(base)); big.rev = 3;
    for (const n of Object.keys(big.BOT_CMDS)) for (let i = 0; i < 70; i++) big.BOT_CMDS[n].push(Object.assign({}, big.BOT_CMDS[n][0], { l: 'Bulk item ' + i, t: 'bulk ' + i })); /* per-chatbot limit is 200 commands */
    const wantTotal = await q.evaluate(c2 => diffCatalogs(cleanCatalog(CATALOG), cleanCatalog(c2)).lines.length, big);
    await openDiff(big);
    const head = await q.textContent('#catDiff');
    ok(wantTotal > 500 && (await q.$$('#catDiffList > li')).length === 500 && new RegExp('Showing 500 of ' + wantTotal + ' changes').test(head) && !/Every difference is listed/.test(head), 'A2: over the cap it says "Showing 500 of ' + wantTotal + '" and never claims all are listed');
    ok(new RegExp('\\(' + wantTotal + ' in total\\)').test(head), 'A2: the aggregate count covers the whole diff (' + wantTotal + '), not only the visible part');
    ok(await q.locator('#catInstallBtn').isDisabled(), 'A2: Install is disabled while changes are hidden');
    await q.evaluate(() => installCatalog());
    ok(await q.evaluate(() => localStorage.getItem('pb-catalog-v1') === null), 'A2: installCatalog() refuses to store anything while the review is incomplete');
    await q.click('#catShowAllBtn');
    ok((await q.$$('#catDiffList > li')).length === wantTotal && !(await q.locator('#catInstallBtn').isDisabled()) && (await q.$('#catShowAllBtn')) === null && new RegExp('Showing all ' + wantTotal + ' of ' + wantTotal).test(await q.textContent('#catShownCount')), 'A2: "Show all" displays every one of the ' + wantTotal + ' changes and then enables Install');
    await q.click('#catCancelBtn');
    await openDiff(big);
    ok(await q.locator('#catInstallBtn').isDisabled(), 'A2: after Cancel and re-import the gate is closed again');
    await q.context().close();
  }

  /* ============ A3: added/removed commands and chatbots show their complete records ============ */
  {
    const q = await open();
    const base = await q.evaluate(() => JSON.parse(JSON.stringify(cleanCatalog(BUILTIN_CATALOG))));
    const clone = o => JSON.parse(JSON.stringify(o));
    const openDiff = async cat => { await q.evaluate(() => { document.getElementById('catImportBox').hidden = false; }); await q.fill('#catImportText', JSON.stringify(cat)); await q.click('#catImportGo'); };
    /* content items only: the catalog-revision line is a separate, counted metadata change */
    const liTexts = async () => (await q.$$eval('#catDiffList > li', els => els.map(e => e.textContent))).filter(t => !/Catalog revision:/.test(t));
    const HOSTILE = '<img src=x onerror="window.__pwn3=1"><script>window.__pwn3=2</script>';
    const cmd = (l, extra) => Object.assign({ g: 'Zed Group', k: 'type', tier: 'limited', t: 'DISTINCT-PROMPT-TEXT', l: l, w: 'DISTINCT-WHERE', d: 'DISTINCT-DESCRIPTION', f: ['DISTINCT-FIELD-A', 'DISTINCT-FIELD-B'], v: '2026-11-01', st: 'confirmed' }, extra || {});
    const noExec = async () => (await q.$$('#catDiff img')).length === 0 && (await q.evaluate(() => window.__pwn3)) === undefined;

    // (1) added command: every installable value is in the review
    let c = clone(base); c.rev = 2; c.BOT_CMDS.ChatGPT.push(cmd('Brand New Cmd'));
    await openDiff(c);
    let items = await liTexts(), hit = items.find(t => /\+ ChatGPT: Brand New Cmd \(Zed Group\)/.test(t)) || '';
    ok(items.length === 1 && ['DISTINCT-PROMPT-TEXT', 'limited', 'DISTINCT-DESCRIPTION', 'DISTINCT-WHERE', 'DISTINCT-FIELD-A', 'DISTINCT-FIELD-B', '2026-11-01', 'confirmed', 'Zed Group', 'Brand New Cmd'].every(v => hit.indexOf(v) >= 0), 'A3: an added command shows prompt text, tier, fill-in boxes, location, description, check date and status');

    // (2) removed command: its previous record is inspectable
    const gone = base.BOT_CMDS.ChatGPT[2]; c = clone(base); c.rev = 2; c.BOT_CMDS.ChatGPT.splice(2, 1);
    await openDiff(c); items = await liTexts(); hit = items.find(t => t.indexOf('- ChatGPT: ' + gone.l) === 0) || '';
    ok(items.length === 1 && hit.indexOf(gone.t) >= 0 && hit.indexOf(gone.d) >= 0 && hit.indexOf(gone.w) >= 0 && hit.indexOf(gone.tier) >= 0 && hit.indexOf(gone.g) >= 0, 'A3: a removed command shows its complete previous values (' + gone.l + ')');

    // (3) added chatbot with notes and several commands
    const nb = clone(base.CHATBOTS[1]); nb.name = 'Zork AI'; nb.maker = 'Zork Labs'; nb.url = 'https://zork.example/'; nb.blurb = 'ZORK-BLURB'; nb.brief = 'ZORK-BRIEF'; nb.best = 'ZORK-BEST'; nb.free = 'ZORK-FREE-NOTE'; nb.limit = 33333;
    c = clone(base); c.rev = 2; c.CHATBOTS.push(nb); c.BOT_NOTES['Zork AI'] = 'ZORK-NOTES-TEXT'; c.BOT_CMDS['Zork AI'] = [cmd('Zork One'), cmd('Zork Two', { t: 'SECOND-PROMPT', tier: 'paid' }), cmd('Zork Three', { d: 'THIRD-DESC' })];
    ok((await q.evaluate(c2 => validateCatalog(c2).length, c)) === 0, 'A3: (setup) the test chatbot catalog is valid');
    await openDiff(c); items = await liTexts();
    const card = items.find(t => /\+ New chatbot: Zork AI \(3 commands/.test(t)) || '';
    ok(items.length === 4 && ['Zork Labs', 'https://zork.example/', 'ZORK-BLURB', 'ZORK-BRIEF', 'ZORK-BEST', 'ZORK-FREE-NOTE', '33333', 'ZORK-NOTES-TEXT'].every(v => card.indexOf(v) >= 0), 'A3: a new chatbot shows its card fields and notes (' + items.length + ' reviewable items = card + 3 commands)');
    ok(['Zork One', 'Zork Two', 'Zork Three'].every(n => items.some(t => t.indexOf('+ Zork AI: ' + n) === 0 && t.indexOf('DISTINCT-PROMPT-TEXT') + t.indexOf('SECOND-PROMPT') > -2)) && items.find(t => /Zork Two/.test(t)).indexOf('SECOND-PROMPT') >= 0 && items.find(t => /Zork Two/.test(t)).indexOf('paid') >= 0 && items.find(t => /Zork Three/.test(t)).indexOf('THIRD-DESC') >= 0, 'A3: every command of a new chatbot is listed with its own values');
    ok(new RegExp('\\(5 in total\\)').test(await q.textContent('#catDiff')) && (await q.$$('#catDiffList > li')).length === 5, 'A3: the aggregate count equals the listed items (4 content + 1 revision line), with nothing counted twice');

    // (4) removed chatbot: card, notes and commands inspectable
    const last = base.CHATBOTS[base.CHATBOTS.length - 1], lname = last.name, lcmds = base.BOT_CMDS[lname];
    c = clone(base); c.rev = 2; c.CHATBOTS.pop(); delete c.BOT_NOTES[lname]; delete c.BOT_CMDS[lname];
    await openDiff(c); items = await liTexts();
    const rc = items.find(t => t.indexOf('- Removed chatbot: ' + lname) === 0) || '';
    ok(items.length === 1 + lcmds.length && rc.indexOf(last.maker) >= 0 && rc.indexOf(last.url) >= 0 && rc.indexOf(last.blurb) >= 0 && rc.indexOf(base.BOT_NOTES[lname]) >= 0 && lcmds.every(p => items.some(t => t.indexOf('- ' + lname + ': ' + p.l) === 0 && t.indexOf(p.t) >= 0 && t.indexOf(p.d) >= 0)), 'A3: a removed chatbot shows its card, notes and all ' + lcmds.length + ' commands with their values');

    // (5) hostile markup in ADDED content and in REMOVED content stays inert text
    c = clone(base); c.rev = 2; c.BOT_CMDS.ChatGPT.push(cmd('Hostile Add', { d: HOSTILE, t: HOSTILE })); c.CHATBOTS.push(Object.assign(clone(nb), { name: 'Evil AI', blurb: HOSTILE })); c.BOT_NOTES['Evil AI'] = HOSTILE; c.BOT_CMDS['Evil AI'] = [cmd('Evil Cmd', { d: HOSTILE })];
    await openDiff(c); items = await liTexts();
    ok(items.some(t => t.indexOf(HOSTILE) >= 0) && await noExec(), 'A3: markup in added commands, chatbot cards and notes is shown as text and never runs');
    const hostileCat = clone(base); hostileCat.rev = 2; hostileCat.BOT_CMDS.ChatGPT.push(cmd('Hostile Old', { d: HOSTILE, t: HOSTILE }));
    await q.evaluate(h => localStorage.setItem('pb-catalog-v1', JSON.stringify(h)), hostileCat);
    await q.reload(); await q.waitForTimeout(400);
    c = clone(base); c.rev = 3; await openDiff(c); items = await liTexts();
    ok(items.length === 1 && items[0].indexOf('- ChatGPT: Hostile Old') === 0 && items[0].indexOf(HOSTILE) >= 0 && await noExec(), 'A3: markup in REMOVED content is shown as text and never runs');

    // (6) large removals and large additions still hit the 500-item gate
    const bigCat = clone(base); bigCat.rev = 5;
    for (const n of Object.keys(bigCat.BOT_CMDS)) for (let i = 0; i < 70; i++) bigCat.BOT_CMDS[n].push(cmd('Bulk ' + i, { t: 'bulk ' + i }));
    await q.evaluate(h => localStorage.setItem('pb-catalog-v1', JSON.stringify(h)), bigCat);
    await q.reload(); await q.waitForTimeout(400);
    c = clone(base); c.rev = 6; await openDiff(c);
    let total = (await q.textContent('#catDiff')).match(/\((\d+) in total\)/);
    ok(total && +total[1] > 500 && /Showing 500 of \d+ changes/.test(await q.textContent('#catShownCount')) && await q.locator('#catInstallBtn').isDisabled() && (await q.$$('#catDiffList > li')).length === 500, 'A3: a large REMOVAL (' + (total && total[1]) + ' changes) shows 500 and keeps Install disabled');
    await q.click('#catShowAllBtn');
    ok((await q.$$('#catDiffList > li')).length === +total[1] && !(await q.locator('#catInstallBtn').isDisabled()), 'A3: after "Show all", every removed record is listed and Install is enabled');
    await q.evaluate(() => localStorage.removeItem('pb-catalog-v1')); await q.reload(); await q.waitForTimeout(400);
    c = clone(base); c.rev = 2;
    for (let k = 0; k < 3; k++) { const x = Object.assign(clone(nb), { name: 'Bulk AI ' + k }); c.CHATBOTS.push(x); c.BOT_NOTES[x.name] = 'notes ' + k; c.BOT_CMDS[x.name] = Array.from({ length: 190 }, (_, i) => cmd('Item ' + i, { t: 'p' + i })); }
    ok((await q.evaluate(c2 => validateCatalog(c2).length, c)) === 0, 'A3: (setup) the large new-chatbot catalog is valid');
    await openDiff(c); total = (await q.textContent('#catDiff')).match(/\((\d+) in total\)/);
    ok(total && +total[1] === 3 * 191 + 1 && /Showing 500 of 574 changes/.test(await q.textContent('#catShownCount')) && await q.locator('#catInstallBtn').isDisabled(), 'A3: large ADDITION of 3 chatbots counts every card and command (573, plus the revision line = 574) and keeps Install disabled until shown');
    await q.context().close();
  }

  /* ============ A4: the expandable records really work as a user sees them (click/keyboard, visible only when opened) ============ */
  {
    const q = await open();
    const base = await q.evaluate(() => JSON.parse(JSON.stringify(cleanCatalog(BUILTIN_CATALOG))));
    const clone = o => JSON.parse(JSON.stringify(o));
    const openDiff = async cat => { await q.evaluate(() => { document.getElementById('catImportBox').hidden = false; }); await q.fill('#catImportText', JSON.stringify(cat)); await q.click('#catImportGo'); };
    const rowFor = prefix => q.locator('#catDiffList > li').filter({ has: q.locator('summary', { hasText: prefix }) }).first();
    /* closed -> every value hidden; click the summary -> details.open and every value visible */
    const expands = async (prefix, vals, viaKeyboard) => {
      const li = rowFor(prefix), det = li.locator('details'), sum = li.locator('summary');
      if (await li.count() === 0) return 'no row for ' + prefix;
      const pre = v => li.locator('details pre').filter({ hasText: v }).first();
      const closedBefore = !(await det.evaluate(d => d.open));
      let hiddenBefore = true; for (const v of vals) if (await pre(v).isVisible()) hiddenBefore = false;
      if (viaKeyboard) { await sum.focus(); await q.keyboard.press('Enter'); } else await sum.click();
      const openAfter = await det.evaluate(d => d.open);
      const missing = []; for (const v of vals) if (!(await pre(v).isVisible())) missing.push(v);
      return closedBefore && hiddenBefore && openAfter && missing.length === 0 ? true : 'closedBefore=' + closedBefore + ' hiddenBefore=' + hiddenBefore + ' openAfter=' + openAfter + ' notVisible=' + missing.join('|');
    };
    const HOSTILE = '<img src=x onerror="window.__pwn4=1">';
    const cmd = (l, extra) => Object.assign({ g: 'Zed Group', k: 'type', tier: 'limited', t: 'UI-PROMPT-' + l, l: l, w: 'UI-WHERE-' + l, d: 'UI-DESC-' + l, f: ['UI-FIELD-' + l], v: '2026-11-01', st: 'confirmed' }, extra || {});

    // added command (mouse)
    let c = clone(base); c.rev = 2; c.BOT_CMDS.ChatGPT.push(cmd('AddedCmd'));
    await openDiff(c);
    ok(await expands('+ ChatGPT: AddedCmd', ['UI-PROMPT-AddedCmd', 'limited', 'UI-DESC-AddedCmd', 'UI-WHERE-AddedCmd', 'UI-FIELD-AddedCmd', '2026-11-01', 'confirmed', 'Zed Group', 'type']) === true, 'A4: added command - the row has a details/summary; clicking it opens the record and shows every installable field');

    // removed command (keyboard: Enter on the focused summary)
    const gone = base.BOT_CMDS.ChatGPT[2]; c = clone(base); c.rev = 2; c.BOT_CMDS.ChatGPT.splice(2, 1);
    await openDiff(c);
    ok(await expands('- ChatGPT: ' + gone.l, [gone.t, gone.d, gone.w, gone.tier, gone.g].filter(Boolean), true) === true, 'A4: removed command - Enter on the summary opens the previous record, all values visible');

    // added chatbot: card + notes + each command expandable on its own
    const nb = clone(base.CHATBOTS[1]); Object.assign(nb, { name: 'UiBot', maker: 'UI-MAKER', url: 'https://ui.example/', blurb: 'UI-BLURB', brief: 'UI-BRIEF', best: 'UI-BEST', free: 'UI-FREE', limit: 44444 });
    c = clone(base); c.rev = 2; c.CHATBOTS.push(nb); c.BOT_NOTES.UiBot = 'UI-NOTES'; c.BOT_CMDS.UiBot = [cmd('UiOne'), cmd('UiTwo', { tier: 'paid' })];
    await openDiff(c);
    const r1 = await expands('+ New chatbot: UiBot', ['UI-MAKER', 'https://ui.example/', 'UI-BLURB', 'UI-BRIEF', 'UI-BEST', 'UI-FREE', '44444', 'UI-NOTES']);
    const r2 = await expands('+ UiBot: UiOne', ['UI-PROMPT-UiOne', 'UI-DESC-UiOne', 'UI-WHERE-UiOne', 'UI-FIELD-UiOne']);
    const r3 = await expands('+ UiBot: UiTwo', ['UI-PROMPT-UiTwo', 'paid', 'UI-DESC-UiTwo']);
    ok(r1 === true && r2 === true && r3 === true, 'A4: added chatbot - card fields and notes expand, and each added command expands on its own ' + [r1, r2, r3].filter(x => x !== true).join(' ; '));

    // removed chatbot: card + notes + every command expandable
    const last = base.CHATBOTS[base.CHATBOTS.length - 1], ln = last.name, lc = base.BOT_CMDS[ln];
    c = clone(base); c.rev = 2; c.CHATBOTS.pop(); delete c.BOT_NOTES[ln]; delete c.BOT_CMDS[ln];
    await openDiff(c);
    const rc = await expands('- Removed chatbot: ' + ln, [last.maker, last.url, last.blurb, base.BOT_NOTES[ln]]);
    const bad = []; for (const p of lc) { const r = await expands('- ' + ln + ': ' + p.l, [p.t, p.d].filter(Boolean)); if (r !== true) bad.push(p.l + ' -> ' + r); }
    ok(rc === true && bad.length === 0, 'A4: removed chatbot - card, notes and all ' + lc.length + ' removed commands expand with their values ' + (rc === true ? '' : rc) + bad.join(' ; '));

    // hostile markup: opened rows show it as text and nothing runs
    c = clone(base); c.rev = 2; c.BOT_CMDS.ChatGPT.push(cmd('HostileUi', { d: HOSTILE, t: HOSTILE }));
    await openDiff(c); const rh = await expands('+ ChatGPT: HostileUi', ['<img src=x onerror="window.__pwn4=1">']);
    ok(rh === true && (await q.$$('#catDiff img')).length === 0 && (await q.evaluate(() => window.__pwn4)) === undefined, 'A4: hostile markup is visible as literal text when the record is opened, and no element or script is created ' + (rh === true ? '' : rh));

    // large diff: gate holds in the live UI; hidden rows cannot be installed; after Show all the later rows are expandable too
    const big = clone(base); big.rev = 3;
    for (const n of Object.keys(big.BOT_CMDS)) for (let i = 0; i < 70; i++) big.BOT_CMDS[n].push(cmd('Gate' + n.replace(/\W/g, '') + i));
    await openDiff(big);
    const dis = await q.locator('#catInstallBtn').isDisabled();
    await q.locator('#catInstallBtn').click({ force: true, timeout: 2000 }).catch(() => {});
    const stored = await q.evaluate(() => localStorage.getItem('pb-catalog-v1'));
    ok(dis && stored === null && (await q.$$('#catDiffList > li')).length === 500, 'A4: large diff - Install is disabled, a forced click stores nothing, and only 500 rows are shown');
    await q.click('#catShowAllBtn');
    const total = (await q.textContent('#catDiff')).match(/\((\d+) in total\)/);
    const lastRow = q.locator('#catDiffList > li').filter({ has: q.locator('summary') }).last(); /* the final plain row is the revision line, which has no record */
    await lastRow.locator('summary').click();
    ok(total && (await q.$$('#catDiffList > li')).length === +total[1] && !(await q.locator('#catInstallBtn').isDisabled()) && await lastRow.locator('details').evaluate(d => d.open) && await lastRow.locator('details pre').first().isVisible(), 'A4: after "Show all" every row is present, the last row can be opened, and Install is enabled');
    await q.context().close();
  }

  /* ============ A5: every schema field of every added/removed record, collapsed-by-default, mouse + keyboard (Tab, Enter, Space), gate ============ */
  {
    const q = await open();
    const base = await q.evaluate(() => JSON.parse(JSON.stringify(cleanCatalog(BUILTIN_CATALOG))));
    const FIELDS = await q.evaluate(() => ({ bot: CATALOG_FIELDS.bot.slice(), cmd: CATALOG_FIELDS.cmd.slice(), label: FIELD_LABEL }));
    const clone = o => JSON.parse(JSON.stringify(o));
    const strOf = x => x === undefined ? 'none' : (typeof x === 'string' ? x : JSON.stringify(x));
    const openDiff = async cat => { await q.evaluate(() => { document.getElementById('catImportBox').hidden = false; }); await q.fill('#catImportText', JSON.stringify(cat)); await q.click('#catImportGo'); };
    const rowFor = prefix => q.locator('#catDiffList > li').filter({ has: q.locator('summary', { hasText: prefix }) }).first();
    /* the record shown for a row: [{label, value}] read from what is on screen */
    const shown = async li => li.locator('details .fullval > div').evaluateAll(ds => ds.map(d => ({ label: d.querySelector('b').textContent.replace(/:$/, ''), value: d.querySelector('pre').textContent })));
    /* checks one record: starts collapsed and hidden; Enter/Space/mouse open+close; then every schema field is visible with the exact value */
    const checkRecord = async (prefix, obj, keys, extra) => {
      const li = rowFor(prefix), det = li.locator('details'), sum = li.locator('summary'); const problems = [];
      if (await li.count() === 0) return ['no row: ' + prefix];
      const want = keys.map(k => ({ label: FIELDS.label[k] || k, value: strOf(obj[k]) })).concat(extra || []);
      if (await det.evaluate(d => d.open)) problems.push('starts open');
      if (await li.locator('details pre:visible').count() !== 0) problems.push('values visible while collapsed');
      await sum.click(); if (!(await det.evaluate(d => d.open))) problems.push('mouse click did not open');
      await sum.click(); if (await det.evaluate(d => d.open)) problems.push('second mouse click did not close');
      await sum.focus(); await q.keyboard.press('Enter'); if (!(await det.evaluate(d => d.open))) problems.push('Enter did not open');
      await q.keyboard.press('Enter'); if (await det.evaluate(d => d.open)) problems.push('Enter did not close');
      await q.keyboard.press('Space'); if (!(await det.evaluate(d => d.open))) problems.push('Space did not open');
      const rec = await shown(li), visible = await li.locator('details pre').evaluateAll(ps => ps.every(p => p.getClientRects().length > 0));
      if (!visible) problems.push('not all values visible when open');
      want.forEach(w => { if (!rec.some(r => r.label === w.label && r.value === w.value)) problems.push('missing ' + w.label + '=' + w.value.slice(0, 30)); });
      await q.keyboard.press('Space'); if (await det.evaluate(d => d.open)) problems.push('Space did not close');
      return problems;
    };
    const full = (l, extra) => Object.assign({ g: 'Acme Group', k: 'ask', tier: 'account', t: 'T-' + l, l: l, w: 'W-' + l, d: 'D-' + l, f: ['F1-' + l, 'F2-' + l], v: '2026-10-05', st: 'conflicting' }, extra || {});

    // added command: EVERY field in CATALOG_FIELDS.cmd
    let c = clone(base); c.rev = 2; const addC = full('AllFieldsAdded'); c.BOT_CMDS.Claude.push(addC);
    await openDiff(c);
    let pr = await checkRecord('+ Claude: AllFieldsAdded', addC, FIELDS.cmd);
    ok(pr.length === 0 && FIELDS.cmd.length >= 10, 'A5: added command - all ' + FIELDS.cmd.length + ' schema fields (' + FIELDS.cmd.join(',') + ') are shown with exact values; collapsed first; mouse, Enter and Space toggle it ' + pr.join('; '));

    // removed command: EVERY field, including one that has fill-in boxes
    const withF = base.BOT_CMDS.ChatGPT.findIndex(p => p.f && p.f.length), goneC = base.BOT_CMDS.ChatGPT[withF];
    c = clone(base); c.rev = 2; c.BOT_CMDS.ChatGPT.splice(withF, 1);
    await openDiff(c);
    pr = await checkRecord('- ChatGPT: ' + goneC.l, goneC, FIELDS.cmd);
    ok(withF >= 0 && pr.length === 0, 'A5: removed command (with fill-in boxes: ' + goneC.l + ') - all schema fields shown with their previous values ' + pr.join('; '));

    // added chatbot: every CATALOG_FIELDS.bot field + notes + every command with every field
    const nb = clone(base.CHATBOTS[1]); Object.assign(nb, { name: 'Fieldy AI', maker: 'FIELDY-MAKER', url: 'https://fieldy.example/', color: '#abcdef', limit: 54321, blurb: 'FB', brief: 'FBR', best: 'FBEST', free: 'FFREE', v: '2026-10-06', st: 'doc' });
    const nCmds = [full('FC1'), full('FC2', { f: undefined, tier: 'paid', k: 'ui' }), full('FC3', { st: 'unverified' })]; delete nCmds[1].f;
    c = clone(base); c.rev = 2; c.CHATBOTS.push(nb); c.BOT_NOTES['Fieldy AI'] = 'FIELDY-NOTES'; c.BOT_CMDS['Fieldy AI'] = nCmds;
    ok((await q.evaluate(x => validateCatalog(x).length, c)) === 0, 'A5: (setup) added-chatbot catalog is valid');
    await openDiff(c);
    pr = await checkRecord('+ New chatbot: Fieldy AI', nb, FIELDS.bot, [{ label: 'notes', value: 'FIELDY-NOTES' }]);
    ok(pr.length === 0 && FIELDS.bot.length >= 11, 'A5: added chatbot - all ' + FIELDS.bot.length + ' card fields (' + FIELDS.bot.join(',') + ') plus notes are shown ' + pr.join('; '));
    const badAdd = []; for (const p of nCmds) { const r = await checkRecord('+ Fieldy AI: ' + p.l, p, FIELDS.cmd); if (r.length) badAdd.push(p.l + ': ' + r.join(', ')); }
    ok(badAdd.length === 0, 'A5: every command of the added chatbot (' + nCmds.length + ', one without fill-in boxes) shows all ' + FIELDS.cmd.length + ' fields ' + badAdd.join(' | '));

    // removed chatbot: card + notes + every removed command, all fields
    const last = base.CHATBOTS[base.CHATBOTS.length - 1], ln = last.name, lc = base.BOT_CMDS[ln];
    c = clone(base); c.rev = 2; c.CHATBOTS.pop(); delete c.BOT_NOTES[ln]; delete c.BOT_CMDS[ln];
    await openDiff(c);
    pr = await checkRecord('- Removed chatbot: ' + ln, last, FIELDS.bot, [{ label: 'notes', value: strOf(base.BOT_NOTES[ln]) }]);
    ok(pr.length === 0, 'A5: removed chatbot (' + ln + ') - all card fields and notes shown with previous values ' + pr.join('; '));
    const badRem = []; for (const p of lc) { const r = await checkRecord('- ' + ln + ': ' + p.l, p, FIELDS.cmd); if (r.length) badRem.push(p.l + ': ' + r.join(', ')); }
    ok(lc.length > 0 && badRem.length === 0, 'A5: all ' + lc.length + ' commands of the removed chatbot show every schema field ' + badRem.join(' | '));

    // keyboard: Tab reaches the first record from the Validate button, then moves record to record, Shift+Tab goes back
    await q.focus('#catImportGo'); await q.keyboard.press('Tab');
    const t1 = await q.evaluate(() => { const a = document.activeElement; return { tag: a.tagName, inList: !!a.closest('#catDiffList'), text: a.textContent.slice(0, 40) }; });
    await q.keyboard.press('Tab');
    const t2 = await q.evaluate(() => { const a = document.activeElement; return { tag: a.tagName, inList: !!a.closest('#catDiffList'), text: a.textContent.slice(0, 40) }; });
    await q.keyboard.press('Shift+Tab');
    const t3 = await q.evaluate(() => document.activeElement.textContent.slice(0, 40));
    ok(t1.tag === 'SUMMARY' && t1.inList && t2.tag === 'SUMMARY' && t2.text !== t1.text && t3 === t1.text, 'A5: keyboard - Tab goes from "Validate" to the first record, then record to record; Shift+Tab goes back (' + t1.text.trim() + ' -> ' + t2.text.trim() + ')');

    // hostile markup in an expanded ADDED record: the record text equals the hostile string exactly; nothing is created or run
    const HOST = '<img src=x onerror="window.__pwn5=1"><script>window.__pwn5=2<\/script><b>bold</b>';
    c = clone(base); c.rev = 2; c.BOT_CMDS.ChatGPT.push(full('HostileFive', { t: HOST, d: HOST, w: HOST, l: 'HostileFive' }));
    await openDiff(c); await rowFor('+ ChatGPT: HostileFive').locator('summary').click();
    const hv = await shown(rowFor('+ ChatGPT: HostileFive'));
    ok(hv.filter(r => r.value === HOST).length === 3 && (await q.$$('#catDiff img')).length === 0 && (await q.$$('#catDiff script')).length === 0 && (await q.evaluate(() => window.__pwn5)) === undefined, 'A5: hostile markup in an opened added record is shown as exact literal text; no image or script is created and nothing runs');

    // gate in the live UI: forced clicks, keyboard activation and direct calls store nothing; "Show all" then a real install works
    const big = clone(base); big.rev = 4;
    for (const n of Object.keys(big.BOT_CMDS)) for (let i = 0; i < 70; i++) big.BOT_CMDS[n].push(full('G' + n.replace(/\W/g, '') + i));
    await openDiff(big);
    const tot = +(await q.textContent('#catDiff')).match(/\((\d+) in total\)/)[1];
    await q.locator('#catInstallBtn').click({ force: true, timeout: 2000 }).catch(() => {});
    await q.focus('#catInstallBtn').catch(() => {}); await q.keyboard.press('Enter'); await q.keyboard.press('Space');
    await q.evaluate(() => installCatalog());
    const early = await q.evaluate(() => ({ stored: localStorage.getItem('pb-catalog-v1'), rev: CATALOG.rev }));
    ok(tot > 500 && early.stored === null && early.rev === 1 && /Showing 500 of/.test(await q.textContent('#catShownCount')), 'A5: gate - with ' + tot + ' changes, forced click, Enter, Space and a direct call all fail to install while only 500 are shown');
    await q.click('#catShowAllBtn');
    const rows = (await q.$$('#catDiffList > li')).length;
    await Promise.all([q.waitForEvent('load'), q.click('#catInstallBtn')]); await q.waitForTimeout(400);
    const after = await q.evaluate(() => ({ stored: !!localStorage.getItem('pb-catalog-v1'), rev: CATALOG.rev, src: CATALOG_SRC }));
    ok(rows === tot && after.stored && after.rev === 4 && after.src === 'saved', 'A5: gate - after "Show all" all ' + rows + ' changes are listed and Install then works (rev 4 saved)');
    await q.context().close();
  }

  /* =============================== B: status wording =============================== */
  const chipsInDom = async page => {
    let n = 0;
    for (const name of await page.evaluate(() => CHATBOTS.map(c => c.name))) {
      await page.click('.botcard[data-bot="' + name + '"]');
      n += await page.evaluate(() => document.querySelectorAll('#botCmdPills .vchip').length + document.querySelectorAll('#botNote .vchip').length);
    }
    return n;
  };
  const statusNumbers = async page => {
    const t = await page.textContent('#catStatus');
    const m = t.match(/(\d+) of (\d+) entries/), c = t.match(/Only (\d+) of them show a grey chip/);
    return { t: t, need: +m[1], total: +m[2], chips: +c[1] };
  };
  // fresh: doc entries are recent, so their command chips are hidden
  p = await open();
  const f = await statusNumbers(p);
  const fIndep = await p.evaluate(() => { let need = 0, total = 0; const cnt = o => { total++; const a = ageDays(o.v); if ((o.st && o.st !== 'confirmed') || (a !== null && a > 60) || (!o.st && !o.v)) need++; }; CHATBOTS.forEach(cnt); Object.values(BOT_CMDS).forEach(l => l.forEach(cnt)); return { need, total }; });
  const fDom = await chipsInDom(p);
  ok(f.need === fIndep.need && f.total === fIndep.total, 'B (fresh): the counted total/needing re-check match an independent count ' + JSON.stringify(fIndep));
  ok(f.chips < f.need, 'B (fresh): chips shown (' + f.chips + ') is fewer than entries needing re-check (' + f.need + '), and the text says so');
  ok(f.chips === fDom, 'B (fresh): chip count in the sentence (' + f.chips + ') equals real grey chips on screen across all chatbots (' + fDom + ')');
  ok(!/grey chips mark them/i.test(f.t) && /doc only/.test(f.t) && /no chip does not mean an entry is confirmed/.test(f.t) && /stay chip-free until they are 60 days old/.test(f.t), 'B (fresh): wording does not claim every counted entry has a chip and explains suppressed doc chips');
  const docHidden = await p.evaluate(() => { const i = BOT_CMDS.ChatGPT.findIndex(x => x.st === 'doc'); return { fresh: i >= 0 }; });
  await p.click('.botcard[data-bot="ChatGPT"]');
  ok(docHidden.fresh && await p.evaluate(() => !document.querySelector('#botCmdPills .vc-doc')), 'B (fresh): doc-only commands show no chip in the command list');
  const sh = await p.textContent('#startHere');
  ok(/No chip does not mean confirmed/.test(sh) && !/Grey chips mark items that are unverified or not checked recently/.test(sh) && /has not been checked for 60 days/.test(sh), 'B: Start here wording is accurate (no chip is not a guarantee)');
  ok(!/grey chips mark them/i.test(await p.evaluate(() => document.body.innerText)), 'B: no remaining "grey chips mark them" wording anywhere on the page');
  await p.context().close();
  // stale: 100 days later, every entry is old; chips must now appear on doc commands too
  p = await open({ plusDays: 100 });
  const s2 = await statusNumbers(p), s2Dom = await chipsInDom(p);
  ok(s2.need === s2.total && s2.chips === s2.total && s2.chips === s2Dom, 'B (stale): all ' + s2.total + ' entries need a re-check and show a chip; sentence matches the screen (' + s2Dom + ')');
  await p.click('.botcard[data-bot="ChatGPT"]');
  ok(await p.evaluate(() => [...document.querySelectorAll('#botCmdPills .vchip')].some(x => /Doc only · old/.test(x.textContent))), 'B (stale): doc-only commands now show a "Doc only · old" chip');
  ok(/not checked for 60 days/.test(s2.t) && !/grey chips mark them/i.test(s2.t), 'B (stale): wording remains accurate');
  await p.context().close();

  /* =============================== C: multi-part protocol =============================== */
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  ok(!/all parts sent|Do not reply until I say|until I say/.test(html), 'C: the old "do not reply until I say all parts sent" instruction is gone from the source');
  p = await open();
  const C = await p.evaluate(() => {
    const body = Array.from({ length: 60 }, (_, i) => 'Paragraph MARK' + i + ' ' + 'lorem ipsum '.repeat(12)).join('\n\n');
    const limit = 3000, parts = splitPrompt(body, limit), n = parts.length;
    const joined = parts.map(x => x.replace(/^\[PART \d+ OF \d+\] [^\n]*\n\n/, '').replace(/\n\n\[END OF PART \d+ OF \d+\]$/, '')).join('\n\n');
    let allMarks = true; for (let i = 0; i < 60; i++) if (!joined.includes('MARK' + i + ' ')) allMarks = false;
    return { n, maxLen: Math.max(...parts.map(x => x.length)), limit, first: parts[0], mid: parts[1], last: parts[n - 1], allMarks };
  });
  ok(C.n >= 3 && C.maxLen <= C.limit && C.allMarks, 'C: splitting keeps every paragraph and every part within the budget (' + C.n + ' parts, longest ' + C.maxLen + ')');
  ok(/Do NOT answer yet/.test(C.first) && /Reply only with "Received part 1" and nothing else/.test(C.first) && /Do not start the task until the part marked FINAL PART arrives/.test(C.first), 'C: part 1 instruction = acknowledge only, do not start until FINAL PART');
  ok(/Received part 2"/.test(C.mid) && /FINAL PART arrives/.test(C.mid), 'C: middle parts use the same protocol with their own number');
  ok(/FINAL PART\. You now have all \d+ parts/.test(C.last) && /Do not reply "Received"/.test(C.last) && /respond to it in full now/.test(C.last) && !/Do NOT answer yet/.test(C.last), 'C: final part clearly tells the chatbot to answer now, not acknowledge');
  // Dev Bay paste-this-first
  await p.evaluate(() => { openModificationModal(); document.getElementById('modalChange').value = 'Test change'; document.getElementById('modalWhy').value = 'Test reason'; document.getElementById('modalAI').value = CHATBOTS.find(c => c.name === 'Claude').name + ' (Anthropic)'; compileModificationPayload(); });
  await p.click('#modFirstBtn'); await p.waitForTimeout(150);
  const first = await p.evaluate(() => navigator.clipboard.readText());
  const real = await p.evaluate(() => { const bot = CHATBOTS.find(c => c.name === 'Claude'); return splitPrompt(document.getElementById('modificationPreview').textContent, bot.limit).length; });
  const claimed = +(first.match(/arrives as (\d+) pasted parts/) || [])[1];
  ok(claimed === real && real > 1, 'C: paste-this-first states the real number of parts (' + claimed + ' vs ' + real + ')');
  ok(/Reply to THIS message only with "Ready"/.test(first) && /reply only with "Received part k" and nothing else/.test(first) && /Do not start the task until the part marked FINAL PART arrives/.test(first), 'C: paste-this-first uses the same acknowledge-only / FINAL PART protocol');
  ok(!/all parts sent|until I say/.test(first) && /If a \.html file is attached to this message/.test(first) && /CONTINUE_REQUIRED/.test(first), 'C: paste-this-first has no contradictory instruction and keeps the attach-file route');
  ok(/\[PART k OF n\]/.test(first) && /^\[PART 1 OF/.test(C.first) && /Received part/.test(first) && /Received part/.test(C.first) && /FINAL PART/.test(first) && /FINAL PART/.test(C.first), 'C: the first prompt and the split parts use the same labels ([PART k OF n], Received part, FINAL PART)');
  await p.evaluate(() => { document.getElementById('modificationPreview').textContent = 'short package'; }); await p.click('#modFirstBtn'); await p.waitForTimeout(150);
  const one = await p.evaluate(() => navigator.clipboard.readText());
  ok(/one pasted message/.test(one) && /"Ready"/.test(one) && !/Received part/.test(one), 'C: single-message package gets a matching one-message instruction');
  // on-screen instructions
  await p.evaluate(() => { openModificationModal(); document.getElementById('modalChange').value = 'x'; document.getElementById('modalWhy').value = 'y'; compileModificationPayload(); launchMod(); });
  const modBox = await p.textContent('#modSplitBox');
  ok(/Received part N/.test(modBox) && /FINAL PART/.test(modBox) && /"Ready"/.test(modBox) && !/all parts sent/.test(modBox), 'C: Dev Bay on-screen instructions describe the same protocol');
  await p.click('.botcard[data-bot="Perplexity"]'); await p.fill('#corePrompt', 'word '.repeat(4000)); await p.waitForTimeout(150); await p.click('#launchBtn'); await p.waitForTimeout(200);
  const splitBox = await p.textContent('#splitBox');
  ok(/Received part N/.test(splitBox) && /FINAL PART/.test(splitBox) && !/all parts sent/.test(splitBox), 'C: main prompt split instructions describe the same protocol');
  await p.selectOption('#catEngine', 'Perplexity'); await p.click('#catPackBtn'); await p.waitForTimeout(200);
  const catBox = await p.textContent('#catSplitBox');
  ok(/Received part N/.test(catBox) && /FINAL PART/.test(catBox) && !/all parts sent/.test(catBox), 'C: catalog package split instructions describe the same protocol');
  ok(!/all parts sent|until I say/.test(await p.evaluate(() => document.body.innerText)), 'C: no contradictory wording anywhere on screen after using all three split flows');
  await p.context().close();

  /* =============================== general =============================== */
  ok(reqs.length === 0, 'no network requests in any scenario (' + reqs.length + ')');
  console.log('errors:', JSON.stringify(errs));
  ok(errs.length === 0, 'no console or page errors');
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  await b.close(); process.exit(fail ? 1 : 0);
})();
