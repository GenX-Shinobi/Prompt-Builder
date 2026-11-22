# AI Prompt Builder Hub — Project Control

> Governing principles, authority and operating boundaries. This file holds no dated status: the current project state is in [docs/CURRENT_STATUS.md](docs/CURRENT_STATUS.md) and the resume steps are in [docs/SESSION_HANDOFF.md](docs/SESSION_HANDOFF.md). Superseded checkpoints are recoverable through [docs/ARCHIVE_INDEX.md](docs/ARCHIVE_INDEX.md).

- **Application:** AI Prompt Builder Hub
- **Repository:** https://github.com/GenX-Shinobi/Prompt-Builder
- **Live app (GitHub Pages, published automatically from `main`):** https://genx-shinobi.github.io/Prompt-Builder/

## Roles (do not blur them)

- **Owner** — product owner; approves scope, implementation authorization, product direction, merges and releases.
- **ChatGPT** — project manager and independent reviewer; owns central management documentation, roadmap/status continuity, owner-facing decisions and review of Claude's evidence.
- **Claude Code** — implementation engineer; owns implementation, code-adjacent documentation and technical test evidence for assigned work.

## Mission and product principles

Build a free-first, chatbot-independent prompt builder that helps nontechnical people turn an everyday goal into a useful prompt and transfer it reliably. Preserve the open-source, accessible, standalone single-file HTML architecture unless the owner explicitly approves a change.

- Free chatbot tiers are the design baseline; paid plans are never a prerequisite.
- Avoid provider lock-in and explain changing capabilities honestly.
- Keep the first-use path understandable to ordinary people.
- Keep the scope centred on prompt building and lightweight context transfer, not a full repository/context-management platform.
- Owner has final say on product direction, merges and releases.

## Document responsibilities

| Document | Responsibility |
|---|---|
| `PROJECT_CONTROL.md` (this file) | Governing principles, roles, authority and operating boundaries |
| [ROADMAP.md](ROADMAP.md) | Authorized progression, future proposals and release gates |
| [docs/CURRENT_STATUS.md](docs/CURRENT_STATUS.md) | Authoritative current project state, with evidence labels |
| [docs/SESSION_HANDOFF.md](docs/SESSION_HANDOFF.md) | Continuity: resume phrase, startup checks and the single next action |
| [docs/AI_WORK_RULES.md](docs/AI_WORK_RULES.md) | Working procedures and safeguards for AI contributors |
| [docs/ARCHIVE_INDEX.md](docs/ARCHIVE_INDEX.md) | Historical references, evidence locations, preservation status and verification classifications |
| [docs/IDEA_INBOX.md](docs/IDEA_INBOX.md) | Idea capture and triage; nothing there is a commitment |
| [docs/REGRESSION_CHECKLIST.md](docs/REGRESSION_CHECKLIST.md) | Regression checks for changes and releases |
| [docs/CHIMERA_RELATIONSHIP.md](docs/CHIMERA_RELATIONSHIP.md) | Boundary note for the separate CHIMERA initiative |

Only the current-state documents above give instructions. Dated records in the archive are evidence, not instructions.

## Operating boundaries (apply to every session)

- No application code change, merge, release, tag, branch deletion, deployment or new milestone (including v5.5.0 and CHIMERA implementation) without explicit Owner authorization.
- Merging to `main` publishes the live site automatically through GitHub Pages; treat every merge to `main` as a publication decision.
- Do not change production code in documentation-only tasks.
- Do not force-push, reset or overwrite unrelated work. Preserve evidence branches and agent configurations unless the Owner authorizes otherwise.
- Never claim tests or browser checks passed unless they were actually run, and never promote an evidence label without new evidence.
- Work schedules and personal information are private and do not belong in public repository documents.

## Working method and authority

