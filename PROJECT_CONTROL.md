# AI Prompt Builder Hub — Project Control

> Central continuity and decision file. At the start of a new ChatGPT or coding-agent session, read this file and the linked project documents, then verify live GitHub and relevant local workspace state.

**Repository:** https://github.com/GenX-Shinobi/Prompt-Builder  
**Application:** AI Prompt Builder Hub  
**Project owner:** repository owner; final product and release approval  
**Project management/review:** ChatGPT  
**Implementation engineer:** Claude Code  
**Last checked:** 2026-11-20

## Resume phrase

> **Resume AI Prompt Builder Hub — v5.4.0 release closeout.** Read `PROJECT_CONTROL.md`, `docs/CURRENT_STATUS.md`, `ROADMAP.md`, `docs/AI_WORK_RULES.md`, `docs/REGRESSION_CHECKLIST.md` and `docs/CLAUDE_TASK.md`. Check live GitHub and the actual Claude workspace before acting. The immediate task is the remaining v5.4.0 catalogue-diff reviewability fix and verified test execution. Do not modify main, merge PR #1, publish, or start v5.5.0. Restore the release gates and tell me the single next action.

## Mission and product principles

Build a free-first, chatbot-independent prompt builder that helps nontechnical people turn an everyday goal into a useful prompt and transfer it reliably. Preserve the open-source, accessible, standalone single-file HTML architecture unless the owner explicitly approves a change.

- Free chatbot tiers are the design baseline; paid plans are never a prerequisite.
- Avoid provider lock-in and explain changing capabilities honestly.
- Keep the first-use path understandable to ordinary people.
- Keep the scope centred on prompt building and lightweight context transfer, not a full repository/context-management platform.
- Owner has final say on product direction, merges and releases.

## Verified project state at 2026-11-20

- `main`: `b247aec8a1ee279b71f6aedd8fbaf4d908c22d5f` (merge commit for PR #2).
- `release/v5.4.0`: `ce1ec19c9b8f8a8ad618d50a5a9f33d3f0618fb2` (`fix: v5.4.0 corrective pass`).
- `main` is one merge commit ahead of release branch, but GitHub comparison reports no file differences; release branch content equals the corrective commit.
- v5.4.0 source declares version 5.4.0. Embedded catalogue equals `catalog.json`: 9 chatbots, 81 commands, revision 1.
- PR #2 is merged, but that merge is not product-owner release approval.
- PR #1 (https://github.com/GenX-Shinobi/Prompt-Builder/pull/1) remains open/draft on `docs/project-control-baseline`. Do not merge without explicit approval. Its README describes v5.3.1 and must be reconciled carefully with the v5.4.0 README; do not overwrite either.
- No newer Claude corrective commit was found on the release branch at last check. Re-check before assigning work.
- GitHub workflow runs/statuses and PR review submissions were not available for the corrective commit.

## Strict v5.4.0 release sequence

1. Complete remaining v5.4.0 corrective work.
2. Independently review code and actual test evidence.
3. Product owner completes real-browser/device acceptance testing.
4. Reconcile release docs and record acceptance.
5. Owner explicitly approves release.
6. Only then resume v5.5.0 planning/implementation.

### Current blocker

The catalogue diff is now schema-driven and includes the previously omitted installable fields. However, some changed human-facing fields only say “changed” without showing before/after text. The installation review should let users understand meaningful changes before approving them. The 500-line cap also needs transparent complete-review handling.

The status wording and multipart protocol appear corrected in source, but automated execution is not independently verified. See [CURRENT_STATUS.md](docs/CURRENT_STATUS.md).

### Active task

Canonical Claude brief: [docs/CLAUDE_TASK.md](docs/CLAUDE_TASK.md)  
Claude Code shorthand: `/pb-v54` (defined in `.claude/commands/pb-v54.md`).

The task is limited to catalogue diff reviewability, regression coverage, running all three documented Playwright suites, and pushing a focused commit to the existing `release/v5.4.0` branch. No changes to `main`, no merge, no PR, no publication, and no v5.5.0.

## Other unfinished work

PR #1 is the draft project-control documentation PR. This branch is being updated with the current handoff and Claude task instructions, but the PR remains unmerged. Preserve its work. README reconciliation is deliberately deferred until after v5.4.0 acceptance to avoid clobbering release documentation.

## Working method and authority

- One primary implementation task at a time.
- Inspect GitHub and local workspace before changes; do not rely on stale chat summaries.
- Preserve newer work; never force-push or overwrite unrelated changes.
- Use dedicated branches and small reviewable commits.
- Claude Code implements bounded tasks and reports exact commits, files and test evidence.
- ChatGPT independently reviews important claims and maintains project continuity.
- Never claim tests or browser checks passed unless actually run.
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
