# Regression Checklist

Run the relevant checks before accepting a change or release. Mark each item **Pass**, **Fail**, **Not run** or **Not applicable** and record browser/device details.

## Source and packaging

- [ ] The application opens from the complete standalone `index.html`.
- [ ] No unapproved external library, CDN, framework, build step or backend has been introduced.
- [ ] JavaScript parses without syntax errors.
- [ ] Version string and migration history are updated consistently.
- [ ] Clean-source export contains the full app and excludes transient UI state.
- [ ] Dev Bay export preserves required source, instructions and version history.

## First-use experience

- [ ] A first-time user can identify where to choose a chatbot.
- [ ] A first-time user can find Bot Commands and Prompt Craft.
- [ ] A first-time user can enter a plain-language task and understand the compiled prompt.
- [ ] Labels and help text use ordinary language and explain paid/limited requirements.
- [ ] The app remains useful without a paid chatbot plan.

## Chatbot selection and commands

- [ ] All nine chatbot options render and can be selected.
- [ ] Switching chatbots updates the relevant notes, command choices and paste-budget estimate.
- [ ] Free/account/limited/paid classifications are visible and accurate to the documented verification status.
- [ ] Bot-specific commands are filtered to the correct chatbot.
- [ ] Prompt Craft remains usable across supported chatbots.
- [ ] No unsupported command is presented as a guaranteed native feature.

## Prompt compilation and transfer

- [ ] Selected commands and prompt fields appear in the compiled prompt.
- [ ] Editing core text updates the compiled prompt and size indicators.
- [ ] Character/word/token estimates update and are clearly estimates.
- [ ] Over-budget prompts split into ordered parts without losing content.
- [ ] Multi-part instructions use one consistent send/acknowledgement/completion protocol.
- [ ] Unicode text, including emoji and non-Latin scripts, survives splitting.
- [ ] Copy and launch works where browser permissions allow; manual fallback is clear.

## Attachments and context

- [ ] Supported text files can be previewed/embedded as intended.
- [ ] Images and files requiring manual upload are clearly distinguished from embedded text.
- [ ] Inline attachment content is counted toward prompt size.
- [ ] Oversize, unsupported and failed extraction cases show understandable errors.
- [ ] Attachment content is not silently lost during compilation or splitting.

## Presets and local settings

- [ ] Presets save, load, rename and delete correctly.
- [ ] Existing presets survive app updates where compatibility is expected.
- [ ] Import validates input, handles duplicates and rejects malformed/oversize data safely.
- [ ] Export contains only intended settings and does not unexpectedly include attachments or private source text.
- [ ] Theme, palette and layout preferences behave as documented.
- [ ] Reset controls restore a predictable default state.

## Catalogue import and installation review (v5.4+)

- [ ] Every field accepted by catalogue validation/normalisation is represented in the installation diff.
- [ ] Chatbot maker, colour, command placeholders, tier labels/descriptions, notes, links, ordering and other retained fields are covered.
- [ ] Changed human-facing text shows meaningful before/after values, with a safe way to inspect full long values.
- [ ] Dynamic values are safely escaped; catalogue content cannot inject markup or script into the review.
- [ ] Added, removed, reordered and duplicate-keyed commands are represented correctly.
- [ ] Revision, update date and status metadata are clearly distinguished from content changes.
- [ ] Aggregate change counts match the complete diff.
- [ ] If the diff is long, the interface makes the total and currently visible count explicit and allows inspection of every change before installation.
- [ ] No installation occurs until the user explicitly approves the fully reviewable diff.
- [ ] Invalid, older or malformed catalogues are rejected without replacing the last known-good catalogue.
- [ ] Embedded catalogue and standalone `catalog.json` are identical for the release snapshot.

### v5.4.0 owner real-browser verification — completed 2026-11-20

The final owner acceptance record is **six of six PASS**. The owner initially selected the wrong index.html for the Test 4 retest and entered that result in the wrong field. The owner corrected the record, downloaded the correct index.html from the corrective branch, repeated only Test 4 using the original Test 4 package, and updated all six fields.

- [x] [1] Add/remove command workflow — owner PASS.
- [x] [2] Add chatbot workflow — owner PASS.
- [x] [3] Remove chatbot workflow — owner PASS.
- [x] [4] Large 631-change catalogue workflow — owner PASS after repeating Test 4 with the correct corrective-branch index.html and original package.
- [x] [5] Booby-trapped catalogue text remains inert — owner PASS.
- [x] [6] Broken catalogue is refused — owner PASS.
- [x] Optional narrow-window repeat of Test 1 — owner PASS.

Browser/device details were not recorded. The owner did not report performing the installation action. Claude's isolated disposable-profile install test is implementer-reported and must not be represented as owner-tested.

## Dev Bay

