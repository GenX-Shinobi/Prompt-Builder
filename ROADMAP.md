# AI Prompt Builder Hub — Roadmap

The free-first, chatbot-independent mission and project scope in [PROJECT_CONTROL.md](PROJECT_CONTROL.md) govern this roadmap. Proposed work is not a commitment until approved by the owner.

## NOW — finish and accept v5.4.0

**Release is not approved. No v5.5.0 implementation until all v5.4.0 gates pass.**

1. ~~Complete catalogue installation-diff reviewability~~ — **done** (`419b51f`, `5c41741`): every changed value has a before/after preview or a full-value view; added/removed commands and chatbots show complete expandable records; the 500-item cap is explicit and Install stays disabled until all changes are shown.
2. ~~Add regression tests for field coverage, before/after visibility and full review~~ — **done** (`tests/browser_corrective.js`: schema-wide field, collapse, mouse/keyboard and install-gate checks in `52bcdea` and `023171d`).
3. ~~Run all documented Playwright suites~~ — **run and Claude-reported only**: 49 + 18 + 111 = 178 passed, 0 failed (exit 0 each) in a fresh clone of `023171d`. Raw logs in `docs/test-evidence/v5.4.0-023171d/`. Not independently reproduced.
   - `node tests/browser_suite_1.js`
   - `node tests/browser_suite_2.js`
   - `node tests/browser_corrective.js`
4. **Independently review** the final release-branch commit (`023171d`) and the test evidence. May run alongside step 5.
5. **Owner real-browser acceptance completed:** Tests 1, 2, 3, 5 and 6 passed; Test 4 failed because the disabled Install and reload button was visually ambiguous after a 631-change preview. Installation was not attempted. Optional narrow-window repeat passed.
6. ~~Reconcile the READMEs~~ — **prepared on the docs branch (not merged).** Apply at PR #1 merge by keeping the PR's `readme.md`; merge PR #1 only after the release code is in `main`. The owner decides when.
7. Obtain explicit owner release approval. The owner decides how the release branch reaches `main`.

**Current Claude brief:** [docs/CLAUDE_TASK.md](docs/CLAUDE_TASK.md) — focused Test 4 correction, prepared and awaiting owner submission/authorization.  
**Claude Code shorthand:** `/pb-v54`.

## NEXT — roadmap reassessment only after v5.4.0 release

After v5.4.0 passes its release gates and the owner approves release, reassess the next milestone from user evidence and the idea inbox. Candidate directions include a Guided Path and a separate visual/accessibility/multilingual finishing phase. Neither is active implementation scope.

## LATER — evidence-led improvements

- Task/chatbot recommendations with clear free/account/limited/paid distinctions.
- Better attachment previews and clearer manual-upload guidance.
- More reliable token/character estimates and Unicode-safe splitting.
- Session checkpointing and reusable task loadouts.
- Optional preset/settings portability improvements if not already delivered.

## LATER — project-management improvements (owner-requested; not active)

**Future infrastructure ideas only — not active work, not approved.** To be started only after v5.4.0 acceptance, as a separate owner-approved task: a general `/resume-project` command; a four-layer project-memory architecture; project agents; communication/transfer shorthand and transfer-integrity safeguards; and efficiency improvements to the working process. Recorded here because they are not yet in [docs/IDEA_INBOX.md](docs/IDEA_INBOX.md); none is a commitment.

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


## Future finishing round-up — proposal only

After v5.4.0 is back on course, accepted and released, consider a separate owner-approved finishing phase to improve visual consistency, extend the existing colour palettes across more of the page, and add multilingual support with accessibility as a design requirement. Preserve deliberate visual choices—including the compiled-prompt area's dark treatment in light mode—unless usability evidence supports changing them. Consider translation architecture, longer strings, non-Latin scripts and right-to-left layouts. This is a future proposal, not current work and not part of the Test 4 correction.