- One primary implementation task at a time.
- Inspect GitHub and local workspace before changes; do not rely on stale chat summaries.
- Preserve newer work; never force-push or overwrite unrelated changes.
- Use dedicated branches and small reviewable commits.
- Claude Code implements bounded tasks and reports exact commits, files and test evidence.
- ChatGPT independently reviews important claims and maintains project continuity.
- Do not assign the product owner developer-level fixture creation or repetitive test execution when Claude or automation can safely perform it.
- No direct default-branch changes, merges, PR creation, publishing or release without owner approval.
- Capture extra ideas in [IDEA_INBOX.md](docs/IDEA_INBOX.md); do not expand active scope.
- **Communication preference (owner):** short, digestible sections; one explicit decision prompt at a time; plain English, with technical detail kept out of the way. Lead with what changed and what the owner should do next. Never ask the owner to use a terminal, edit JSON, build fixtures or open developer tools; supply ready-made files and browser-only steps instead.

## Documentation ownership and parallel work

- ChatGPT maintains central project-control records: `PROJECT_CONTROL.md`, `ROADMAP.md`, `docs/CURRENT_STATUS.md`, `docs/IDEA_INBOX.md`, and owner-facing continuity instructions. ChatGPT also prepares bounded Claude task briefs when the owner authorizes work.
- Claude Code owns implementation details, source-adjacent documentation, version/change logs, raw test evidence and technical reports for assigned work. Claude updates central management documents only when explicitly assigned.
- The owner retains authority over product direction, implementation authorization, branch integration, merges and releases.
- Parallel work is allowed on separate branches and non-overlapping files (details in [docs/AI_WORK_RULES.md](docs/AI_WORK_RULES.md) §8).

## Session Continuity & Context Protection Protocol

Purpose: let a fresh ChatGPT or Claude session resume accurately from the repository alone, without reconstructing a long conversation.

1. **The repository is authoritative.** Documentation and live Git state outrank anyone's recollection of the conversation. If they disagree, trust Git, then fix the document.
2. **Checkpoint at task or phase boundaries**, not after every message. A checkpoint updates `docs/CURRENT_STATUS.md` and, if the task, decisions or next action changed, `docs/SESSION_HANDOFF.md`.
3. **Each checkpoint records:** exact branch and commit references; working-tree and push status; the active task and its restrictions; decisions made and who made them; test evidence with its category (verified, Claude-reported, independently reproduced, owner-tested); unresolved issues; and exactly **one** next action.
4. **Label every claim** as one of: verified fact, Claude-reported result, independent review, owner-verified, decision awaiting the owner, or future idea. Never promote a label without new evidence.
5. **Prepare a short resume prompt** before a session becomes unwieldy, or before a long transfer, hand-off or multi-part paste. Keep it to the resume phrase in `docs/SESSION_HANDOFF.md` plus anything that changed since; it points at these documents rather than copying them.
6. **No invisible work.** Never claim background monitoring, automatic updates, scheduled checks or saved memory that has not actually happened. Say what was written, where, and at which commit.
7. **A new session starts by verifying**, not trusting: fetch GitHub, check the actual workspace and working tree, compare with the last checkpoint, report differences, then state the single next action.
8. **Keep it small.** One status file, one control file. Move superseded checkpoints out of active documents and record where they can be recovered in `docs/ARCHIVE_INDEX.md`. Capture new ideas in [IDEA_INBOX.md](docs/IDEA_INBOX.md).

Clearly separate source inspection, automated execution, independent review and owner acceptance in every checkpoint.

## Separate initiative boundary — CHIMERA

CHIMERA is a separate public repository and independent project: https://github.com/GenX-Shinobi/CHIMERA

Its mission is to develop a reusable, open-source, free-to-use, platform-independent framework for building, governing and coordinating AI workforces. AI Prompt Builder Hub may become its first adopter only after the owner separately authorizes a bounded integration milestone.

- Keep the repositories, roadmaps, statutes, memory, task queues and release processes separate.
- CHIMERA employees, permissions and memory do not automatically transfer into Prompt Builder.
- Prompt Builder project requirements, employee configurations and release authority do not automatically transfer into CHIMERA.
- Any future integration must be assessed against Prompt Builder's own free-first mission, standalone architecture, scope and project-specific rules.
- CHIMERA planning is not an active Prompt Builder implementation task and does not authorize v5.5.0.

See also [docs/CHIMERA_RELATIONSHIP.md](docs/CHIMERA_RELATIONSHIP.md).
