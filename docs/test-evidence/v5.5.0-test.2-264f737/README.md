# Test evidence: v5.5.0-test.2 at commit 264f737 (PB-550-01 placement follow-up)

- Code commit: `264f737755f2e242ceceac9c77596fb02406f5d2` on `feat/v5.5.0-guided-path`. `index.html` blob `0446d2a5e2421eae879381a5f8a3729697b49970`.
- Previous build: `59b0312` (v5.5.0-test.1). Baseline `main` unchanged at `8f7ee172bad56151795c4627dca82b60c693c130`.
- Task: owner clarification on issue #11 — keep Copy & launch within easy reach of the field where the user finishes typing, in both modes.
- Environment: see `environment.txt` (Linux, Node 22, Playwright 1.63.0, headless Chromium 157).
- Classification: **Claude-reported automated results.** Not independently reproduced, not owner-tested, not run on a real device.

## What changed

| Mode | Where the user finishes typing | Copy & launch now |
|---|---|---|
| Standard builder | Core prompt box | New button directly under the box (gap 14 px), same card |
| Guided path | Task box, then answer-format choices | New button in step 3, directly under the format choices, beside Rebuild |
| Guided path (editing) | Editable Your prompt panel | Console button, directly under the panel (unchanged) |

The console button `#launchBtn` was not moved or changed. All three buttons call the same `launchBot()`, so copy, split and launch behaviour is shared, not duplicated.

## Results

| Suite | Before (`59b0312`) | This build | Note |
|---|---|---|---|
| `browser_suite_1.js` | 49/49 | 49/49 | Version assertion now `5.5.0-test.2` |
| `browser_suite_2.js` | 18/18 | 18/18 | Version assertion now `5.5.0-test.2` |
| `browser_corrective.js` | 120/120 | 120/120 | Unchanged |
| `browser_guided.js` | 81/81 | 81/81 | Version assertion now `5.5.0-test.2` |
| `browser_placement.js` (new) | n/a | 115/115 | Placement, behaviour parity, keyboard, touch, widths |

Before the version assertions were updated, the three suites failed only the version check against this build.

## Coverage of the owner's checklist

| Requested check | How it was run | Result |
|---|---|---|
| Both modes | Standard and Guided, each button | Pass |
| After editing the generated prompt | Guided edit, then step 3 button and console button | Both copy the edited text exactly |
| Copy, split, launch preserved | Identical clipboard text, opened URL and split parts from every button; empty-prompt behaviour identical | Pass |
| Narrow and desktop viewports | 320x568, 360x640, 375x667, 414x896, 768x1024, 1024x768, 1360x900, 1920x1080 | Pass, no sideways scrolling |
| Multiline input | Typed with Enter in Core prompt, task box and editable prompt | Line breaks kept; Enter never launches |
| Keyboard activation | Tab from field reaches the button; Enter and Space both launch; focus indicator visible | Pass |
| Touch activation | Emulated Pixel 7, iPhone 13, iPhone SE (tap) | Pass |
| Touch target | Every new button at least 44 px tall at every width | Pass |

## Real device vs emulation

- **Real devices: none.** No physical phone or tablet was used.
- **Emulated:** touch and phone viewports via Playwright device profiles in headless Chromium.
- **Not run:** Firefox, Safari/WebKit, real mobile browsers, screen readers.

## Observations for the owner

- Guided path on a small phone: the task box is about 345–520 px above the step 3 button because the six format choices stack one per row (logged as `INFO` lines). The button sits directly under the choices, which is the last step before copying.
- Standard builder on narrow screens: if a prompt is too long and gets split, the Copy part buttons still appear in the console panel further down the page. Behaviour is unchanged, as required; moving them would be a separate decision.

Screenshots: `standard-320.png`, `standard-1360.png`, `standard-dark-1360.png`, `guided-320.png`, `guided-1360.png`, `touch-iPhoneSE.png`.

Reproduce:

```
node tests/browser_placement.js index.html <screenshot-dir>
```
