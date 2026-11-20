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

### v5.4.0 owner real-browser verification (not yet done by the owner)

Automated checks for these exist and are Claude-reported only; they do not replace an owner check in a real browser. Use the browser-only kit in `docs/acceptance/v5.4.0/` (kit test numbers in brackets). Mark each **Pass / Fail / Not run** with the browser and device.

- [ ] [1] An added command and a removed command each appear in the preview as a line that opens and closes to show its complete record.
- [ ] [2, 3] An added chatbot (card, notes and each command) and a removed chatbot are inspectable the same way.
- [ ] [1] Keyboard: Tab reaches each expandable line; Enter or Space opens and closes it; focus stays visible.
- [ ] [4] A very large change shows "Showing 500 of N", keeps Install disabled, and enables it only after "Show all".
- [ ] [5] Booby-trapped text is shown as plain characters: nothing bold, no image, no pop-up.
- [ ] [6] A broken catalogue is refused in plain English with no Install button.
- [ ] [all] Cancel closes the preview and installs nothing; the built-in catalogue is unchanged.
- [ ] Layout is readable on a narrow mobile screen and on desktop (optional narrow-window repeat of kit Test 1).

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
**Branch / commit:** `release/v5.4.0` at `023171dc60af78d43081a447d41009f153d82127`  
**Date:** 2026-11-20  
**Browsers / devices:** automated headless Chromium 157.0.8103.78 only (fresh clone, Linux, Node v22.23.5, Playwright 1.63.0); owner browser/device not yet recorded  
**Checks passed:** Claude-reported: suite 1 = 49, suite 2 = 18, corrective = 111 (178 total, exit 0 each); kit self-check 36. Raw logs: `docs/test-evidence/v5.4.0-023171d/`. Not independently reproduced.  
**Checks failed:** none reported  
**Not run:** owner real-browser/device acceptance; independent re-run of the suites; mobile and screen-reader checks  
**Known limitations:** no CI; owner and independent runs outstanding; no version-log entry for the three post-merge commits; the reconciled `readme.md` exists only on the docs branch and conflicts with `main`'s until PR #1 is merged; live GitHub Pages build unverified  
**Reviewer / owner decision:** pending
