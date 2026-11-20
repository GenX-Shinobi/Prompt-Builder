/* Builds the v5.4.0 owner acceptance kit from the release's own catalog.json.
   Usage: node build_kit.js <path to release catalog.json> <release commit sha>
   Writes catalogs/*.json and acceptance-kit.html next to this file. The owner never needs to run this. */
const fs = require('fs'), path = require('path');
const base = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')), sha = process.argv[3] || 'unknown';
const clone = o => JSON.parse(JSON.stringify(o));
const rev2 = () => { const c = clone(base); c.rev = base.rev + 1; c.updated = '2026-11-21'; return c; };
const cmd = (l, extra) => Object.assign({ g: 'Acceptance Group', k: 'ask', tier: 'account', t: 'ACCEPTANCE prompt text for ' + l, l: l, w: 'ACCEPTANCE where-to-find for ' + l, d: 'ACCEPTANCE description for ' + l, f: ['Acceptance box'], v: '2026-11-20', st: 'confirmed' }, extra || {});
const cases = [];

// 1. add + remove a command
let c = rev2(); const addedLabel = 'ACCEPTANCE TEST added command'; c.BOT_CMDS.ChatGPT.push(cmd(addedLabel));
const rem = c.BOT_CMDS.Claude.splice(1, 1)[0];
cases.push({ id: '1', file: '01-add-and-remove-a-command.json', title: 'Add one command and remove another', cat: c, total: 3,
  see: ['A line starting "+ ChatGPT: ' + addedLabel + ' (Acceptance Group)".', 'A line starting "- Claude: ' + rem.l + ' (' + rem.g + ')".', 'A line about the catalogue revision ("rev 1 -> 2").', 'The summary says 3 in total.'],
  open: ['Click the "+ ChatGPT" line. It opens and shows ten labelled values, including: group Acceptance Group, kind ask, free-tier badge account, text added to the prompt "ACCEPTANCE prompt text for ' + addedLabel + '", description, where to find it, fill-in boxes, check date 2026-11-20, status confirmed.', 'Click the "- Claude" line. It opens and shows the old values of that command (its text, description, badge and so on), not blanks.'],
  keyboard: true });

// 2. add a chatbot
c = rev2(); const nb = clone(base.CHATBOTS[1]); Object.assign(nb, { name: 'Acceptance Bot', maker: 'Acceptance Maker', url: 'https://example.com/', blurb: 'ACCEPTANCE card summary', brief: 'ACCEPTANCE free-plan summary', best: 'ACCEPTANCE best for', free: 'ACCEPTANCE free-plan note', limit: 12345 });
c.CHATBOTS.push(nb); c.BOT_NOTES['Acceptance Bot'] = 'ACCEPTANCE notes for the new chatbot'; c.BOT_CMDS['Acceptance Bot'] = [cmd('Acceptance command one'), cmd('Acceptance command two', { tier: 'paid', k: 'ui' })];
cases.push({ id: '2', file: '02-add-a-chatbot.json', title: 'Add a whole new chatbot', cat: c, total: 4,
  see: ['A line starting "+ New chatbot: Acceptance Bot (2 commands".', 'Two more lines: "+ Acceptance Bot: Acceptance command one" and "+ Acceptance Bot: Acceptance command two".', 'The summary says 4 in total.'],
  open: ['Open the "New chatbot" line. It shows the chatbot\'s details (maker "Acceptance Maker", paste limit 12345, the summary texts) and its notes "ACCEPTANCE notes for the new chatbot".', 'Open each command line. Each shows its own full values; the second one shows badge paid.'] });

// 3. remove a chatbot
const lastBot = base.CHATBOTS[base.CHATBOTS.length - 1].name, lastN = base.BOT_CMDS[lastBot].length;
c = rev2(); c.CHATBOTS.pop(); delete c.BOT_NOTES[lastBot]; delete c.BOT_CMDS[lastBot];
cases.push({ id: '3', file: '03-remove-a-chatbot.json', title: 'Remove a whole chatbot (' + lastBot + ')', cat: c, total: lastN + 2,
  see: ['A line starting "- Removed chatbot: ' + lastBot + '" and then ' + lastN + ' lines, one for each of its commands ("- ' + lastBot + ': ...").', 'The summary says ' + (lastN + 2) + ' in total.'],
  open: ['Open the "Removed chatbot" line. It shows what is being removed: its maker, link, summaries and its notes (not blanks).', 'Open two of the command lines. Each shows that command\'s old values.'] });

