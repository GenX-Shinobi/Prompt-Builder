# AI Prompt Builder Hub — Project Control

> Central continuity and decision file. At the start of a new ChatGPT or coding-agent session, read this file and the linked project documents, then verify live GitHub and relevant local workspace state.

**Repository:** https://github.com/GenX-Shinobi/Prompt-Builder  
**Application:** AI Prompt Builder Hub  
**Project owner:** repository owner; final product and release approval  
**Project management/review:** ChatGPT  
**Implementation engineer:** Claude Code  
**Last checked:** 2026-11-20

## Resume phrase

> **Resume AI Prompt Builder Hub — v5.4.0 final verification.** Read `PROJECT_CONTROL.md`, `docs/CURRENT_STATUS.md`, `ROADMAP.md`, `docs/AI_WORK_RULES.md`, `docs/REGRESSION_CHECKLIST.md` and `docs/CLAUDE_TASK.md`. Check live GitHub and the actual Claude workspace before acting. The catalogue-diff implementation is already on `release/v5.4.0` at commit `5c41741`. The immediate task is to verify expandable added/removed record interactions and obtain actual results from all three documented Playwright suites. Do not modify `main`, merge PR #1, publish, or start v5.5.0. Restore the release gates and tell me the single next action.

## Mission and product principles

Build a free-first, chatbot-independent prompt builder that helps nontechnical people turn an everyday goal into a useful prompt and transfer it reliably. Preserve the open-source, accessible, standalone single-file HTML architecture unless the owner explicitly approves a change.

- Free chatbot tiers are the design baseline; paid plans are never a prerequisite.
- Avoid provider lock-in and explain changing capabilities honestly.
- Keep the first-use path understandable to ordinary people.
- Keep the scope centred on prompt building and lightweight context transfer, not a full repository/context-management platform.
- Owner has final say on product direction, merges and releases.

## Verified project state at 2026-11-20

- `main`: `b247aec8a1ee279b71f6aedd8fbaf4d908c22d5f`.
- Catalogue-diff corrective commit: `5c41741ed3b75870e40bb8e3eef4a8b12a538521` on `release/v5.4.0`. The release branch's `index.html` and `tests/browser_corrective.js` match that commit's file blobs.
- v5.4.0 source declares version 5.4.0. The catalogue baseline is 9 chatbots, 81 commands, revision 1.
- PR #2 is merged, but that merge is not product-owner release approval.
- PR #1 (https://github.com/GenX-Shinobi/Prompt-Builder/pull/1) remains open/draft on `docs/project-control-baseline`. Do not merge without explicit approval. Its README is based on v5.3.1 and must be reconciled carefully with the v5.4.0 README; do not overwrite either.
- Claude reported 160 test passes across the three suites. This is not yet independently reproduced; the current Claude task requires fresh execution evidence and explicit tests of the expandable detail interaction.
- The owner performed a safe, limited local browser preview of one changed ChatGPT summary and canceled without installing. No claim is made that the owner tested added/removed records.

## Strict v5.4.0 release sequence

1. Verify added/removed catalogue record expansion and actual execution of all three documented test suites.
2. Independently review code and test evidence.
3. Product owner completes only meaningful real-world usability/acceptance checks.
4. Reconcile release docs and record acceptance.
5. Owner explicitly approves release.
6. Only then resume v5.5.0 planning/implementation.

### Active task

Canonical Claude brief: [docs/CLAUDE_TASK.md](docs/CLAUDE_TASK.md)  
Claude Code shorthand: `/pb-v54` (defined by `.claude/commands/pb-v54.md`).

This task is verification-first. Claude should add test assertions if interaction coverage is missing, and change production code only for a reproduced defect. No changes to `main`, no merge, no publication, and no v5.5.0.

## Other unfinished work

PR #1 is the draft project-control documentation PR. Preserve its work. README reconciliation is deliberately deferred until after v5.4.0 acceptance to avoid clobbering release documentation.

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

## Supporting documents

- [Roadmap](ROADMAP.md)
- [Current status](docs/CURRENT_STATUS.md)
- [Claude task](docs/CLAUDE_TASK.md)
- [AI work rules](docs/AI_WORK_RULES.md)
- [Regression checklist](docs/REGRESSION_CHECKLIST.md)
- [Idea inbox](docs/IDEA_INBOX.md)
- [Contributing guide](contributing.md)

## Session closeout rule

At each meaningful handoff, update `docs/CURRENT_STATUS.md` with verified repository/test evidence and update this file with active task, decisions and next action. Update the roadmap when priority changes. Clearly separate source inspection, automated execution, independent review and owner acceptance.
