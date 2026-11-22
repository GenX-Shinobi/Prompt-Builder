# AI Prompt Builder Hub — Session Handoff

> Continuity only: how to resume, what to check, and the single next action. Current facts live in [CURRENT_STATUS.md](CURRENT_STATUS.md); rules in [../PROJECT_CONTROL.md](../PROJECT_CONTROL.md) and [AI_WORK_RULES.md](AI_WORK_RULES.md). Earlier handoffs are recoverable through [ARCHIVE_INDEX.md](ARCHIVE_INDEX.md) and are not instructions.

**Checkpoint:** 2026-11-22, PB-CLOSEOUT-04 (documentation reconciliation on draft PR from `docs/v5.4.0-final-reconciliation`)

## Resume phrase

> **Resume AI Prompt Builder Hub after the v5.4.0 release.** Read `docs/SESSION_HANDOFF.md`, then `docs/CURRENT_STATUS.md`; verify live GitHub before acting. v5.4.0 is released. No development milestone is active. Do not merge, tag, release, delete branches, change application code, or start v5.5.0 or CHIMERA work without the Owner's separate approval. State one next action.

## Read first

1. This handoff
2. [CURRENT_STATUS.md](CURRENT_STATUS.md)
3. [../PROJECT_CONTROL.md](../PROJECT_CONTROL.md)
4. [AI_WORK_RULES.md](AI_WORK_RULES.md)
5. [../ROADMAP.md](../ROADMAP.md)
6. [ARCHIVE_INDEX.md](ARCHIVE_INDEX.md) — only when historical evidence is needed

## Startup checks

1. Fetch GitHub. Compare `main`, tag `v5.4.0`, open PRs and branch tips with [CURRENT_STATUS.md](CURRENT_STATUS.md) and [ARCHIVE_INDEX.md](ARCHIVE_INDEX.md).
2. Confirm `index.html` is still blob `856fb513eb242d8bf704d96a829f924217b3bc95` unless an authorized change says otherwise.
3. Check the CI artifact expiry (2026-12-05 ~16:05 UTC) against today's date and whether the Owner has confirmed a permanent private backup.
4. Report any difference before acting.

## Time-sensitive pending item

The four CI artifacts expire on **2026-12-05 ~16:05 UTC**. A permanent Owner-controlled private backup of the evidence package is **pending**. Git tags do not preserve these artifacts.

## Single next action

ChatGPT independently reviews the PB-CLOSEOUT-04 draft PR (diff, evidence and scope) and presents one Owner decision: merge, revise or reject it.
