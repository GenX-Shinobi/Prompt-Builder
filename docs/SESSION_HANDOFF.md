# AI Prompt Builder Hub — Session Handoff

> Continuity only: how to resume, what to check, and the single next action. Current facts live in [CURRENT_STATUS.md](CURRENT_STATUS.md); rules in [../PROJECT_CONTROL.md](../PROJECT_CONTROL.md) and [AI_WORK_RULES.md](AI_WORK_RULES.md). Earlier handoffs are recoverable through [ARCHIVE_INDEX.md](ARCHIVE_INDEX.md) and are not instructions.

**Checkpoint:** 2026-11-23, PB-550-01. [Draft PR #12](https://github.com/GenX-Shinobi/Prompt-Builder/pull/12) is at `1f1d7f54a2296c5366b41ad9e2e2b97c69f8351a` (v5.5.0-test.4). Owner browser acceptance is deferred until desktop access is available.

## Resume phrase

> **Resume Prompt Builder PR #12.** Read this handoff and [CURRENT_STATUS.md](CURRENT_STATUS.md), then confirm the live PR head and read the latest report. Keep PR #12 in draft pending Owner review.

## Read first

1. This handoff
2. [CURRENT_STATUS.md](CURRENT_STATUS.md)
3. [../PROJECT_CONTROL.md](../PROJECT_CONTROL.md)
4. [AI_WORK_RULES.md](AI_WORK_RULES.md)
5. [../ROADMAP.md](../ROADMAP.md)
6. [ARCHIVE_INDEX.md](ARCHIVE_INDEX.md) — only when historical evidence is needed

## Startup checks

1. Compare live `main`, the `v5.4.0` tag, and PR #12 with [CURRENT_STATUS.md](CURRENT_STATUS.md). Check the latest PR comments for any head or scope change.
2. Confirm `index.html` on `main` is still blob `856fb513eb242d8bf704d96a829f924217b3bc95` unless an authorized change says otherwise.
3. Check the CI artifact expiry (2026-12-05 ~16:05 UTC) against today's date and whether the Owner has confirmed a permanent private backup.
4. Report any difference before acting.

## Time-sensitive pending item

The four CI artifacts expire on **2026-12-05 ~16:05 UTC**. A permanent Owner-controlled private backup of the evidence package is **pending**. Git tags do not preserve these artifacts.

## Single next action

When desktop access is available, the Owner opens the [pinned test.4 build](https://github.com/GenX-Shinobi/Prompt-Builder/blob/1f1d7f54a2296c5366b41ad9e2e2b97c69f8351a/index.html) locally in Chrome. In Guided Path, choose Claude and use a prompt that splits into at least five parts. Narrow and shorten the browser window, position **Copy & launch in Claude** near the top, and press it. Return to the builder if Claude opens in a new tab. Check whether **Copy part 1** is fully in view without manually scrolling after launch. Record pass or fail and the viewport size if available.

After the result, the PM reviews acceptance and presents the next Owner decision. Tester distribution, merge, deployment and release each require authorization.
