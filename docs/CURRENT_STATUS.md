# Current Status

## POST-RELEASE VERIFIED STATUS — 2026-11-21 (supersedes earlier status sections)

| Item | Verified result |
|---|---|
| v5.4.0 GitHub Release | **Published**, stable, not draft: https://github.com/GenX-Shinobi/Prompt-Builder/releases/tag/v5.4.0 |
| v5.4.0 tag | `97531983b26b7e00be78a8200284d7897a97b864` |
| main | `97531983b26b7e00be78a8200284d7897a97b864` at verification |
| Application blob | `index.html` = `856fb513eb242d8bf704d96a829f924217b3bc95` (unchanged) |
| Documentation | PR #4 and PR #1 merged; README and authentic `Preview.jpg` on main |
| CI / owner acceptance | 187 Chromium/Playwright checks passed; six owner desktop acceptance tests passed |
| Explicitly accepted limitations | No real mobile/touch, Firefox/Safari, screen reader, or manual contrast test |
| Cosmetic issues | Header overlap ≤600px, unstyled chatbot note; no separate in-file log entry for final button correction |
| Release notes polish | Online-app URL has nested/double-bracket Markdown; can correct in a separately authorized docs task |
| Additional release attachments | None; GitHub provides automatic source archives |
| New implementation | None authorized; CHIMERA and v5.5.0 paused pending next-session planning |

This is a post-release documentation checkpoint, not a new application release. Older pending release-gate and PR-status text below is historical and superseded. Any closeout documentation branch requires a separate owner-approved merge.

---


> Dated handoff snapshot. Re-check GitHub and local workspaces before acting; this file is not a live connection.

