# Test evidence: v5.5.0-test.3 at commit 8bdc885 (PB-550-01 launch and split placement follow-up)

- Code commit: `8bdc8853f7c6a0c4c5de8eb4219bbd9952fe260d` on `feat/v5.5.0-guided-path`. `index.html` blob `9055afc344c3c97822dda1f9637194d115a9fc9c`.
- Previous draft head: `7fda292` (v5.5.0-test.2). `main` unchanged at `8f7ee172bad56151795c4627dca82b60c693c130`.
- Environment: `environment.txt` (Linux, Node 22, Playwright 1.63.0, headless Chromium 157).
- Classification: **Claude-reported automated results.** Not independently reproduced, not owner-tested, not run on a real device.

## What changed

| Where the user types | Copy & launch | Copy part controls after an over-budget launch |
|---|---|---|
| Standard: Core prompt | Directly under the box (unchanged from test.2) | Directly under that button |
| Guided: task box | **Moved** from step 3 to directly under the task box, above the optional format choices | Directly under that button |
| Guided: editable prompt | Console button directly under it (unchanged) | Directly under the console button |

- There is still **one** split box (`#splitBox`). It moves to the button that was pressed, so no second or stale set can exist. When the prompt drops back under budget, the mode changes or the prompt is edited, it is hidden and returned to its console home.
- After a split, the page scrolls only if needed. Copy part 1 ends up on screen and clear of the launch toast, and the pressed button stays on screen. Copy part 1 is the next Tab stop after the pressed button. (In the console, Reset all comes first, then Copy part 1.)
- Splitting, part order, clipboard copying and chatbot launch still go through the unchanged `splitPrompt()`, `copyText()`, `copyPart()` and `window.open` path.
- Copy part buttons now use the shared `.splitbox` style and are at least 44 px tall.

## Results

| Suite | Before (`7fda292`) | This build | Note |
|---|---|---|---|
| `browser_suite_1.js` | 49/49 | 49/49 | Version assertion now `5.5.0-test.3` |
| `browser_suite_2.js` | 18/18 | 18/18 | Version assertion now `5.5.0-test.3` |
| `browser_corrective.js` | 120/120 | 120/120 | Unchanged |
| `browser_guided.js` | 81/81 | 82/82 | Tab from the task box now reaches its Copy & launch first, then the format choices (one check split in two) |
| `browser_placement.js` | 115/115 | 203/203 | Rewritten for this task |

## Coverage of the handoff checklist

| Requested check | Covered by |
|---|---|
| Reach from the task field, format choices **skipped** | Button 14 px under the task box at 8 viewports; on screen with the task box at the top of the screen |
| Reach with a format **chosen** | Same position; copies the formatted prompt |
| Reach after **editing** the generated prompt | Console button directly under the editable prompt; both buttons copy the edited text |
| Reach from the **Standard** input | Button under the Core prompt; on screen with the box at the top |
| **Multiline** input | Typed with Enter in the Core prompt, task box and editable prompt; Enter never launches |
| **Over-budget** prompts, every visible launch location in both modes | Core prompt, Guided task box, console (Standard) and console after editing (Guided): parts appear right after the pressed button, one set only, numbered 1..N in order, part 1 copied, chatbot opened once; Copy part 2 and the last part copy the exact parts |
| No stale part controls | Moving between launch locations, editing, mode switch and dropping under budget all leave one hidden or one current set |
| Part controls **within reach after launch** | 8 viewports from 320x568 to 1920x1080: Copy part 1 on screen, clear of the toast, pressed button still on screen, including the worst case of the button pressed at the very bottom of the screen |
| **Keyboard** | Tab from field to button; Enter and Space launch; Tab from the pressed button to Copy part 1; Enter on Copy part 2 |
| **Touch** | Emulated Pixel 7, iPhone 13 and iPhone SE: tap launch and tap Copy part in both modes |
| Clean export | One empty, hidden split box in its console home; launch buttons at default label |

## Real device vs emulation

- **Real devices: none.** Nothing ran on a physical phone, tablet or computer browser other than headless Chromium.
- **Emulated:** Pixel 7, iPhone 13 and iPhone SE profiles (touch, mobile viewport, device scale).
- **Android with the on-screen keyboard open: NOT tested.** As a proxy only, a Pixel 7 profile with the viewport cut to 412x480 (roughly the space left above an open keyboard) kept Copy & launch on screen below both the Core prompt and the task box. Real Chrome on Android may resize the page differently when the keyboard opens, so this needs a real-device check.
- **Not run:** Firefox, Safari/WebKit, real mobile browsers, screen readers.

## Screenshots

`standard-split-320.png`, `standard-split-1360.png`, `guided-split-320.png`, `guided-split-1360.png`, `standard-split-dark-1360.png`, `guided-console-split-dark-1360.png`, `touch-split-iPhoneSE.png`, `touch-split-Pixel7.png`, `keyboard-proxy-412x480.png`.

Reproduce: `node tests/browser_placement.js index.html <screenshot-dir>`