- [ ] Change request and reason are included in the modification package as intended.
- [ ] Downloaded clean HTML is complete and opens independently.
- [ ] Paste-first instructions accurately state the number of parts.
- [ ] Part instructions do not contradict the splitter's acknowledgement protocol.
- [ ] A receiving AI is instructed to preserve features, update version history and return the complete file.
- [ ] The generated package does not expose local presets or unrelated personal data.

## Accessibility and responsive layout

- [ ] Keyboard navigation works for interactive controls.
- [ ] Focus indicators remain visible.
- [ ] Controls have useful accessible names/labels.
- [ ] Layout works at narrow mobile widths and desktop widths.
- [ ] Text remains readable at normal zoom and with longer labels.

## Offline and browser checks

- [ ] Prompt building works with network access disabled if the architecture promises offline operation.
- [ ] Downloaded `file://` HTML uses a safe fallback when remote data cannot load.
- [ ] No unhandled console errors occur in the main workflows.
- [ ] Clipboard restrictions produce a clear manual fallback.

## Release record

**Version:** 5.4.0 (not released)  
**Release branch / commit:** `release/v5.4.0` at `023171dc60af78d43081a447d41009f153d82127` (corrective PR #3 not yet merged)  
**Corrective branch / commit:** `fix/v5.4.0-test4-install-button-state` at `0bdeb9622d2a0a5a1ad49d48711aa8c768cf7478`  
**Date:** 2026-11-20  
**Browsers / devices:** automated headless Chromium 157.0.8103.78 only (fresh clone, Linux, Node v22.23.5, Playwright 1.63.0); owner browser/device not yet recorded  
**Checks passed:** On release baseline `023171d`, Claude-reported: suite 1 = 49, suite 2 = 18, corrective = 111 (178 total). On corrective branch `0bdeb962`, Claude-reported: suite 1 = 49, suite 2 = 18, corrective = 120 (187 total), in worktree and fresh clone. These are implementer-reported, not independently reproduced. Raw logs for the earlier baseline: `docs/test-evidence/v5.4.0-023171d/`.  
**Checks failed:** none reported  
**Not run:** independent re-run of the suites; mobile, screen-reader, Firefox and Safari checks  
**Known limitations:** no CI; owner and independent runs outstanding; no version-log entry for the three post-merge commits; the reconciled `readme.md` exists only on the docs branch and conflicts with `main`'s until PR #1 is merged; live GitHub Pages build unverified  
**Owner browser acceptance:** six of six PASS. **Formal release decision:** pending.


### Test 4 corrective regression checks — completed on corrective branch

Claude reports the following verification in `fix/v5.4.0-test4-install-button-state` (commit `0bdeb962`):
- [x] Install and reload is semantically and functionally disabled before the required review action; pointer, Enter, Space and programmatic activation are blocked.
- [x] The control becomes enabled only after Show all; the isolated disposable-profile workflow then permits installation.
- [x] Disabled/enabled states are visibly distinct across five palettes and light/dark modes.
- [x] Affected control text contrast, borders/state cues, pointer behavior and accessible disabled state were checked.
- [x] Existing visual design, including the intentionally dark compiled-prompt area, was preserved.
- [x] Fresh 631-change scenario verified before and after Show all; installation tested only in a disposable browser profile.
- [x] Owner repeated Test 4 using the correct corrective-branch index.html and original package; all six owner acceptance tests now PASS.

These corrective technical checks are **Claude-reported** except the owner's six-test acceptance result, which is **owner-verified**. The corrective commit is proposed to the release branch in PR #3 and is not yet merged.

**Integration status:** PR #3 is open from `fix/v5.4.0-test4-install-button-state` into `release/v5.4.0`. GitHub's create-PR response reports `mergeable=false`; investigate before any merge. No release approval is implied.

### Test 4 corrective regression checks — completed on corrective branch

Claude reports the following verification in `fix/v5.4.0-test4-install-button-state` (commit `0bdeb962`):
- [x] Install and reload is semantically and functionally disabled before the required review action; pointer, Enter, Space and programmatic activation are blocked.
- [x] The control becomes enabled only after Show all; the isolated disposable-profile workflow then permits installation.
- [x] Disabled/enabled states are visibly distinct across five palettes and light/dark modes.
- [x] Affected control text contrast, borders/state cues, pointer behavior and accessible disabled state were checked.
- [x] Existing visual design, including the intentionally dark compiled-prompt area, was preserved.
- [x] Fresh 631-change scenario verified before and after Show all; installation tested only in a disposable browser profile.
- [x] Owner repeated Test 4 using the correct corrective-branch index.html and original package; all six owner acceptance tests now PASS.

These technical checks are **Claude-reported** except the six-test acceptance result, which is **owner-verified**. The corrective commit is proposed to the release branch in PR #3 and is not yet merged.

**Integration status:** PR #3 is open from `fix/v5.4.0-test4-install-button-state` into `release/v5.4.0`. A fresh GitHub REST read reports the PR as mergeable/clean. No merge has been performed.