**Last checked:** 2026-11-21 ~16:50 UTC (after PR #6 merged the v5.4.0 code into `main`)  
**Repository:** https://github.com/GenX-Shinobi/Prompt-Builder  
**Default branch:** `main` (now contains the v5.4.0 code)  
**Project docs branches:** `docs/project-control-baseline` (PR #1) and `docs/chimera-session-maintenance` (PR #4)  
**Release branch:** `release/v5.4.0` (kept; not deleted)  
**Product owner:** repository owner

## Current position — 2026-11-21, after PR #6 (supersedes everything below where they differ)

Labels: **Verified** = checked against live GitHub/Git in this pass by Claude Code. **CI** = GitHub Actions run, not authored by Claude. **Claude-reported** = Claude's own run. **Owner** = Owner decision or test.

### Repository state (Verified)

| Ref / item | Value | Note |
|---|---|---|
| `main` | `fc30269615eff28b31a3772e3b40d5ade2c80aa8` | Merge commit of PR #6 (2026-11-21 16:31:54 UTC), parents `d4ea76f` + `ad459df`. Changed only `index.html` and `tests/browser_corrective.js`. |
| `index.html` on `main` | blob `856fb513…` | Byte-identical to `release/v5.4.0` at `ad459df` and to the CI-tested copy. Declares `currentVersion: "5.4.0"`. |
| `release/v5.4.0` | `ad459df8c014fc01dce893ff5374e4e4d8e2280a` | Unchanged; branch retained as PR #6 requested. |
| PR #6 | Merged | "Integrate verified v5.4.0 corrective release into main". Owner-approved code integration only; its description keeps documentation merges, publication, deployment, tags and GitHub Release separately gated. |
| PR #1 | Open, **draft**, unmerged | `docs/project-control-baseline` at `c114217` → `main`. |
| PR #4 | Open, unmerged | `docs/chimera-session-maintenance` → `docs/project-control-baseline`. Head was `c501c2e` before this pass; see `git log` for the new head. |
| PR #5 | Closed, not merged | Temporary verification PR. Its closing note ("GitHub did not expose a workflow run") is inaccurate: the runs below exist and passed. |
| Tags / GitHub Releases | `v5.2.0` only | No v5.4.0 tag or GitHub Release exists. |
| GitHub Pages | Deployed from `main@fc30269` | The automatic "pages build and deployment" workflow succeeded at 16:31:56 UTC. The live page shows v5.4.0-only features (Start here panel, Dev Bay chatbot catalog). Pages settings cannot be read through Claude's connection. |

**Important consequence (Verified):** because GitHub Pages publishes `main` automatically, merging PR #6 made v5.4.0 the version the public live app serves. No one ran a separate deployment; it happened as a side effect of the approved code merge. The formal release steps (tag, GitHub Release, release announcement) have **not** happened. ChatGPT and the Owner should record whether this is acceptable or whether the "publish/deploy" gate needs restating.

### Test evidence (current)

| Evidence | Result | Label |
|---|---|---|
| GitHub Actions workflow `v5.4.0-independent-verification.yml`, branch `verify/v5.4.0-independent-playwright`, runs [44922456009](https://github.com/GenX-Shinobi/Prompt-Builder/actions/runs/44922456009), [44922499783](https://github.com/GenX-Shinobi/Prompt-Builder/actions/runs/44922499783), [44922527496](https://github.com/GenX-Shinobi/Prompt-Builder/actions/runs/44922527496), [44922534308](https://github.com/GenX-Shinobi/Prompt-Builder/actions/runs/44922534308) | All three suites passed in every run: 49 + 18 + 120 = **187 passed, 0 failed**, exit 0. Two runs show "failure" only because the later evidence-saving step lost a push race; the test step passed in all four (Verified from job step results). | **CI** — accepted by the Owner as the independent verification cited in PR #6 (runs 44922456009 and 44922527496). ChatGPT to confirm the label in its review. |
| What CI tested | `index.html`, `tests/browser_suite_1.js`, `tests/browser_suite_2.js`, `tests/browser_corrective.js` on the verify branch are byte-identical to `ad459df` and to `main@fc30269` (Verified by blob comparison). | Verified |
| Environment | ubuntu-latest, Node v22.23.5, npm 10.9.9, Playwright 1.63.0, Chromium `chromium-1243` | CI |
| Claude fresh-checkout run of `ad459df` | 187 passed, 0 failed | Claude-reported |
| Automated responsive / offline / downloaded-file / basic accessibility probes | Pass in headless Chromium; pre-existing header overlap at ≤600 px | Claude-reported |
| Owner browser acceptance | Six of six PASS (2026-11-20) | Owner |
| Raw logs and probe output | Branch `evidence/v5.4.0-ad459df-verification` at `2d22048`, folder `docs/test-evidence/v5.4.0-ad459df/`. No PR; not part of PR #4. | Verified location |

No CI run has been made on the `main` merge commit itself; the only workflow on `main` is the Pages deployment. Because the tested files are byte-identical, this is a record-keeping note, not a gap in coverage.

### README preview image (resolved on PR #4)

- `Preview.jpg` on PR #4 (blob `f59e5837…`, 1440 × 3982, JPEG) was produced by GitHub Actions run 44922527496: Playwright opened `index.html` (blob `856fb513…`, the v5.4.0 code now on `main`) in a fresh browser with no saved data, 1440 × 1000 viewport, waited one second and took a full-page capture. The bot then committed it to PR #4 as `c501c2e`.
- Claude Code re-checked it in this pass: inspected every section of the image, and made a fresh capture of `main`'s `index.html` the same way. Both show the same first-open screen in the same order: header with Default/Layout/Theme, Start here panel open, nine chatbot cards with ChatGPT selected, Bot Commands for ChatGPT, empty core prompt, Saved presets, Dev Bay with the chatbot catalog section. No console errors, no network requests, no dialogs. The only difference is page height (3982 vs 4099 px) from font fallback between machines.
- **Conclusion (Verified):** the PR #4 image is a genuine, unstaged capture of v5.4.0 in its default first-open state on a desktop browser. It does not show mobile layout or dark theme.
- The README already embeds `Preview.jpg`; its alt text and caption now describe it. `main` still shows the old image (blob `03cdbe8…`, uploaded 2026-11-19) until PR #4 and then PR #1 are merged.
- `docs/v5.4.0-preview-capture` (`90c4887`) holds a second genuine capture made by Claude. PR #6 did not include it, so the PR #4 route has been taken. That branch is now redundant; retire it with Owner approval so the two images cannot conflict later.

### Mergeability (simulated with `git merge-tree`; nothing merged)

| Merge | Position | Result |
|---|---|---|
| PR #4 → `docs/project-control-baseline` | 22 ahead, 0 behind after this pass | **Clean fast-forward.** Documentation files and `Preview.jpg` only. |
| PR #1 → `main` (today) | 53 ahead, 12 behind; common ancestor `09d6060` | **One conflict: `readme.md`.** Every application file in the merged result stays exactly as on `main` (`index.html`, `catalog.json`, `tests/*`, `contributing.md`). |
| PR #1 → `main` after PR #4 lands | same | Same single `readme.md` conflict; `Preview.jpg` comes in cleanly as the new image. |

GitHub's own mergeability flags for PR #1 and PR #4 read "unknown" at check time (GitHub had not recomputed them); the simulation above is the reliable result. The conflict-resolution plan is in `SESSION_HANDOFF.md`.

### Remaining release gates (current)

| Gate (ROADMAP) | Status |
|---|---|
| Automated output recorded | **Met** — CI logs and Claude logs saved |
| Independent reproduction | **Met via CI**; Owner relied on it for PR #6. ChatGPT to confirm the label |
| Offline / downloaded file | **Met (automated, headless Chromium)** — Claude-reported |
| Desktop and mobile browser acceptance | **Partly met** — Owner desktop acceptance done; automated widths 320–1920 px pass; real phones/tablets, touch, Firefox and Safari not done |
| Accessibility | Basic automated checks pass; screen reader and manual contrast audit not done |
| README and status accurate on `main` | **Not met yet** — corrected README is on PR #4/PR #1, not on `main` |
| Version history consistent | Open — no version-log entry for the post-merge corrective commits (version unchanged at 5.4.0); ChatGPT/Owner to decide whether one is needed |
| Known limitations disclosed | Partly — README now lists outstanding checks; pre-existing cosmetic items are in the evidence README |
| Owner explicit release approval | **Pending** |

### Pending Owner decisions

1. Accept that the live site already serves v5.4.0 (side effect of PR #6), or restate the publication gate.
2. Approve merging PR #4 into `docs/project-control-baseline`.
3. Approve resolving PR #1's `readme.md` conflict (keep the PR's version), marking PR #1 ready for review, and merging it into `main`.
4. Formal v5.4.0 release approval, then the tag and GitHub Release.
5. Branch housekeeping: retire `verify/v5.4.0-independent-playwright` (its workflow can push to the PR #4 branch), `docs/v5.4.0-preview-capture`, `fix/v5.4.0-test4-install-button-state`; decide whether `evidence/v5.4.0-ad459df-verification` should be merged or kept as a reference branch.

**Single next action:** ChatGPT reviews this checkpoint and puts decisions 1–3 to the Owner as one plain-English approval. No merge, tag, release or v5.5.0/CHIMERA work until then.

## Historical: verified GitHub state (checked 2026-11-20) — superseded by the section above

| Ref | Commit | Position |
|---|---|---|
| `main` | `d4ea76f1e3b896f8494529295e2e75d049cbfc93` | Two recovery commits briefly added then removed `docs/CLAUDE_TASK.md`; live compare shows no net file diff from prior head `b247aec`. |
| `release/v5.4.0` | `ad459df8c014fc01dce893ff5374e4e4d8e2280a` | Test 4 correction merged via PR #3; still separate from `main`. |
| `docs/project-control-baseline` | `64b6dd3e142a9326e22c697aab45775e125fca74` before this maintenance | Draft PR #1, open and unmerged; this maintenance adds documentation-only commits. |

- **Why the release branch diverges:** PR #2 was merged at `ce1ec19`. Four more commits were then pushed to the release branch: `419b51f`, `5c41741`, `52bcdea`, `023171d`. `main` holds merge commit `b247aec`; the release branch intentionally remains separate and diverged. No merge into `main`, rebase or cherry-pick has been done.
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
| Heads | `main` `d4ea76f`; `release/v5.4.0` `ad459df`; docs branch updated separately | Verified |
| PR #1 / PR #2 | #1 open, draft, unmerged, no reviews (`mergeable=false`, README only); #2 merged earlier | Verified |
| Release code vs evidence | `ad459df` includes corrective source commit `0bdeb962`; `catalog.json` unchanged since `2606885` | Verified |
| Test logs | Baseline `023171d`: 178 passed; corrective branch `0bdeb962`: 49 + 18 + 120 = 187 passed, 0 failed | Claude-reported (implementer's own run) |
| Kit | Six tests, six catalogues, built from release `catalog.json` (rev 1, 9 bots, 81 commands); self-check re-run after a pause: 36 passed, 0 failed | Claude-reported |
| Suites re-run in this task | No (code unchanged). Only the kit self-check was repeated. | n/a |
| Independent reproduction | None | Outstanding |
| Owner acceptance | All six tests PASS; Test 4 repeated with correct corrective-branch file and original package | Owner-verified |

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

## Product-owner browser acceptance — completed 2026-11-20

**Final owner result: all six tests PASS.** The earlier Test 4 failure was caused by the owner initially downloading the wrong `index.html` and entering that result in the wrong field. The owner corrected the record, downloaded the correct `index.html` from `fix/v5.4.0-test4-install-button-state`, repeated only Test 4 using the original Test 4 package, and then updated all six result fields.

| Test | Final result | Evidence / note |
|---|---|---|
| 1. Add one command and remove another | **Pass** | Original owner pass retained |
| 2. Add a whole chatbot | **Pass** | Original owner pass retained |
| 3. Remove a whole chatbot (Mistral) | **Pass** | Original owner pass retained |
| 4. Large change (631 buttons) | **Pass** | Repeated with the correct corrective-branch `index.html` and original Test 4 package |
| 5. Booby-trapped text | **Pass** | Original owner pass retained; content remained plain text |
| 6. Broken catalogue | **Pass** | Original owner pass retained; invalid catalogue refused |

Optional narrow-window repeat of Test 1: **Pass**. Browser/device details were not recorded. The owner did not report performing the install action; do not claim owner verification of an actual installation. Claude's disposable-profile install test remains implementer-reported.

The final owner acceptance record supersedes all earlier references in this document to Test 4 being failed.

## Owner acceptance kit (used; results recorded above)

- **Open:** [acceptance-kit.html](https://github.com/GenX-Shinobi/Prompt-Builder/blob/docs/project-control-baseline/docs/acceptance/v5.4.0/acceptance-kit.html) — download it with "Download raw file", then double-click.
- **How it works:** the app's catalogue import is paste-only, so the kit has a Copy button per test. The owner downloads the real release `index.html`, copies a test, pastes it into Dev Bay → Import catalog, compares the preview with the "You should see" list, and presses Cancel. Nothing is installed.
- **Tests:** (1) add one command, remove another; (2) add a chatbot; (3) remove a chatbot; (4) a 631-change catalogue over the 500 limit; (5) booby-trapped text; (6) a broken catalogue that must be refused. Each has Pass/Fail rules, and a "Copy my results" button gives a short report to paste back.
- **Files:** `docs/acceptance/v5.4.0/` (`acceptance-kit.html`, `catalogs/*.json`, `build_kit.js`, `verify_kit.js`, `README.md`). Built from the release's own `catalog.json` (revision 1, 9 chatbots, 81 commands) so the catalogues are valid for this release.
- **Limitation:** touch use, screen readers and real mobile browsers are not covered by Claude's checks. The kit asks the owner only for an optional narrow-window repeat of Test 1.

## Current position and next action

**All six owner acceptance tests pass.** The focused Test 4 correction is committed as `0bdeb9622d2a0a5a1ad49d48711aa8c768cf7478` on `fix/v5.4.0-test4-install-button-state`.

**PR #3 is merged** from `fix/v5.4.0-test4-install-button-state` into `release/v5.4.0`: https://github.com/GenX-Shinobi/Prompt-Builder/pull/3. GitHub created merge commit `ad459df8c014fc01dce893ff5374e4e4d8e2280a`; the release branch now includes corrective commit `0bdeb962`. `main` remains unchanged.

**v5.4.0 is not release-approved.** The corrective commit is now integrated into `release/v5.4.0`. No change has been made to `main`, and no release/deployment/tag has been created.

**Single next action:** complete the remaining v5.4.0 release-readiness checks, beginning with independent reproduction of the automated suites. No publication or release is authorized.

## Remaining release gates (as of 2026-11-20 — superseded by the 2026-11-21 gate table at the top)

1. ~~Interactive added/removed record details and three-suite execution~~ — Claude-reported at `023171d`: 178 passed, 0 failed; not independently reproduced.
2. ~~Owner browser acceptance~~ — **all six tests PASS**, including Test 4 repeated with the correct corrective-branch file and original package.
3. ~~Implement focused Test 4 correction~~ — commit `0bdeb962` on the dedicated corrective branch; Claude reports 49 + 18 + 120 = **187** automated checks passed, 0 failed, in both worktree and fresh clone. These are implementer-reported.
4. ~~Create reviewable integration proposal~~ — PR #3 merged into `release/v5.4.0` at `ad459df8`; `main` unchanged.
5. Independently reproduce automated suites where feasible.
6. ~~Resolve PR #3 mergeability and obtain explicit owner approval before merging into `release/v5.4.0`~~ — completed; PR #3 was merged into `release/v5.4.0` at `ad459df8c014fc01dce893ff5374e4e4d8e2280a` with Owner authorization.
7. README: prepared on docs branch; apply at PR #1 merge only after approved release code reaches `main`.
8. Obtain separate explicit owner release approval.

No v5.5.0 implementation before v5.4.0 has passed these gates. Release restrictions are listed in [PROJECT_CONTROL.md](../PROJECT_CONTROL.md).

## Checkpoint log

- 2026-11-20 — Documentation reconciled to release head `52bcdea`; test record split into reported versus independently reproduced; continuity protocol added to `PROJECT_CONTROL.md`. Documentation-only.
- 2026-11-20 — README reconciled on the docs branch (not merged); release-readiness audit recorded; owner decisions listed in `PROJECT_CONTROL.md`. Documentation only.
- 2026-11-20 — Release head advanced to `023171d` (test-only A5 coverage). Fresh-clone run of all three suites: 178 passed, raw logs saved. Owner acceptance kit built and self-verified. No production code, `main` or PR changes.
- 2026-11-21 — PR #6 merged v5.4.0 code into `main` (`fc30269`); Pages redeployed automatically. Claude Code (documentation closeout, Owner-assigned) recorded CI verification, validated the PR #4 preview image, updated README status text and simulated PR #4/PR #1 merges. Documentation-only commit on PR #4; nothing merged, tagged or released. See the top section.


## Latest documentation checkpoint — 2026-11-20

Live GitHub verified after PR #3 merge:
- `main`: `d4ea76f1e3b896f8494529295e2e75d049cbfc93` (two recovery commits; no net file diff from prior head `b247aec`)
- `release/v5.4.0`: `ad459df8c014fc01dce893ff5374e4e4d8e2280a`
- Corrective source commit: `0bdeb9622d2a0a5a1ad49d48711aa8c768cf7478`
- PR #3: merged into `release/v5.4.0`; merge commit `ad459df8c014fc01dce893ff5374e4e4d8e2280a`.
- PR #1 remains open/unmerged.
- `docs/project-control-baseline` contains the management-document updates; these documents remain outside `main` and `release/v5.4.0`.

Owner acceptance: all six browser tests PASS after the owner corrected the Test 4 file selection and repeated only Test 4 with the original package. Claude's 187 automated passes on the corrective branch remain implementer-reported. No independent suite reproduction has been completed.

PR #3 was merged into the release branch with owner authorization. During documentation maintenance, `docs/CLAUDE_TASK.md` was accidentally added to `main` and then deleted; live compare shows no net file diff from the prior `main` head. No application source changes were made on `main`. No formal release, deployment, or tag was created.
## Latest maintenance checkpoint — 2026-11-21

This section supersedes earlier branch-head snapshots above; older checkpoint entries remain as history.

**Live repository observations at start of this documentation pass:**

| Ref | Commit | Status |
|---|---|---|
| main | d4ea76f1e3b896f8494529295e2e75d049cbfc93 | Default branch; no changes made in this pass |
| release/v5.4.0 | ad459df8c014fc01dce893ff5374e4e4d8e2280a | PR #3 correction integrated; release still not approved |
| docs/project-control-baseline | c114217903d72099c11f301eea22d2b9747b1b6c | Existing documentation baseline and open PR #1 |
| ops/claude-agent-pilot | 61f045a96b5b0d0683e378bbca1c9b89f01e39c9 | Existing branch; not modified |

- PR #1 remains open/unmerged. PR #3 is closed and merged into release/v5.4.0 at ad459df8c014fc01dce893ff5374e4e4d8e2280a.
- GitHub reported push permission for the connected account. Dedicated branch docs/chimera-session-maintenance contains this documentation pass; PR #4 is open against docs/project-control-baseline. No default or release branch is targeted.
- The latest documented corrective test results remain Claude-reported: 49 + 18 + 120 = 187 passed, 0 failed. They have not been independently reproduced in this session.
- Owner browser acceptance remains six of six PASS, as recorded above. Do not infer owner installation testing.
- The actual Claude local workspace was not inspected in this pass. Its current branch/worktree and any unpushed changes remain to be verified before assigning or resuming engineering work.
- CHIMERA is a separate initiative; see CHIMERA_RELATIONSHIP.md. Its existence does not alter Prompt Builder release gates.

**Current release status:** v5.4.0 remains unapproved. Independent reproduction and remaining cross-browser/mobile/accessibility/offline checks remain outstanding as recorded in the release checklist and roadmap.

**Single next action:** verify the actual Claude workspace and arrange an independent run of the three documented Playwright suites against the current release branch. Do not merge, publish, deploy, tag or release.


## Latest maintenance checkpoint — 2026-11-21 (session closeout)

- Prompt Builder documentation PR #4 is open and targets `docs/project-control-baseline`; it remains documentation-only. Live compare: 16 commits ahead, 0 behind at the start of this closeout; after the handoff update, verify its current head before acting.
- PR #1 remains open/unmerged. PR #3 remains merged into `release/v5.4.0`. Neither documentation PR is authorized to merge.
- The actual Claude local workspace was not accessible or inspected in this session. Do not claim its branch, working-tree or unpushed state is known.
- The three documented Playwright suites were not independently run in this session. Container network access could not resolve GitHub, and the local Claude workspace was unavailable. Historical 187-pass results remain Claude-reported, not independently reproduced.
- README visual: `readme.md` embeds `Preview.jpg`. GitHub confirms the image blob is unchanged between `main` and the maintenance branch (SHA `03cdbe8a14a4cadf7b215895e2b724c68154e71c`). The README preview is the stale asset; no separate social-preview setting has been verified. A genuine screenshot from the current v5.4.0 build is still required. Do not replace it with generated mock artwork.
- Approved sequence: finish documentation/presentation maintenance; complete v5.4.0 closeout and explicit release approval; publish v5.4.0; only then resume CHIMERA and later consider accumulated Prompt Builder roadmap work as bounded CHIMERA test material.

**Current release status:** v5.4.0 remains not publicly released and not release-approved. No application code, `main`, release branch, merge, tag, deployment or publication was changed in this maintenance pass.

**Single next action:** resume Prompt Builder v5.4.0 closeout by verifying the actual Claude workspace and arranging independent execution of all three Playwright suites; capture the README preview from the verified current build. Do not merge or release.
