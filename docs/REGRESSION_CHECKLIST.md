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

**Version:**  
**Branch / commit:**  
**Date:**  
**Browsers / devices:**  
**Checks passed:**  
**Checks failed:**  
**Not run:**  
**Known limitations:**  
**Reviewer / owner decision:**
