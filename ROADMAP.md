# AI Prompt Builder Hub — Roadmap

The free-first, chatbot-independent mission and project scope in [PROJECT_CONTROL.md](PROJECT_CONTROL.md) govern this roadmap. Proposed work is not a commitment until approved by the owner.

## NOW — finish and accept v5.4.0

**Release is not approved. No v5.5.0 implementation until all v5.4.0 gates pass.**

1. ~~Complete catalogue installation-diff reviewability~~ — **done** (`419b51f`, `5c41741`): every changed value has a before/after preview or a full-value view; added/removed commands and chatbots show complete expandable records; the 500-item cap is explicit and Install stays disabled until all changes are shown.
2. ~~Add regression tests for field coverage, before/after visibility and full review~~ — **done** (`tests/browser_corrective.js`, including seven UI-interaction checks in `52bcdea`).
3. ~~Run all documented Playwright suites~~ — **run and Claude-reported only**: 49 + 18 + 100 = 167 passed, 0 failed (exit 0 each). Not independently reproduced; raw logs not committed.
   - `node tests/browser_suite_1.js`
   - `node tests/browser_suite_2.js`
   - `node tests/browser_corrective.js`
4. **Independently review** the final release-branch commit (`52bcdea`) and the test evidence.
5. **Next milestone — owner-led real-browser verification** of added/removed catalogue records, expansion/collapse, keyboard interaction (Tab, Enter/Space) and the large-diff safeguards ("Showing 500 of N", Install disabled until "Show all"), on desktop and mobile where practical. Claude provides test catalogues; the owner does not hand-edit JSON.
6. Reconcile README/project documentation carefully; preserve the separate draft documentation PR (#1) and the v5.4.0 README. The two READMEs conflict and are deliberately unreconciled.
7. Obtain explicit owner release approval. The owner decides how the release branch reaches `main`.

**Claude brief:** [docs/CLAUDE_TASK.md](docs/CLAUDE_TASK.md) (executed; no open implementation task)  
**Claude Code shorthand:** `/pb-v54`

## NEXT — resume v5.5 planning only after v5.4.0 release

Reassess the next milestone from user evidence and the idea inbox. Candidate direction is a Guided Path for first-time users that turns plain-language goals into prompts using the existing compiler. This is not active implementation scope yet.

## LATER — evidence-led improvements

- Task/chatbot recommendations with clear free/account/limited/paid distinctions.
- Better attachment previews and clearer manual-upload guidance.
- More reliable token/character estimates and Unicode-safe splitting.
- Session checkpointing and reusable task loadouts.
- Optional preset/settings portability improvements if not already delivered.

## LATER — project-management improvements (owner-requested; not active)

To be started only after independent review of the current documentation work, as a separate approved task: a general `/resume-project` command, a four-layer project-memory architecture, and transfer-integrity safeguards. Recorded here because they are not yet in [docs/IDEA_INBOX.md](docs/IDEA_INBOX.md); they are not a commitment.

## PARKED / outside current scope

- Full folder/repository-scale context packer.
- Cloud accounts, synchronisation or hosted prompt storage.
- Provider lock-in, paid-only core workflows or mandatory subscriptions.
- Framework/build-system migration or runtime dependencies.
- Large feature expansions before core reliability and first-use usability are proven.

## Release gates

- Version and migration history consistent.
- README and status accurately describe the actual release.
- Existing behaviour passes regression checks.
- Automated test output is recorded, not merely claimed.
- Desktop and mobile browser acceptance completed.
- Offline/downloaded-file behaviour checked where promised.
- Standalone HTML remains complete and dependency-free.
- Known limitations disclosed.
- Owner explicitly approves release.
