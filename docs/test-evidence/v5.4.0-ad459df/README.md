# v5.4.0 verification evidence — `release/v5.4.0` at `ad459df`

**Recorded:** 2026-11-21 by Claude Code (Engineering Lead), session `session_014R2sy7cFa7q9ygpz8yumT3`.
**Target:** `release/v5.4.0` = `ad459df8c014fc01dce893ff5374e4e4d8e2280a` (unchanged during this work).
**Scope:** read-only verification. No application code, tests, `main` or `release/v5.4.0` were changed.

## 1. Evidence categories (keep separate)

| # | What | Who ran it | Result | Category |
|---|---|---|---|---|
| A | GitHub Actions workflow `v5.4.0-independent-verification.yml` on `verify/v5.4.0-independent-playwright` (4 runs) | GitHub-hosted runner; workflow committed by the `GenX-Shinobi` account, not by Claude | 49 + 18 + 120 = **187 passed, 0 failed, all exit 0, in all four runs** | **Independent of Claude** (CI). Claude only downloaded and checked the logs. ChatGPT to confirm the label. |
| B | Fresh isolated checkout of `ad459df`, all three suites | Claude Code (this session) | 49 + 18 + 120 = **187 passed, 0 failed, all exit 0** | **Claude-reported** (a fresh Claude session is still the implementer) |
| C | Responsive / accessibility / offline / downloaded-file probes | Claude Code (this session) | See section 4 | Claude-reported, automated, headless Chromium only |

The 187 test names in A (run 44922527496) and B are **identical** (sorted PASS lines compared; 0 differences).

## 2. Run B — Claude local run

Commands, run from the checkout root with a clean tree before and after (`git status --porcelain` empty):

```
node tests/browser_suite_1.js     # exit 0 — 49 passed, 0 failed (15 s)
node tests/browser_suite_2.js     # exit 0 — 18 passed, 0 failed (15 s)
node tests/browser_corrective.js  # exit 0 — 120 passed, 0 failed (53 s)
```

Environment (`environment.txt`): Linux 6.18 x86_64, Node v22.23.5, npm 10.9.9, Playwright 1.63.0 (preinstalled, `NODE_PATH=/opt/npm-tools/node_modules`), headless Chromium 157.0.8103.78 (`chromium-1243`). Checkout created by `git init` + `git fetch` of the release ref, then `git checkout` of `ad459df`.

Files: `exit-codes.txt`, `browser_suite_1.log`, `browser_suite_2.log`, `browser_corrective.log`, `environment.txt`.

## 3. Run A — GitHub Actions (verify branch)

Branch `verify/v5.4.0-independent-playwright` = `ad459df` + 4 commits that add only the workflow, `verification-result.txt` and `Preview.jpg`. `index.html`, `catalog.json` and `tests/` are byte-identical to `ad459df`, so these runs test the release code.

| Run | Event | Commit tested | Suites | Job conclusion | Why |
|---|---|---|---|---|---|
| [44922456009](https://github.com/GenX-Shinobi/Prompt-Builder/actions/runs/44922456009) | push | `76e30d9` | 49/18/120, exit 0 | success | First version had no evidence-push step |
| [44922499783](https://github.com/GenX-Shinobi/Prompt-Builder/actions/runs/44922499783) | push | `e4d6bb4` | 49/18/120, exit 0 | failure | Evidence push rejected (`fetch first`) — branch moved under it. **Not a test failure.** |
| [44922527496](https://github.com/GenX-Shinobi/Prompt-Builder/actions/runs/44922527496) | push | `ef48b38` | 49/18/120, exit 0 | success | Wrote `cb177ef` (verification-result.txt, Preview.jpg) and pushed `c501c2e` to `docs/chimera-session-maintenance` |
| [44922534308](https://github.com/GenX-Shinobi/Prompt-Builder/actions/runs/44922534308) | pull_request (PR #5) | merge `d780326` = `ef48b38` into `ad459df` | 49/18/120, exit 0 | failure | Same evidence-push race. **Not a test failure.** |

Runner environment: ubuntu-latest, Node v22.23.5, npm 10.9.9, Playwright 1.63.0, Chromium `chromium-1243`. Job logs (ANSI stripped) are in `ci-job-logs/`; GitHub keeps the uploaded artifacts for 14 days only.

**Corrections to the record:**
- PR #5's closing note says "GitHub did not expose a workflow run … so no independent tests or screenshot are claimed". The runs above did execute and pass. The note is inaccurate.
- The workflow has `contents: write` and **pushed a commit to `docs/chimera-session-maintenance` (PR #4's head, `c501c2e`, author `github-actions[bot]`)** replacing `Preview.jpg`. PR #4 is therefore no longer text-only.

## 4. Release-gate probes (run C)

Probes ran against `index.html` copied **alone** into an empty folder and renamed `prompt_builder_v5_4_0.html` (simulates a downloaded file with no `catalog.json` beside it). Scripts are in `probe-scripts/`; output in `gates_isolated_download.json` and `header_overlap.txt`.

| Gate | Result | Notes |
|---|---|---|
| Offline | **Pass (automated)** | Offline browser context with every non-`file:` request aborted: 0 requests attempted, no external script/style/image/iframe references, 0 console/page errors, 9 chatbot choices, typed prompt compiles. Suite 2 also checks "zero network requests" and offline operation. |
| Downloaded file | **Pass (automated)** | Renamed standalone copy loads with no errors. Suite 2 checks "Download clean .html: complete, v5.4.0, no typed text/attachment/preset data". |
| Responsive | **Pass with pre-existing defects** | No horizontal overflow at 320, 375, 414, 768, 1024, 1440, 1920 px. At ≤600 px the header's Palette/Layout/Theme controls overlap the "Prompt Forge · Cheat Sheet" eyebrow text; at 320 px they also overlap the title (`screenshots/mobile_375_header_overlap.jpg`). **Same on `main`** — not introduced by v5.4.0. |
| Accessibility (basic) | **Pass (automated)** | `lang="en"`, one `h1`, 67 visible controls all have accessible names, 0 images without `alt`, `role="tablist"` and `role="radiogroup"` present, first 40 Tab stops all show a focus indicator. Corrective suite A6 covers the Install button's locked/enabled distinction in all 10 palette × mode combinations. 39 visible controls are under 24 px in one dimension (review against WCAG 2.2 target size; some may be exempt inline controls). |
| Cosmetic | Pre-existing | `#botNote` (chatbot note under the cards) has no styling and renders at 16 px, larger than surrounding text (`screenshots/desktop_1440_botnote.jpg`). Unstyled since at least v5.2.0. |

**Not run:** real mobile devices, touch, screen readers, Firefox, Safari, manual colour-contrast audit, owner installation action.

## 5. Preview image

Two genuine captures of `ad459df` exist, both from Playwright 1.63.0 / Chromium 157 at 1440×1000, full page, JPEG q92, default light theme:

| Capture | Where | Blob | Size |
|---|---|---|---|
| CI run 44922527496 | `verify/…` and `docs/chimera-session-maintenance` (`c501c2e`) | `f59e58372626…` | 1440×3982 |
| Claude, this session | `docs/v5.4.0-preview-capture` (`90c4887`, based on `ad459df`, changes only `Preview.jpg`) | `771dfc62036c…` | 1440×4099 |

They differ only because of font fallback between environments (page height). Only **one** should land; see the integration assessment in `docs/handoffs/2026-11-21-claude-v5.4.0-engineering-handoff.md`.
