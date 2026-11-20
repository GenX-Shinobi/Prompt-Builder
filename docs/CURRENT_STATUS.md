# Current Status

> Dated handoff snapshot. Re-check GitHub and local workspaces before acting; this file is not a live connection.

**Last checked:** 2026-11-20  
**Repository:** https://github.com/GenX-Shinobi/Prompt-Builder  
**Default branch:** `main`  
**Project docs branch:** `docs/project-control-baseline`  
**Release branch:** `release/v5.4.0`  
**Product owner:** repository owner

## Verified GitHub state (checked 2026-11-20)

| Ref | Commit | Position |
|---|---|---|
| `main` | `b247aec8a1ee279b71f6aedd8fbaf4d908c22d5f` | Merge commit of PR #2 (contains `ce1ec19`). Unchanged. |
| `release/v5.4.0` | `023171dc60af78d43081a447d41009f153d82127` | 4 ahead / 1 behind `main`; local and remote heads matched; clean tree; everything pushed. |
| `docs/project-control-baseline` | `7e6c65e` (before this checkpoint's commit; see `git log`) | Draft PR #1, open and unmerged; head advances with docs commits only. |

- **Why the release branch diverges:** PR #2 was merged at `ce1ec19`. Four more commits were then pushed to the release branch: `419b51f`, `5c41741`, `52bcdea`, `023171d`. `main` holds only the merge commit `b247aec` that the release branch lacks. No merge, rebase or cherry-pick has been done.
- PR #2 is closed and merged. **That merge is not release approval.**
- PR #1 (https://github.com/GenX-Shinobi/Prompt-Builder/pull/1) is open/draft, unmerged, no reviews. Do not merge without explicit owner approval.
- No GitHub Actions or CI results exist for any commit.
- This documentation lives only on the docs branch. `release/v5.4.0` and `main` do not contain these files.
- `readme.md`: **reconciled on this branch, not yet merged** — see "README reconciliation" below.

## README reconciliation (prepared, not merged)

- **Why they conflicted:** `main`/release and this branch edited the same lines of `readme.md` after common ancestor `2774483` (`2606885`, `ce1ec19` for v5.4.0; `5ff33b3` for v5.3.1). No filename or case problem exists. PR #1 changes only documentation files and `readme.md` (never `index.html`), so `readme.md` is the only conflict (GitHub reports PR #1 `mergeable=false, dirty`).
- **What was done:** `readme.md` on this branch now describes the current v5.4.0 app, keeps the free-first, chatbot-independent, zero-dependency principles, labels budgets as estimates, shows chatbot "best for" text and budgets copied from `catalog.json` revision 1, separates current features from roadmap ideas, links the management documents, and says v5.4.0 is in acceptance testing and not formally released. Behaviour claims were checked against the release `index.html`; it corrects older wording (only a v5.2.0 GitHub Release exists; the app has Step 0 to Step 2 plus a separate Saved presets section).
- **Not resolved:** the file still conflicts with `main`'s `readme.md`. When the owner approves merging PR #1, keep the PR's `readme.md` in full. It also describes behaviour that is only in `release/v5.4.0` (for example the 500-item install gate), so merge it **after** the release code is in `main`.
- **Unverified:** whether the live GitHub Pages site serves `main` and which build it runs. The README's live link is unchanged.

## Release-readiness audit (2026-11-20)

| Check | Result | Category |
|---|---|---|
| Heads | `main` `b247aec`; `release/v5.4.0` `023171d`; docs `7e6c65e` before this checkpoint; all matched live GitHub | Verified |
| PR #1 / PR #2 | #1 open, draft, unmerged, no reviews (`mergeable=false`, README only); #2 merged earlier | Verified |
| Release code vs evidence | `023171d` is identical to the commit the logs were run on; `catalog.json` unchanged since `2606885` | Verified |
| Test logs | Committed logs show exit 0 and 49 / 18 / 111 passed, 0 failed (178 total) | Claude-reported (implementer's own run) |
| Kit | Six tests, six catalogues, built from release `catalog.json` (rev 1, 9 bots, 81 commands); self-check re-run after a pause: 36 passed, 0 failed | Claude-reported |
| Suites re-run in this task | No (code unchanged). Only the kit self-check was repeated. | n/a |
| Independent reproduction | None | Outstanding |
| Owner acceptance | Not done | Outstanding |

## v5.4.0 source and catalogue

- `index.html` declares version 5.4.0. No version-log entry was added for the three post-merge commits (version unchanged).
- `catalog.json` matches the embedded catalogue: 9 chatbots, 81 commands, revision 1.
- The three documented Playwright suites are:
  - `node tests/browser_suite_1.js`
  - `node tests/browser_suite_2.js`
  - `node tests/browser_corrective.js`

## Catalogue diff implementation (release branch)

- `419b51f` — every changed field shows a before → after preview (driven by the shared `CATALOG_FIELDS`); long values open to full Before/After; over 500 changes the review says "Showing 500 of N", the total counts the whole diff, and Install stays disabled until "Show all".
- `5c41741` — added/removed commands carry a complete expandable record; added/removed chatbots show card fields and notes, with each of their commands as its own record. Values are HTML-escaped.
- `52bcdea` — adds seven UI-interaction checks (section A4 of `tests/browser_corrective.js`): records start closed and hidden, open by mouse click or Enter on the summary, show every field, keep hostile markup as literal text, and respect the 500-item gate. Claude also ran the new tests against deliberately broken copies and they failed as intended.
- `023171d` — adds section A5 (test-only, no production change): driven by `CATALOG_FIELDS`, checks every command field and every chatbot field, chatbot notes and every command of an added/removed chatbot for exact on-screen values; records start collapsed with values hidden; mouse, Enter, Space and Tab/Shift+Tab; hostile markup stays literal text; the 500-item gate against forced click, Enter, Space and a direct call, then a real install after "Show all". Claude ran 8 deliberate code mutations against it and every one was detected (one by crashing the suite rather than a clean FAIL line). No defect was found.

## Test evidence

| Category | Result | Status |
|---|---|---|
| Earlier run at `5c41741` | 49 + 18 + 93 = 160 passed | **Claude-reported**, superseded |
| Intermediate run at `52bcdea` | 49 + 18 + 100 = 167 passed | **Claude-reported**, superseded |
| **Current** run at `023171d` | 49 + 18 + 111 = **178** passed, 0 failed, exit code 0 for all three | **Claude-reported.** Fresh clone of the release branch, clean tree. Node v22.23.5, Playwright 1.63.0, headless Chromium 157.0.8103.78, Linux. Raw logs: [docs/test-evidence/v5.4.0-023171d/](test-evidence/v5.4.0-023171d/). |
| Acceptance-kit self-check | 36 passed, 0 failed | **Claude-reported.** Claude acting as the owner against the real release app. Same folder. |
| Independently reproduced | **None** | ChatGPT has not run Playwright here; the owner has not run the suites; no CI. |

Do not describe any of these figures as independently verified. A fresh Claude session or a fresh clone is still the implementer.

## Product-owner browser check completed (limited preview only)

The owner opened the release-branch `index.html` locally with a separate copy of `catalog.json`, appended `[TEST ONLY]` to the ChatGPT card summary, saw the before/after wording preview, and clicked Cancel. Nothing was installed. This confirms only a simple wording-change preview. It does **not** cover added/removed records, expansion/collapse, keyboard interaction or the large-diff safeguards.

## Owner acceptance kit (ready, not yet used)

- **Open:** [acceptance-kit.html](https://github.com/GenX-Shinobi/Prompt-Builder/blob/docs/project-control-baseline/docs/acceptance/v5.4.0/acceptance-kit.html) — download it with "Download raw file", then double-click.
- **How it works:** the app's catalogue import is paste-only, so the kit has a Copy button per test. The owner downloads the real release `index.html`, copies a test, pastes it into Dev Bay → Import catalog, compares the preview with the "You should see" list, and presses Cancel. Nothing is installed.
- **Tests:** (1) add one command, remove another; (2) add a chatbot; (3) remove a chatbot; (4) a 631-change catalogue over the 500 limit; (5) booby-trapped text; (6) a broken catalogue that must be refused. Each has Pass/Fail rules, and a "Copy my results" button gives a short report to paste back.
- **Files:** `docs/acceptance/v5.4.0/` (`acceptance-kit.html`, `catalogs/*.json`, `build_kit.js`, `verify_kit.js`, `README.md`). Built from the release's own `catalog.json` (revision 1, 9 chatbots, 81 commands) so the catalogues are valid for this release.
- **Limitation:** touch use, screen readers and real mobile browsers are not covered by Claude's checks. The kit asks the owner only for an optional narrow-window repeat of Test 1.

## Current position and next action

**Do not release v5.4.0 yet.** There is no open Claude implementation task.

**Single next action:** the owner runs the acceptance kit in a real browser (about 15 minutes) and pastes the "Copy my results" summary back to ChatGPT. ChatGPT's independent review of `release/v5.4.0` at `023171d` can run alongside and does not block it.

## Remaining release gates

1. ~~Interactive added/removed record details and three-suite execution~~ — **done, Claude-reported only.**
2. Independent review of `023171d` and its evidence (ideally with the suites re-run and output recorded by someone other than the implementer).
3. Owner real-browser acceptance with the kit above, on desktop and mobile where practical.
4. README: **prepared on the docs branch**; apply at PR #1 merge (keep the PR's file) and only after the release code is in `main`. Awaiting owner or ChatGPT review.
5. Obtain explicit owner release approval.

No v5.5.0 implementation before v5.4.0 has passed these gates. Release restrictions are listed in [PROJECT_CONTROL.md](../PROJECT_CONTROL.md).

## Checkpoint log

- 2026-11-20 — Documentation reconciled to release head `52bcdea`; test record split into reported versus independently reproduced; continuity protocol added to `PROJECT_CONTROL.md`. Documentation-only.
- 2026-11-20 — README reconciled on the docs branch (not merged); release-readiness audit recorded; owner decisions listed in `PROJECT_CONTROL.md`. Documentation only.
- 2026-11-20 — Release head advanced to `023171d` (test-only A5 coverage). Fresh-clone run of all three suites: 178 passed, raw logs saved. Owner acceptance kit built and self-verified. No production code, `main` or PR changes.
