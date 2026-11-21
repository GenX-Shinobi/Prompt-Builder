# AI Prompt Builder Hub — Roadmap

## RELEASED — v5.4.0 (verified 2026-11-21)

**Formal release complete:** https://github.com/GenX-Shinobi/Prompt-Builder/releases/tag/v5.4.0 . Stable `v5.4.0` tag and `main` at `97531983b26b7e00be78a8200284d7897a97b864` at verification. PR #4 and PR #1 merged. 187 automated Chromium/Playwright checks passed and owner acceptance passed 6/6. Owner approved publication with outstanding manual browser/device/accessibility checks disclosed. Historical “NOW — finish and accept v5.4.0” section below is complete and superseded, not an active release gate.

**Parked follow-up candidates (not authorized implementation):** real-device/touch, Firefox/Safari, screen reader, manual contrast; ≤600px header overlap; chatbot-note styling; in-file corrective version-log entry; malformed release-note Markdown link; optional branch housekeeping and preservation of evidence. No unapproved code changes.

**Next project sequence:** after documentation closeout, resume CHIMERA governance/roadmap and memory-architecture planning **in its separate repository**. Prompt Builder v5.5.0 ideas remain backlog for a later explicitly approved CHIMERA pilot. Maintain independent statutes, memory and project control.

---


The free-first, chatbot-independent mission and project scope in [PROJECT_CONTROL.md](PROJECT_CONTROL.md) govern this roadmap. Proposed work is not a commitment until approved by the owner.

## NOW — finish and accept v5.4.0

**Release is not approved. No v5.5.0 implementation until all v5.4.0 gates pass.**

1. ~~Complete catalogue installation-diff reviewability~~ — **done** (`419b51f`, `5c41741`): every changed value has a before/after preview or a full-value view; added/removed commands and chatbots show complete expandable records; the 500-item cap is explicit and Install stays disabled until all changes are shown.
2. ~~Add regression tests for field coverage, before/after visibility and full review~~ — **done** (`tests/browser_corrective.js`: schema-wide field, collapse, mouse/keyboard and install-gate checks in `52bcdea` and `023171d`).
3. ~~Run all documented Playwright suites~~ — **run and Claude-reported only**: 49 + 18 + 111 = 178 passed, 0 failed (exit 0 each) in a fresh clone of `023171d`. Raw logs in `docs/test-evidence/v5.4.0-023171d/`. Not independently reproduced.
   - `node tests/browser_suite_1.js`
   - `node tests/browser_suite_2.js`
   - `node tests/browser_corrective.js`
   - **Update 2026-11-21:** independently reproduced by GitHub Actions on the final code (`ad459df`, now on `main`): 49 + 18 + 120 = 187 passed, 0 failed, four runs.
4. ~~**Independently review** the final release-branch commit and the test evidence~~ — CI verification relied on by the Owner for PR #6; ChatGPT to confirm the label.
5. ~~Owner real-browser acceptance~~ — **all six tests PASS**. The owner corrected the initial Test 4 file-selection/reporting error, downloaded the correct corrective-branch index.html, repeated only Test 4 with the original package, and updated all six fields.
6. ~~Reconcile the READMEs~~ — **prepared on the docs branch (not merged).** Apply at PR #1 merge by keeping the PR's `readme.md`; merge PR #1 only after the release code is in `main`. The owner decides when.
7. ~~Merge the accepted Test 4 correction into `release/v5.4.0`~~ — complete via PR #3, merge commit `ad459df8`.
8. ~~Bring the release code into `main`~~ — PR #6 merged at `fc30269` on 2026-11-21 (Owner-approved, code only). GitHub Pages updated automatically, so the live app now runs v5.4.0; no tag or GitHub Release yet.
9. Land the documentation (PR #4 → baseline, then PR #1 → `main`, keeping the PR's `readme.md`), complete the remaining checks (real-device mobile, screen reader, Firefox/Safari, manual contrast, version-log decision), then obtain separate explicit owner release approval.

**Corrective implementation:** complete on `fix/v5.4.0-test4-install-button-state` at `0bdeb962`; PR #3 merged into `release/v5.4.0` at `ad459df8c014fc01dce893ff5374e4e4d8e2280a` with owner authorization; PR #6 merged the release branch into `main` at `fc30269`.  
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
## Separate initiative boundary — CHIMERA

CHIMERA (https://github.com/GenX-Shinobi/CHIMERA) is a separate open-source workforce-framework project. Prompt Builder may be considered as its first adopter only after v5.4.0 has passed its own release gates, received explicit owner release approval, and the owner authorizes a separate integration milestone.

This is a future relationship note, **not** an active roadmap item or permission to start v5.5.0. Prompt Builder retains its own mission, roadmap, architecture, release gates and authority. Do not combine project files, statutes or memory.