// 4. large change
c = rev2(); Object.keys(c.BOT_CMDS).forEach(n => { for (let i = 1; i <= 70; i++) c.BOT_CMDS[n].push(cmd('Bulk test ' + i, { f: undefined })); });
Object.keys(c.BOT_CMDS).forEach(n => c.BOT_CMDS[n].forEach(p => { if (p.f === undefined) delete p.f; }));
const bigTotal = Object.keys(c.BOT_CMDS).length * 70 + 1;
cases.push({ id: '4', file: '04-large-change.json', title: 'A very large change (more than 500 items)', cat: c, total: bigTotal,
  see: ['The summary says "' + bigTotal + ' in total" and "Showing 500 of ' + bigTotal + ' changes. Install is turned off until you show all of them."', 'The button "Show all ' + bigTotal + ' changes" is there, and the "Install and reload" button is greyed out.'],
  open: ['Try to press the greyed-out "Install and reload" button (click it, or Tab to it and press Enter). Nothing should happen.', 'Press "Show all ' + bigTotal + ' changes". The list gets longer, the message says it is showing all ' + bigTotal + ', and the Install button is now usable. DO NOT press it. Press Cancel.'] });

// 5. hostile markup
const HL = 'Hostile <b>bold</b> test', HT = '<img src=x onerror="alert(1)"> <script>alert(2)<\/script> <b>bold?</b>';
c = rev2(); c.BOT_CMDS.ChatGPT.push(cmd(HL, { t: HT, d: HT, w: HT }));
cases.push({ id: '5', file: '05-hostile-markup.json', title: 'Booby-trapped text must stay plain text', cat: c, total: 2,
  see: ['A line starting "+ ChatGPT: Hostile <b>bold</b> test" - with the angle brackets and letters visible exactly like that, NOT turned into bold text.', 'No pop-up box appears at any point, and no broken-image icon.'],
  open: ['Open the line. The text added to the prompt, description and where-to-find all read exactly: <img src=x onerror="alert(1)"> <script>alert(2)</script> <b>bold?</b> - as plain visible characters.'] });

// 6. broken catalogue
c = rev2(); c.BOT_CMDS.ChatGPT[0].tier = 'gold-plan';
cases.push({ id: '6', file: '06-broken-catalog-is-refused.json', title: 'A broken catalogue must be refused', cat: c, total: 0,
  see: ['A message starting "Not installed: this catalog has problems" with a plain-English reason.', 'No "Install and reload" button at all.'],
  open: [] });

