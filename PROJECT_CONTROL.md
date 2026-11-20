# AI Prompt Builder Hub — Project Control

> Central continuity and decision file. At the start of a new ChatGPT or coding-agent session, read this file and the linked project documents, then verify live GitHub and relevant local workspace state.

**Repository:** https://github.com/GenX-Shinobi/Prompt-Builder  
**Application:** AI Prompt Builder Hub  
**Roles (do not blur them):**
- **Owner** — product owner; final product, merge and release approval.
- **ChatGPT** — project manager and independent reviewer; maintains continuity.
- **Claude Code** — implementation engineer; implements bounded tasks and runs automated tests.

**Last checked:** 2026-11-20 (repository state at the checkpoint below; re-verify before acting)

**Where these documents live:** on the branch `docs/project-control-baseline` (draft PR #1) until the owner approves merging it. They are **not** on `main` or `release/v5.4.0`. Read them with `git fetch origin` then `git show origin/docs/project-control-baseline:<path>`, or check that branch out in a separate worktree. Do not copy them onto other branches.

## Resume phrase

> **Resume AI Prompt Builder Hub — v5.4.0 acceptance.** Read `PROJECT_CONTROL.md`, `docs/CURRENT_STATUS.md`, `ROADMAP.md`, `docs/AI_WORK_RULES.md`, `docs/REGRESSION_CHECKLIST.md` and `docs/CLAUDE_TASK.md` from branch `docs/project-control-baseline`. Check live GitHub and the actual workspace before acting; the repository, not chat memory, is authoritative. The v5.4.0 work is complete on `release/v5.4.0` (head `023171d` at the last checkpoint) with Claude-reported test results only, and a browser-only owner acceptance kit is ready on the docs branch. Do not modify `main`, merge PR #1 or PR #2, publish, or start v5.5.0. State the single next action.

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
| `main` | `b247aec8a1ee279b71f6aedd8fbaf4d908c22d5f` | Merge commit of PR #2. Contains `ce1ec19`; not release approval. Untouched by later work. |
| `release/v5.4.0` | `023171dc60af78d43081a447d41009f153d82127` | 4 commits ahead of and 1 behind `main`. Local and remote heads matched; all commits pushed. |
| `docs/project-control-baseline` | `7e6c65e` before this checkpoint's commit (see `git log` for the head) | Draft PR #1, open and unmerged. Its head advances with documentation commits only. |

- The release branch is "4 ahead, 1 behind" because PR #2 was merged at `ce1ec19` (its merge commit `b247aec` exists only on `main`), and four further commits were then pushed to the release branch: `419b51f` (diff before/after previews and install gate), `5c41741` (complete records for added/removed commands and chatbots), `52bcdea` (seven UI-interaction checks) and `023171d` (schema-wide field, keyboard and install-gate checks). The branches were deliberately not merged or rebased.
- `023171d` and `52bcdea` change only `tests/browser_corrective.js`; `5c41741` and `419b51f` change `index.html` and `tests/browser_corrective.js`. No production-code defect was found in the final two rounds. No catalogue or `catalog.json` change since PR #2: 9 chatbots, 81 commands, revision 1. v5.4.0 source declares version 5.4.0.
- PR #1 (https://github.com/GenX-Shinobi/Prompt-Builder/pull/1) is open/draft, unmerged, with no reviews. PR #2 is merged. No CI or GitHub Actions results exist for any commit.
- `readme.md` **reconciled on the docs branch** (not merged). **Cause of the conflict:** release/`main` and the docs branch both edited `readme.md` from the common ancestor `2774483` — `main`/release for v5.4.0 (`2606885`, `ce1ec19`), the docs branch for v5.3.1 (`5ff33b3`, which also said the default branch held v5.3.1). It is not a filename or letter-case problem: every branch uses `readme.md` (an old `README.md` was deleted on 2026-11-19). **Fix:** the docs-branch `readme.md` is now one accurate document: the docs branch's principles and project-management links, plus feature content checked against the v5.4.0 app and `catalog.json`; it says v5.4.0 is in acceptance testing and not yet formally released; it separates current features from roadmap ideas; it makes no new chatbot-quota claims (budgets are labelled estimates; only a v5.2.0 GitHub Release exists, and it says so). **Still conflicts with `main` when PR #1 merges**, because both sides changed the file. **Resolution (when the owner approves the merge):** keep the PR's `readme.md` in full. **Order dependency:** it describes `release/v5.4.0` at `023171d` (for example the 500-item install gate), which `main` does not yet contain (`main`'s `index.html` is the earlier `ce1ec19`). Do not merge PR #1 before the release code is in `main`, or the README will overstate `main`.

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

### Owner verification so far

The owner previewed one changed ChatGPT card summary in a separate copy and cancelled; nothing was installed. That confirms only the simple wording-change preview. **No claim is made that the owner has tested added/removed records, expansion/collapse, keyboard interaction or the large-diff safeguards.**

An **owner acceptance kit** is ready ([acceptance-kit.html](https://github.com/GenX-Shinobi/Prompt-Builder/blob/docs/project-control-baseline/docs/acceptance/v5.4.0/acceptance-kit.html), source in `docs/acceptance/v5.4.0/`). It uses ordinary browser actions only: the owner downloads the real release `index.html`, presses a Copy button in the kit, pastes into the app's Import box, compares the preview with a short list of what to expect, and presses Cancel. It has six tests (add/remove commands, add a chatbot, remove a chatbot, a 631-change catalogue, booby-trapped text, a broken catalogue) and needs no terminal, JSON editing or developer tools. The catalogue import is paste-only (there is no file picker), which is why the kit uses Copy buttons.

## Strict v5.4.0 release sequence

1. ~~Implement complete catalogue-diff review and expandable added/removed records; run all three suites.~~ **Done — Claude-reported only** (commits `419b51f`, `5c41741`, `52bcdea`).
2. ChatGPT independently reviews the final release-branch code and test evidence (and, ideally, someone other than the implementer re-runs the three suites and records the output). This may run alongside step 3 and does not block it.
3. **Next milestone — owner-led real-browser verification** using the acceptance kit: added and removed catalogue records in the preview; expanding and collapsing each record; keyboard interaction (Tab, Enter/Space); the large-diff safeguards ("Showing 500 of N", Install disabled until "Show all"); inert booby-trapped text; refusal of a broken catalogue. Desktop, and mobile where practical. The kit's "Copy my results" button produces a short report to paste back.
4. ~~Prepare README reconciliation~~ — **prepared on the docs branch, not merged.** Remaining: apply it when PR #1 merges (resolution above), and re-check it if acceptance changes any behaviour.
5. Owner explicitly approves release.
6. Only then resume v5.5.0 planning/implementation.

### Active task

There is **no open Claude implementation task.** The verification brief [docs/CLAUDE_TASK.md](docs/CLAUDE_TASK.md) has been executed (Claude-reported; see above); `/pb-v54` (defined by `.claude/commands/pb-v54.md`) remains available and, if re-run, must verify and report rather than repeat completed work.

**Single next action:** the owner runs the browser-only acceptance kit (about 15 minutes) against the real release `index.html` and pastes the kit's results summary back to ChatGPT. The owner decides whether and how branches reach `main`.

### Decisions requiring owner approval

Claude does not decide these.

1. **How and when the reviewed release branch reaches `main`.** Note that `main` already contains an earlier v5.4.0 build (`ce1ec19`, from merged PR #2) **without** the later review fixes (`419b51f` to `023171d`). GitHub Pages could not be checked from Claude's environment (API blocked, page not fetchable). If Pages serves `main`, the live page is probably already running that earlier build. Please check the live page and decide.
2. **When to merge PR #1**, and confirming the README resolution above.
3. **Release approval.** Not given; v5.4.0 is not released.

### Release restrictions (apply to every session)

- Do not modify `main`. Do not merge PR #1 or any other PR. Do not create a PR without owner approval.
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
