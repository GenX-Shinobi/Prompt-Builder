# Claude Code Task — Finish the v5.4.0 corrective review

> **Canonical execution brief.** Read this file before acting. It is intentionally narrow: finish the remaining v5.4.0 catalogue-review issue and produce verifiable test evidence. Do not start v5.5.0.

## Shorthand command

In Claude Code, run:

`/pb-v54`

The repository command at `.claude/commands/pb-v54.md` tells Claude Code to read and execute this file. If slash commands are unavailable in the current Claude Code setup, paste this fallback:

`Read docs/CLAUDE_TASK.md in full and execute it exactly. First inspect the live GitHub state and local workspace; preserve unrelated work.`

## Project and authority

- Repository: https://github.com/GenX-Shinobi/Prompt-Builder
- Required implementation branch: `release/v5.4.0`
- Known release-branch head at task creation: `ce1ec19c9b8f8a8ad618d50a5a9f33d3f0618fb2`
- `main` at task creation: `b247aec8a1ee279b71f6aedd8fbaf4d908c22d5f`
- Product owner: repository owner. The owner has final approval.
- ChatGPT is project manager/reviewer; Claude Code is implementation engineer.

These SHAs are a checkpoint, not permission to overwrite. Re-check GitHub and the local workspace before editing. If the branch head has changed, inspect and preserve all newer work. Do not reset, force-push, rebase destructively, or overwrite unrelated changes.

## Current release gate

v5.4.0 is **not approved for release**. The earlier corrective pass appears to have fixed status wording and unified the multipart protocol. Automated tests are present but their actual execution results have not been independently verified. Product-owner real-browser/device testing is still outstanding.

The remaining code-level concern from independent review is catalogue diff readability:

- The shared `CATALOG_FIELDS` mechanism now covers retained/installable fields, including chatbot maker/colour, command placeholder `f`, and tier labels/descriptions.
- However, many changed human-facing fields are only reported as e.g. `description changed`, `text added to the prompt changed`, `where to find it changed`, or `card summary changed`.
- A user can see that a field changed without seeing the old and new text. This weakens informed installation approval.

## Authorised work

1. Inspect live GitHub state, `release/v5.4.0` head, recent commits, open PRs, and the actual local working tree before editing.
2. Read `PROJECT_CONTROL.md`, `ROADMAP.md`, `docs/CURRENT_STATUS.md`, `docs/AI_WORK_RULES.md`, `docs/REGRESSION_CHECKLIST.md`, and `contributing.md`.
3. Inspect the current `diffCatalogs()`, `CATALOG_FIELDS`, `cleanCatalog()`, catalogue diff rendering, and all related tests.
4. Improve the review so every changed human-facing/installable field gives a meaningful before/after preview. Use safe HTML escaping. Keep the UI readable for long values (for example, concise truncation with an explicit way to inspect the full value, or a clearly bounded expandable detail). Do not silently omit changed values. Metadata-only fields may remain clearly labelled as metadata.
5. Keep the comparison schema-driven so a future retained field cannot silently escape review. Add regression tests covering all field categories and prove old/new values are visible or deliberately inspectable.
6. Check aggregate counts and the 500-line cap so the review never claims every difference is listed when some are hidden. If the display is capped, clearly identify the number shown and provide a way to inspect all differences or otherwise prevent installation until the complete review is available.
7. Run the documented test suites from `contributing.md`:
   - `node tests/browser_suite_1.js`
   - `node tests/browser_suite_2.js`
   - `node tests/browser_corrective.js`
   Run any additional relevant tests and the regression checklist items affected by this change.
8. Record exact command lines, environment/browser versions, actual pass/fail totals, failures, and fixes. Do not report a test as passing unless it was actually executed and passed.
9. Commit and push the focused change to the existing `release/v5.4.0` branch only. Use a clear Conventional Commit message, e.g. `fix: make catalog installation diffs fully reviewable`.
10. Report the new commit SHA, changed files, test output/totals, remaining limitations, and manual owner tests still required.

## Explicitly not authorised

- Do not modify `main`.
- Do not merge any pull request.
- Do not force-push, reset, or overwrite unrelated work.
- Do not publish, deploy, create a release, or create a version tag.
- Do not open a new PR without separate owner approval.
- Do not edit or merge the separate documentation PR except where a task explicitly authorises its documentation branch.
- Do not start v5.5.0 or add unrelated features.
- Do not claim the owner has completed real-browser/device testing.

## Definition of done

This task is complete only when:
- The full catalogue diff is understandable before installation approval.
- Regression tests cover the new behaviour and pass in an actual run.
- All three documented browser suites have actual recorded results.
- The focused commit is pushed to `release/v5.4.0`.
- The handoff includes evidence and clearly lists anything still awaiting owner testing.

After completing this task, stop. Do not independently proceed to release or v5.5.0. Wait for project-manager/owner review.
