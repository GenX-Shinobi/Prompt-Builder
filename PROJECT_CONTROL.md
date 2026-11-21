# AI Prompt Builder Hub — Project Control

> Central continuity and decision file. At the start of a new ChatGPT or coding-agent session, read this file and the linked project documents, then verify live GitHub and relevant local workspace state.

**Repository:** https://github.com/GenX-Shinobi/Prompt-Builder  
**Application:** AI Prompt Builder Hub  
**Roles (do not blur them):**
- **Owner** — product owner; final product, merge and release approval.
- **ChatGPT** — project manager and independent reviewer; owns central management documentation, roadmap/status continuity, owner-facing decisions and review of Claude's evidence.
- **Claude Code** — implementation engineer; owns implementation, code-adjacent documentation and technical test evidence for assigned work.
- **Owner** — product owner; approves scope, implementation authorization, merges and releases.

**Last checked:** 2026-11-20 (repository state at the checkpoint below; re-verify before acting)

**Where these documents live:** on the branch `docs/project-control-baseline` (draft PR #1) until the owner approves merging it. They are **not** on `main` or `release/v5.4.0`. Read them with `git fetch origin` then `git show origin/docs/project-control-baseline:<path>`, or check that branch out in a separate worktree. Do not copy them onto other branches.

## Resume phrase

> **Resume AI Prompt Builder Hub — v5.4.0 release closeout.** Read the project-control documents from `docs/project-control-baseline`; verify live GitHub and the actual Claude workspace before acting. Owner acceptance: all six browser acceptance tests PASS, including Test 4 repeated with the correct corrective-branch `index.html` and original test package. Corrective PR #3 has been merged into `release/v5.4.0` at `ad459df8c014fc01dce893ff5374e4e4d8e2280a`. `main` remains unchanged. Do not merge, publish, deploy, tag, modify `main`, merge PR #1, or start v5.5.0 without the owner's separate approval. State one next action.

## Mission and product principles

Build a free-first, chatbot-independent prompt builder that helps nontechnical people turn an everyday goal into a useful prompt and transfer it reliably. Preserve the open-source, accessible, standalone single-file HTML architecture unless the owner explicitly approves a change.

- Free chatbot tiers are the design baseline; paid plans are never a prerequisite.
- Avoid provider lock-in and explain changing capabilities honestly.
- Keep the first-use path understandable to ordinary people.
- Keep the scope centred on prompt building and lightweight context transfer, not a full repository/context-management platform.
- Owner has final say on product direction, merges and releases.

## Verified project state at 2026-11-20

Each item below was checked against live GitHub and the Claude workspace on 2026-11-20 unless marked otherwise.

### Verified facts (repository)

| Ref | Commit at checkpoint | Notes |
|---|---|---|
| `main` | `d4ea76f1e3b896f8494529295e2e75d049cbfc93` | Two recovery commits briefly added then removed `docs/CLAUDE_TASK.md`; current file tree has no net content difference from `b247aec`. Do not describe its commit history as untouched. |
| `release/v5.4.0` | `ad459df8c014fc01dce893ff5374e4e4d8e2280a` | Includes Test 4 corrective commit via PR #3; still not merged into `main`. |
| `docs/project-control-baseline` | `7e6c65e` before this checkpoint's commit (see `git log` for the head) | Draft PR #1, open and unmerged. Its head advances with documentation commits only. |

- The release branch is now "6 ahead, 3 behind" because PR #2 was merged at `ce1ec19` (its merge commit `b247aec` exists only on `main`), and four further commits were then pushed to the release branch: `419b51f`, `5c41741`, `52bcdea` and `023171d`. The Test 4 corrective commit `0bdeb962` was then merged through PR #3 as `ad459df`. The release branch now includes corrective PR #3 (`0bdeb962`, merged as `ad459df8`). The release branch and `main` remain separate. During documentation maintenance, `docs/CLAUDE_TASK.md` was accidentally committed to `main` once and then deleted in a follow-up commit. A live compare confirms the net file diff from the previous `main` head `b247aec` is empty; however, `main` now has two additional history commits. No application source or other files were changed on `main`.
- `023171d` and `52bcdea` change only `tests/browser_corrective.js`; `5c41741` and `419b51f` change `index.html` and `tests/browser_corrective.js`. No production-code defect was found in the final two rounds. No catalogue or `catalog.json` change since PR #2: 9 chatbots, 81 commands, revision 1. v5.4.0 source declares version 5.4.0.
- PR #1 (https://github.com/GenX-Shinobi/Prompt-Builder/pull/1) is open/draft, unmerged, with no reviews. PR #2 is merged. No CI or GitHub Actions results exist for any commit.
- `readme.md` **reconciled on the docs branch** (not merged). **Cause of the conflict:** release/`main` and the docs branch both edited `readme.md` from the common ancestor `2774483` — `main`/release for v5.4.0 (`2606885`, `ce1ec19`), the docs branch for v5.3.1 (`5ff33b3`, which also said the default branch held v5.3.1). It is not a filename or letter-case problem: every branch uses `readme.md` (an old `README.md` was deleted on 2026-11-19). **Fix:** the docs-branch `readme.md` is now one accurate document: the docs branch's principles and project-management links, plus feature content checked against the v5.4.0 app and `catalog.json`; it says v5.4.0 is in acceptance testing and not yet formally released; it separates current features from roadmap ideas; it makes no new chatbot-quota claims (budgets are labelled estimates; only a v5.2.0 GitHub Release exists, and it says so). **Still conflicts with `main` when PR #1 merges**, because both sides changed the file. **Resolution (when the owner approves the merge):** keep the PR's `readme.md` in full. **Order dependency:** it describes `release/v5.4.0` at `ad459df` (for example the 500-item install gate), which `main` does not yet contain (`main`'s `index.html` is the earlier `ce1ec19`). Do not merge PR #1 before the release code is in `main`, or the README will overstate `main`.

### Test evidence — keep these categories separate

| Category | Result | Status |
|---|---|---|
| Earlier Claude-reported run at `5c41741` | 49 + 18 + 93 = **160** passed | Reported by Claude Code; not independently reproduced. Superseded by the next row. |
| Intermediate Claude-reported run at `52bcdea` | 49 + 18 + 100 = **167** passed | Reported by Claude Code; superseded. No raw logs kept. |
| **Current** Claude-reported run at `023171d` | 49 + 18 + 111 = **178** passed, 0 failed, all three exit codes 0 | Run by Claude Code in a **fresh clone** of the release branch with a clean tree (Node v22.23.5, Playwright 1.63.0, headless Chromium 157.0.8103.78). **Raw logs are preserved** in [docs/test-evidence/v5.4.0-023171d/](docs/test-evidence/v5.4.0-023171d/). Still the implementer's own run. |
| Acceptance-kit self-check | 36 passed, 0 failed | Claude acting as the owner against the real release app; log in the same folder. Claude-reported. |
| Independently reproduced results | **None** | Neither ChatGPT nor the owner has re-run the suites; there is no CI. Anyone can reproduce with the three commands in the Regression Checklist. |
| Owner real-browser/device acceptance | **Not done** for added/removed records | See below. |

Claude-reported results must never be described as independently verified. A fresh Claude session or a fresh clone is still Claude. The 178 figure becomes "independently reproduced" only when someone other than the implementer runs the commands and records the output.

### Owner verification — real-browser acceptance (completed 2026-11-20)

The owner completed all six acceptance tests. The first Test 4 attempt used the wrong `index.html` and its result was entered in the wrong field; the owner corrected the record, downloaded the correct `index.html` from the corrective branch, and repeated Test 4 only using the original Test 4 package. The owner then updated the acceptance record for all six tests.

| Test | Final owner result | Notes |
|---|---|---|
| 1. Add/remove command | **Pass** | Original accepted result retained |
| 2. Add a chatbot | **Pass** | Original accepted result retained |
| 3. Remove a chatbot (Mistral) | **Pass** | Original accepted result retained |
| 4. Large catalogue change (631 changes) | **Pass** | Repeated with the correct corrective-branch `index.html` and original Test 4 package |
| 5. Booby-trapped text | **Pass** | Original accepted result retained |
| 6. Broken catalogue | **Pass** | Original accepted result retained |

The owner did not report running the installation action. Do not claim owner verification of an actual install. The separate disposable-profile installation test remains Claude-reported. Browser/device details were not recorded.

An **owner acceptance kit** remains available at [acceptance-kit.html](https://github.com/GenX-Shinobi/Prompt-Builder/blob/docs/project-control-baseline/docs/acceptance/v5.4.0/acceptance-kit.html).

## Strict v5.4.0 release sequence

1. ~~Complete catalogue-diff reviewability and automated coverage~~ — implemented on `release/v5.4.0` through `023171d`; Claude-reported test evidence is recorded separately.
2. ~~Prepare owner acceptance kit~~ — completed on the docs branch.
3. ~~Owner real-browser acceptance~~ — **all six tests PASS**. Test 4 was repeated using the correct corrective-branch `index.html` and original Test 4 package. The corrected owner record supersedes earlier failure entries.
4. ~~Implement and integrate focused Test 4 correction~~ — commit `0bdeb9622d2a0a5a1ad49d48711aa8c768cf7478` on the corrective branch; merged into `release/v5.4.0` through PR #3 as `ad459df8`.
5. ~~Create reviewable integration proposal~~ — PR #3 ([fix: clarify disabled install state for large catalogue reviews](https://github.com/GenX-Shinobi/Prompt-Builder/pull/3)) was merged into `release/v5.4.0` with merge commit `ad459df8c014fc01dce893ff5374e4e4d8e2280a` on 2026-11-20. GitHub confirms the release branch now contains corrective commit `0bdeb962`. `main` remains unchanged.
6. ChatGPT independent reproduction of the automated suites remains outstanding. Claude's automated results must remain labelled implementer-reported.
7. Owner explicitly approves v5.4.0 release only after all release gates pass.

README reconciliation remains prepared on the docs branch and unmerged. Keep the PR's `readme.md` in full when PR #1 is eventually merged, and only after approved release code is on `main`.

### Active task

PR #3 is closed/merged. The active work is release-readiness closeout; independent reproduction of the automated suites and remaining desktop/mobile/offline checks are outstanding.

**Single next action:** arrange an independent run of the three documented Playwright suites against the merged release branch. Do not publish, deploy, tag, merge into `main`, or release without separate owner approval.

### Decisions requiring owner approval

1. How and when the reviewed release branch reaches `main`. The branches have diverged; do not merge/rebase automatically.
2. When to merge PR #1, preserving its reconciled `readme.md` and only after approved release code is on `main`.
3. Formal v5.4.0 release approval.

### Release restrictions (apply to every session)

- Do not modify `main`. Do not merge PR #1 without explicit owner approval. PR #3 is already merged.
- Do not publish, deploy, tag or release.
- Do not start v5.5.0.
- Do not change production code in documentation-only tasks.
- Do not force-push, reset or overwrite unrelated work.

## Other unfinished work

PR #1 is the draft project-control documentation PR. Preserve its work. Its `readme.md` is now the reconciled version (see Verified facts); merging PR #1 is an owner decision and still needs the one-file resolution above, ideally after the release code reaches `main`.

## Working method and authority

- One primary implementation task at a time.
- Inspect GitHub and local workspace before changes; do not rely on stale chat summaries.
- Preserve newer work; never force-push or overwrite unrelated changes.
- Use dedicated branches and small reviewable commits.
- Claude Code implements bounded tasks and reports exact commits, files and test evidence.
- ChatGPT independently reviews important claims and maintains project continuity.
- Never claim tests or browser checks passed unless actually run.
- Do not assign the product owner developer-level fixture creation or repetitive test execution when Claude or automation can safely perform it.
- No direct default-branch changes, merges, PR creation, publishing or release without owner approval.
- Capture extra ideas in [IDEA_INBOX.md](docs/IDEA_INBOX.md); do not expand active scope.
- **Communication preference (owner):** short, digestible sections; one explicit decision prompt at a time; plain English, with technical detail kept out of the way. Lead with what changed and what the owner should do next. Never ask the owner to use a terminal, edit JSON, build fixtures or open developer tools; supply ready-made files and browser-only steps instead.

## Supporting documents

- [Roadmap](ROADMAP.md)
- [Current status](docs/CURRENT_STATUS.md)
- [Claude task](docs/CLAUDE_TASK.md)
- [AI work rules](docs/AI_WORK_RULES.md)
- [Regression checklist](docs/REGRESSION_CHECKLIST.md)
- [Idea inbox](docs/IDEA_INBOX.md)
- [Contributing guide](contributing.md)

## Session Continuity & Context Protection Protocol

Purpose: let a fresh ChatGPT or Claude session resume accurately from the repository alone, without reconstructing a long conversation.

1. **The repository is authoritative.** Documentation and live Git state outrank anyone's recollection of the conversation. If they disagree, trust Git, then fix the document.
2. **Checkpoint at task or phase boundaries**, not after every message. A checkpoint updates `docs/CURRENT_STATUS.md` and, if the task, decisions or next action changed, this file.
3. **Each checkpoint records:** exact branch and commit references; working-tree and push status; the active task and its restrictions; decisions made and who made them; test evidence with its category (verified, Claude-reported, independently reproduced, owner-tested); unresolved issues; and exactly **one** next action.
4. **Label every claim** as one of: verified fact, Claude-reported result, independent review, owner-verified, decision awaiting the owner, or future idea. Never promote a label without new evidence.
5. **Prepare a short resume prompt** before a session becomes unwieldy, or before a long transfer, hand-off or multi-part paste. Keep it to the resume phrase above plus anything that changed since; it points at these documents rather than copying them.
6. **No invisible work.** Never claim background monitoring, automatic updates, scheduled checks or saved memory that has not actually happened. Say what was written, where, and at which commit.
7. **A new session starts by verifying**, not trusting: fetch GitHub, check the actual workspace and working tree, compare with the last checkpoint, report differences, then state the single next action.
8. **Keep it small.** One status file, one control file. Capture new ideas in [IDEA_INBOX.md](docs/IDEA_INBOX.md); do not grow the active task or add documents without need.

Clearly separate source inspection, automated execution, independent review and owner acceptance in every checkpoint.


## Documentation ownership and parallel work

- ChatGPT maintains central project-control records: `PROJECT_CONTROL.md`, `ROADMAP.md`, `docs/CURRENT_STATUS.md`, `docs/IDEA_INBOX.md`, and owner-facing continuity instructions. ChatGPT also prepares/maintains bounded Claude task briefs when the owner authorizes work.
- Claude Code owns implementation details, source-adjacent documentation, version/change logs, raw test evidence and technical reports for assigned work. Claude updates central management documents only when explicitly assigned.
- The owner retains authority over product direction, implementation authorization, branch integration, merges and releases.
- Parallel work is allowed on separate branches and non-overlapping files. During Test 4 correction, Claude uses a new corrective branch from `release/v5.4.0`; management maintenance remains on `docs/project-control-baseline`. Claude must not modify the docs branch.
- The Test 4 corrective implementation branch and PR #3 have been verified on GitHub. Do not claim a fresh local Claude workspace inspection unless it is actually performed.
## Separate initiative boundary — CHIMERA (recorded 2026-11-21)

CHIMERA is a separate public repository and independent project: https://github.com/GenX-Shinobi/CHIMERA

Its mission is to develop a reusable, open-source, free-to-use, platform-independent framework for building, governing and coordinating AI workforces. AI Prompt Builder Hub may become its first adopter only after Prompt Builder v5.4.0 is formally released and the owner separately authorizes a bounded integration milestone.

**Separation rules**
- Keep the repositories, roadmaps, statutes, memory, task queues and release processes separate.
- CHIMERA employees, permissions and memory do not automatically transfer into Prompt Builder.
- Prompt Builder project requirements and release authority do not automatically transfer into CHIMERA.
- Any future integration must be assessed against Prompt Builder's own free-first mission, standalone architecture, scope and project-specific rules.
- CHIMERA planning is not an active Prompt Builder implementation task and does not change v5.4.0 release gates or authorize v5.5.0.

## Maintenance checkpoint — 2026-11-21

Live GitHub access was rechecked. Repository permissions reported by GitHub search include push access for the connected account.

- main: d4ea76f1e3b896f8494529295e2e75d049cbfc93
- release/v5.4.0: ad459df8c014fc01dce893ff5374e4e4d8e2280a
- docs/project-control-baseline: c114217903d72099c11f301eea22d2b9747b1b6c at start of this maintenance pass.
- ops/claude-agent-pilot: 61f045a96b5b0d0683e378bbca1c9b89f01e39c9
- PR #1 remains open and unmerged; PR #3 is closed/merged into release/v5.4.0.
- Documentation maintenance is being prepared on a separate branch, docs/chimera-session-maintenance, based on the project-control branch.

These are repository observations only. The actual Claude local workspace was not inspected in this pass. The release is not approved. Do not merge, tag, publish, deploy, modify main, merge PR #1, or begin v5.5.0 without the owner's separate authorization.