fs.mkdirSync(path.join(__dirname, 'catalogs'), { recursive: true });
cases.forEach(k => fs.writeFileSync(path.join(__dirname, 'catalogs', k.file), JSON.stringify(k.cat, null, 1) + '\n'));
fs.writeFileSync(path.join(__dirname, 'catalogs', 'cases.json'), JSON.stringify(cases.map(k => ({ id: k.id, file: k.file, total: k.total })), null, 1) + '\n');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const li = a => a.map(x => '<li>' + esc(x) + '</li>').join('');
const caseHtml = k => `
<section class="case" id="case${k.id}">
  <h2>Test ${k.id}: ${esc(k.title)}</h2>
  <ol class="steps">
    <li>Press <b>Copy test ${k.id}</b> here: <button type="button" class="copy" data-n="${k.id}">Copy test ${k.id}</button> <span class="copied" id="copied${k.id}" role="status"></span></li>
    <li>In the app, click <b>Import catalog</b>, click inside the box, paste (<kbd>Ctrl</kbd>+<kbd>V</kbd>, or <kbd>Cmd</kbd>+<kbd>V</kbd> on a Mac), then click <b>Validate &amp; preview changes</b>.</li>
    <li>You should see:<ul>${li(k.see)}</ul></li>
    ${k.open.length ? '<li>Then try:<ul>' + li(k.open) + '</ul></li>' : ''}
    ${k.keyboard ? '<li>Keyboard check: without the mouse, press <kbd>Tab</kbd> until a line is outlined, press <kbd>Enter</kbd> to open it and <kbd>Enter</kbd> again to close it; do the same with <kbd>Space</kbd>. <kbd>Shift</kbd>+<kbd>Tab</kbd> goes back.</li>' : ''}
    <li>Finish by clicking <b>Cancel</b>${k.id === '6' ? ' if there is one (there should be nothing to install)' : ''}. <b>Never press "Install and reload".</b></li>
  </ol>
  <p class="verdict" role="group" aria-label="Result for test ${k.id}"><b>Result:</b>
    <label><input type="radio" name="r${k.id}" value="PASS"> Pass</label>
    <label><input type="radio" name="r${k.id}" value="FAIL"> Fail</label>
    <label><input type="radio" name="r${k.id}" value="SKIPPED" checked> Not tried</label>
    <input type="text" id="note${k.id}" class="note" placeholder="If Fail: what did you see?" aria-label="Notes for test ${k.id}"></p>
  <p class="rule"><b>Pass</b> = everything under "You should see" and "Then try" happened. <b>Fail</b> = anything is missing, blank, the wrong way round, runs as code, or Install could be pressed when it should not.</p>
  <details><summary>Copy button not working? Copy by hand</summary>
    <p>Click inside the box, press <kbd>Ctrl</kbd>+<kbd>A</kbd> then <kbd>Ctrl</kbd>+<kbd>C</kbd>.</p>
    <textarea id="cat${k.id}" readonly rows="6" aria-label="Test catalogue ${k.id}">${esc(JSON.stringify(k.cat))}</textarea></details>
</section>`;

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>v5.4.0 Acceptance Kit</title>
<style>
:root { --bg:#fff; --fg:#1c1f24; --muted:#586069; --card:#f5f7fa; --line:#d0d7de; --accent:#0b5cd5; --ok:#116329; --bad:#b42318; }
@media (prefers-color-scheme: dark) { :root { --bg:#14171c; --fg:#e8eaed; --muted:#a0a8b3; --card:#1d2229; --line:#363d47; --accent:#6ea8fe; --ok:#6fdc8c; --bad:#ff8f85; } }
body { background:var(--bg); color:var(--fg); font:16px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif; margin:0; }
main { max-width:780px; margin:0 auto; padding:16px; }
h1 { font-size:1.5rem; margin:.3em 0; } h2 { font-size:1.15rem; margin:0 0 .4em; }
.case, .box { background:var(--card); border:1px solid var(--line); border-radius:10px; padding:14px 16px; margin:16px 0; }
.steps li { margin:.45em 0; } ul { margin:.3em 0; } kbd { border:1px solid var(--line); border-radius:4px; padding:0 5px; font-size:.9em; }
button.copy { font:inherit; padding:6px 12px; border-radius:8px; border:1px solid var(--accent); background:var(--accent); color:#fff; cursor:pointer; }
button.copy:focus-visible, input:focus-visible, textarea:focus-visible, summary:focus-visible, a:focus-visible, button:focus-visible { outline:3px solid #f5a623; outline-offset:2px; }
.copied { color:var(--ok); font-weight:600; } .rule, .muted { color:var(--muted); font-size:.92rem; }
.note { width:100%; box-sizing:border-box; margin-top:6px; font:inherit; padding:6px; background:var(--bg); color:var(--fg); border:1px solid var(--line); border-radius:6px; }
textarea { width:100%; box-sizing:border-box; font:12px/1.4 ui-monospace,Consolas,monospace; background:var(--bg); color:var(--fg); border:1px solid var(--line); border-radius:6px; }
label { margin-right:12px; white-space:nowrap; } .warn { border-left:5px solid var(--bad); }
button.report { font:inherit; padding:8px 14px; border-radius:8px; border:1px solid var(--accent); background:transparent; color:var(--accent); cursor:pointer; }
</style></head><body><main>
<h1>AI Prompt Builder Hub v5.4.0 - Acceptance Kit</h1>
<p class="muted">Built for release commit <code>${esc(sha)}</code> on branch <code>release/v5.4.0</code>. You only need your web browser. No terminal, no editing, no developer tools.</p>

<section class="box"><h2>Before you start (5 minutes, once)</h2>
<ol class="steps">
<li>Download the real release app: open <a href="https://github.com/GenX-Shinobi/Prompt-Builder/blob/release/v5.4.0/index.html" target="_blank" rel="noopener">index.html on the release branch</a> and use the <b>Download raw file</b> button (the down-arrow icon at the top right of the file). Save it somewhere you can find it.</li>
<li>Double-click the saved <code>index.html</code> to open it in your browser. It works offline.</li>
<li>Scroll to <b>Dev Bay</b>, then the <b>Chatbot catalog</b> box. You will use <b>Import catalog</b> there.</li>
<li>Keep this page open next to the app (two windows or two tabs).</li>
</ol>
<p><b>Nothing is installed unless you press "Install and reload".</b> Every test below ends with <b>Cancel</b>. If you ever press Install by accident, click <b>Use built-in catalog</b> in the same box and everything is back to normal; your saved presets are never touched.</p>
<p class="muted">Tip: after each test press Cancel, then start the next. You can stop at any time; tests you skip count as "Not tried".</p></section>
${cases.map(caseHtml).join('\n')}
<section class="box"><h2>When you are done</h2>
<p>Optional extra: make the browser window narrow (or use your phone's browser) and repeat Test 1 to check the layout stays readable.</p>
<button type="button" class="report" id="reportBtn">Copy my results</button> <span class="copied" id="reportOk" role="status"></span>
<p class="muted">Paste the copied results back to ChatGPT. Include your browser and device (for example "Chrome on Windows 11").</p>
<textarea id="report" rows="9" readonly aria-label="Your results"></textarea></section>
<script>
(function () {
  function copyText(id, okId) {
    var ta = document.getElementById(id), ok = document.getElementById(okId); ta.removeAttribute('readonly');
    function done(msg) { ok.textContent = msg; setTimeout(function () { ok.textContent = ''; }, 4000); }
    function manual() { ta.focus(); ta.select(); try { done(document.execCommand('copy') ? 'Copied.' : 'Select the text below and copy it by hand.'); } catch (e) { done('Select the text below and copy it by hand.'); } ta.setAttribute('readonly', ''); }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(ta.value).then(function () { done('Copied. Now paste it into the app.'); ta.setAttribute('readonly', ''); }, manual); } else manual();
  }
  document.querySelectorAll('button.copy').forEach(function (b) { b.addEventListener('click', function () { var n = b.getAttribute('data-n'); var d = document.getElementById('case' + n).querySelector('details'); copyText('cat' + n, 'copied' + n); }); });
  function build() {
    var lines = ['AI Prompt Builder Hub v5.4.0 acceptance results (release commit ${esc(sha)})', 'Browser/device: (please add)', ''];
    var titles = ${JSON.stringify(cases.map(k => k.id + ': ' + k.title))};
    titles.forEach(function (t) { var n = t.split(':')[0], r = document.querySelector('input[name=r' + n + ']:checked'), note = document.getElementById('note' + n).value.trim();
      lines.push('Test ' + t + ' -> ' + (r ? r.value : 'SKIPPED') + (note ? ' (' + note + ')' : '')); });
    document.getElementById('report').value = lines.join('\\n');
  }
  document.querySelectorAll('input[type=radio],input.note').forEach(function (e) { e.addEventListener('input', build); e.addEventListener('change', build); });
  document.getElementById('reportBtn').addEventListener('click', function () { build(); copyText('report', 'reportOk'); });
  build();
})();
</script>
</main></body></html>
`;
fs.writeFileSync(path.join(__dirname, 'acceptance-kit.html'), html);
console.log('built', cases.length, 'cases from rev', base.rev, '| totals', cases.map(k => k.id + ':' + k.total).join(' '));
