# Test evidence: v5.5.0-test.1 at commit 91e7ec5 (PB-550-01)

- Code commit: `91e7ec5fa9d432034cad43736adb76680db0c0c2` on `feat/v5.5.0-guided-path`. `index.html` blob `26ebd1b6e6361a98f12c144aaf95ddcd7862f20f`.
- Baseline: `main` at `8f7ee172bad56151795c4627dca82b60c693c130`. `index.html` blob `856fb513eb242d8bf704d96a829f924217b3bc95`.
- Environment: see `environment.txt` (Linux, Node 22, Playwright 1.63.0, headless Chromium 157).
- Classification: **Claude-reported automated results.** These are not independently reproduced, not owner-tested and not run on a real device.

| Suite | Baseline `8f7ee17` | This build | Note |
|---|---|---|---|
| `browser_suite_1.js` | 49/49 | 49/49 | One assertion now expects version `5.5.0-test.1` instead of `5.4.0` |
| `browser_suite_2.js` | 18/18 | 18/18 | One assertion now expects version `5.5.0-test.1` instead of `5.4.0` |
| `browser_corrective.js` | 120/120 | 120/120 | Unchanged |
| `browser_guided.js` (new) | n/a | 81/81 | Guided Path, keyboard, widths, emulated touch, offline |

Before the version assertions were updated, the unchanged suites failed only those two version checks against this build. Every other check passed.

Screenshots: `guided-desktop-1360.png` (light), `guided-desktop-dark-1360.png` (dark) and `guided-320.png` (full page at 320 px).

Reproduce:

```
NODE_PATH=<playwright install> node tests/browser_guided.js index.html <screenshot-dir>
```
