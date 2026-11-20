# Current Status

> Dated handoff snapshot. Re-check GitHub and local workspaces before acting; this file is not a live connection.

**Last checked:** 2026-11-20  
**Repository:** https://github.com/GenX-Shinobi/Prompt-Builder  
**Default branch:** `main`  
**Project docs branch:** `docs/project-control-baseline`  
**Release branch:** `release/v5.4.0`  
**Product owner:** repository owner

## Verified GitHub state at this handoff

- `main` points to merge commit `b247aec8a1ee279b71f6aedd8fbaf4d908c22d5f`, which contains the v5.4.0 corrective commit.
- `release/v5.4.0` points to `ce1ec19c9b8f8a8ad618d50a5a9f33d3f0618fb2` (`fix: v5.4.0 corrective pass`).
- Comparing `main` (base) with `release/v5.4.0` (head) reports release branch one merge commit behind, zero commits ahead, and no file differences. The release branch is identical in content to the corrective commit.
- PR #2 (v5.4.0) is closed and merged. This is not a release approval.
- PR #1 (project control documentation) remains open and draft: https://github.com/GenX-Shinobi/Prompt-Builder/pull/1. Its branch is `docs/project-control-baseline`, head `5ff33b354db7e13e24f747960839be5d2e1714b7` at the time checked.
- Do not merge PR #1 without explicit owner approval. Its README is based on v5.3.1 and may conflict with the v5.4.0 README; leave README reconciliation until the release documentation can be handled deliberately.
- No GitHub Actions workflow runs or combined commit status checks were returned for corrective commit `ce1ec19...`. PR #2 had no review submissions recorded.
- No newer Claude corrective commit was found on `release/v5.4.0` at this check.

## v5.4.0 files and catalogue

Inspected on `release/v5.4.0`:

- `index.html` declares version 5.4.0.
- `catalog.json` exists and its parsed JSON exactly matches the embedded `catalogData` JSON block.
- Catalogue contains 9 chatbots and 81 commands (catalogue revision 1).
- `tests/browser_suite_1.js`, `tests/browser_suite_2.js` and `tests/browser_corrective.js` exist.
- `contributing.md` documents the three Playwright commands:
  - `node tests/browser_suite_1.js`
  - `node tests/browser_suite_2.js`
  - `node tests/browser_corrective.js`

## Corrective issues — independent source review

### A. Catalogue diff completeness/readability — still open as a release gate

The corrective implementation uses shared `CATALOG_FIELDS` in `cleanCatalog()` and `diffCatalogs()`, and includes the known previously omitted fields: chatbot maker/colour, command placeholder `f`, tier labels/descriptions and other retained fields. Regression tests include schema-driven/canary coverage.

Remaining concern: many human-facing text fields are only labelled as “changed” without showing old/new content. A user may be unable to judge what they are approving. The 500-line display cap also needs careful handling so the UI does not imply a complete review when it shows only part of the diff.

**Next code task:** use `/pb-v54` in Claude Code. This runs the canonical instructions in [docs/CLAUDE_TASK.md](CLAUDE_TASK.md). Claude is authorised only to improve diff reviewability, add regression coverage, run the three suites and push a focused commit to `release/v5.4.0`. No main changes, merge, PR, publication or v5.5.0.

### B. Catalogue status wording — source-level fix observed

`catalogStatusText()` now separately states the number of entries due for re-check and the number showing a grey chip. It explains that fresh doc-only commands can remain chip-free until stale. Source review indicates the wording matches the intended distinction. Automated execution is not independently verified.

### C. Multipart transfer protocol — source-level fix observed

Prompt splitting, Dev Bay paste-first, and on-screen guidance use per-part acknowledgements (`Received part N`) and defer processing until `FINAL PART`. The old contradictory “all parts sent” instruction is absent from inspected source. Automated execution is not independently verified.

## Test evidence — do not overstate

- Claude previously reported 67 checks passing (49 original + 18 additional); this remains a historical report.
- The corrective test source contains checks for catalogue coverage, status wording and multipart behaviour, but source presence does not prove execution.
- The corrective commit message describes 69 additional checks; actual terminal output has not been obtained.
- GitHub checks/statuses are empty for the corrective commit.
- ChatGPT has not independently executed Playwright in this environment.
- Real browser/device testing by the product owner is still outstanding.

Record test status as **not independently verified**, not passed.

## Release gates still outstanding

1. Finish catalogue diff readability and ensure complete review before install approval.
2. Run all three documented Playwright suites and record actual terminal output and totals.
3. Independently review the final focused commit and evidence.
4. Product owner performs real-browser and real-device checks, including catalog import/review/install, multipart transfer, Dev Bay, standalone/offline operation and responsive layout.
5. Reconcile README and project docs without losing either v5.4.0 documentation or PR #1 work.
6. Owner explicitly approves release. Only then plan the release operation.

No v5.5.0 implementation before v5.4.0 has passed these gates.

## Next action

Run `/pb-v54` in Claude Code. When Claude finishes, ChatGPT should independently inspect the new commit and test evidence, update this status, and identify the remaining owner acceptance checks. Do not ask the owner to restate this handoff.
