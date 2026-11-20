# AI Prompt Builder Hub — Roadmap

The free-first, chatbot-independent mission and project scope in [PROJECT_CONTROL.md](PROJECT_CONTROL.md) govern this roadmap. Proposed work is not a commitment until approved by the owner.

## NOW — finish and accept v5.4.0

**Release is not approved. No v5.5.0 implementation until all v5.4.0 gates pass.**

1. Complete the remaining catalogue installation-diff reviewability work. Every changed human-facing/installable field must have a meaningful before/after preview or a clear way to inspect the full values. Handle the 500-line cap transparently.
2. Add regression tests for complete field coverage, before/after visibility and full review behaviour.
3. Run all documented Playwright suites and record actual results:
   - `node tests/browser_suite_1.js`
   - `node tests/browser_suite_2.js`
   - `node tests/browser_corrective.js`
4. Independently review the final commit and evidence.
5. Product owner performs real-browser/device acceptance tests.
6. Reconcile README/project documentation carefully; preserve the separate draft documentation PR and v5.4.0 README.
7. Obtain explicit owner release approval.

**Active Claude brief:** [docs/CLAUDE_TASK.md](docs/CLAUDE_TASK.md)  
**Claude Code shorthand:** `/pb-v54`

## NEXT — resume v5.5 planning only after v5.4.0 release

Reassess the next milestone from user evidence and the idea inbox. Candidate direction is a Guided Path for first-time users that turns plain-language goals into prompts using the existing compiler. This is not active implementation scope yet.

## LATER — evidence-led improvements

- Task/chatbot recommendations with clear free/account/limited/paid distinctions.
- Better attachment previews and clearer manual-upload guidance.
- More reliable token/character estimates and Unicode-safe splitting.
- Session checkpointing and reusable task loadouts.
- Optional preset/settings portability improvements if not already delivered.

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
