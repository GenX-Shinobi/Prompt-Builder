# Test evidence: v5.5.0-test.4 at commit 03963dc (PB-550-01 short-viewport split fix)

- Code commit: `03963dc` on `feat/v5.5.0-guided-path`. `index.html` blob `b68565c6a66c1cc3274fc755c1a159bd62f9c3a6`.
- Tested starting head: `3366208` (v5.5.0-test.3). Its `index.html` blob `9055afc344c3c97822dda1f9637194d115a9fc9c` matches the reviewed blob named in the handoff. No intervening changes.
- `main` unchanged at `8f7ee172bad56151795c4627dca82b60c693c130`.
- Environment: `environment.txt` (Linux, Node 22, Playwright 1.63.0, headless Chromium 157).
- Classification: **Claude-reported automated results.** Not independently reproduced, not owner-tested, not run on a real device. Viewport sizes and touch are emulation.

## Reproduction (before, on test.3)

Script: `repro_short_viewport.js <index.html>` (env `SIZES=WxH,...`, `TOUCH=1` for touch taps). It selects Claude, enters a prompt sized for 5+ parts (7 in practice), scrolls the launch button to 12 px from the top with an instant scroll, presses it with a real pointer click or touch tap, waits 700 ms and records the bounds of the pressed button, the split box and Copy part 1.

Cases: Guided task box, Standard Core prompt, Standard console, Guided console (after editing the prompt).

| Viewport | Guided task box | Standard Core | Standard console | Guided console |
|---|---|---|---|---|
| 320x640 to 320x360, 360x400 | visible | visible | visible | visible |
| 320x320 | visible | visible | **off** (part 1 306-350) | **off** |
| 320x300 | **off** (button 8-52, part 1 259-303) | visible | **off** | **off** |
| 320x280, 320x250 | **off** | **off** (part 1 239-283) | **off** | **off** |
| 568x320, 640x300, 640x260, 740x280 (landscape) | visible | visible | visible | visible |

Click and touch gave identical bounds (`repro_before_test3_click.txt`, `repro_before_test3_touch_*.txt`). In every failing case the pressed button stayed on screen, as the PM's simulated-bounds finding predicted.

Cause, confirmed in code: `revealSplit()` measured the whole panel and capped the scroll at the launch row's top minus 8 px, so on short screens Copy part 1 stayed below the bottom edge.

A second cause was found while fixing it. `splitAndCopy()` called `revealSplit()` before `copyText()`. The copy routine returns focus to the pressed button, and if the reveal had scrolled that button off screen, the focus call scrolled the page back. With only the `revealSplit()` change, 8 of 8 cases at 320x280 and 320x250 still failed. Both changes are needed.

Harness note: an early run triggered the button with `element.click()`, which leaves focus elsewhere, and the focus restore then scrolled the page far away. That was a harness artifact. All recorded results use real clicks or taps.

## Fix

- `revealSplit()` measures Copy part 1. If Copy part 1 and the pressed control's row fit within the screen (8 px margins), both stay visible, with Part 1 kept above the toast area where possible. If not, Copy part 1 takes priority and is placed above the toast area where possible.
- `splitAndCopy()` now reveals after the copy.
- No other behavior changed: one moving `#splitBox`, same parts, same clipboard and launch path, same keyboard order.

## After (this build)

`repro_after_click.txt`, `repro_after_touch.txt`: 13 sizes (320x640 down to 320x220, 360x400, landscape) x 4 locations, click and touch. **Copy part 1 is on screen in 52 of 52 cases for each.** The pressed button leaves the screen only in the 17 cases where the two cannot both fit (for example, Guided 320x300: the row and Copy part 1 span 295 px, more than 300 minus the margins). Screenshot: `short-320x280-guided-split.png` (Part 1 clear of the toast; the toast covers parts 2-4 for about 2.6 s and does not block taps).

## Suites

| Suite | test.3 (`3366208`) | This build | Note |
|---|---|---|---|
| `browser_suite_1.js` | 49/49 | 49/49 | version assertion now `5.5.0-test.4` |
| `browser_suite_2.js` | 18/18 | 18/18 | version assertion now `5.5.0-test.4` |
| `browser_corrective.js` | 120/120 | 120/120 | |
| `browser_guided.js` | 82/82 | 82/82 | version assertion now `5.5.0-test.4` |
| `browser_placement.js` | 203/203 | 331/331 | new section 9: 128 short-viewport checks |

New section 9 covers 7 viewports (4 click, 3 touch) x 4 launch locations: 5+ parts, one split box right after the pressed control, Copy part 1 fully on screen, the pressed button still on screen whenever both fit, keyboard Tab from the pressed button reaches Copy part 1 (two Tabs from the console, past Reset all), no page errors. Run against test.3 (`browser_placement_on_test3_failures.log`), the same suite gives 316/331, and all 15 failures are "Copy part 1 is fully on screen" checks. On this build, all 331 pass.

Existing checks still cover switching launch locations (the box moves, no stale set), editing back under budget (hidden, returned home) and the keyboard order.

## Limits

- Emulated viewports only. No real phone, Firefox, Safari or screen reader.
- Keyboard-height emulation is emulation. On Android Chrome the on-screen keyboard usually overlays the page instead of shrinking `innerHeight`, and it normally closes when the button takes focus. The owner's earlier Android Chrome test (five parts, tested layout) is unaffected by this change but was not repeated.
- The failure needs a very short layout viewport (about 300 px or less at 320 px wide). Landscape phones at 568-740 px wide did not fail before the fix.
