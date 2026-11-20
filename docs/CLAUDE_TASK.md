# Claude Code Task — Final v5.4.0 catalogue-diff verification

> **Canonical execution brief.** The implementation work is already present in commit `5c41741` on `release/v5.4.0`. Do not repeat it. This task is to verify the real test execution and close the remaining developer-level evidence gap.

## Shorthand command

In Claude Code, run:

`/pb-v54`

The repository command at `.claude/commands/pb-v54.md` directs Claude Code to read and execute this file. If slash commands are unavailable, paste:

`Read docs/CLAUDE_TASK.md in full. Verify live GitHub and the actual local workspace before acting. This is a verification task, not permission to repeat completed implementation work.`

## Roles and authority

- Repository: https://github.com/GenX-Shinobi/Prompt-Builder
- Implementation branch: `release/v5.4.0`
- Product owner: final product, merge and release approval.
- Claude Code: implementation and automated test execution.
- ChatGPT: independent project review and continuity.

## Verified starting point

- The catalogue-diff implementation commit is `5c41741ed3b75870e40bb8e3eef4a8b12a538521`.
- Its changes are in `index.html` and `tests/browser_corrective.js`.
- Added/removed commands now carry complete installable field records inside expandable details.
- Added/removed chatbot records show card fields and notes; each associated command is listed as its own complete record.
- HTML escaping and the 500-item review/install gate remain.
- The product owner performed a limited real-browser check using a separate test copy: a changed ChatGPT card summary was correctly detected in the preview, then Cancel was used. Nothing was installed. This did **not** test added/removed records.

Treat these as checkpoints. Re-check the live branch and actual local workspace before acting. Preserve newer work.

## Authorised work

1. Inspect live GitHub state, `release/v5.4.0` head, recent commits, open PRs, and the actual local working tree.
2. Read `PROJECT_CONTROL.md`, `ROADMAP.md`, `docs/CURRENT_STATUS.md`, `docs/AI_WORK_RULES.md`, `docs/REGRESSION_CHECKLIST.md`, and `contributing.md`.
3. Inspect the current added/removed record rendering and the A3 tests in `tests/browser_corrective.js`.
4. Verify that automated tests explicitly exercise the expandable UI behavior, not merely the presence of hidden detail text:
   - Added command: the row has a details/summary control; activating it opens the record and exposes all installable fields.
   - Removed command: the previous record is inspectable in the same way.
   - Added chatbot: card fields and notes expand; each added command has its own expandable full record.
   - Removed chatbot: card fields, notes and each removed command are inspectable.
   - Hostile markup remains inert text.
   - Large diffs retain the 500-item gate and require Show all before Install is enabled.
5. If these interaction assertions are missing, add focused regression assertions to `tests/browser_corrective.js`. Change production code only if a reproducible defect is found. Keep the patch narrow.
6. Run all three documented suites from `contributing.md`:
   - `node tests/browser_suite_1.js`
   - `node tests/browser_suite_2.js`
   - `node tests/browser_corrective.js`
7. Record exact command output, Node version, Playwright/browser version, pass/fail totals, failures and fixes. Do not claim tests passed unless actually executed.
8. If a test-only or defect fix is needed, commit and push the focused change to `release/v5.4.0` only. If no change is needed, do not create an empty commit.
9. Report the verified branch/commit, changed files (if any), exact test evidence, remaining limitations and the single next owner decision.

## Explicitly not authorised

- Do not modify `main`.
- Do not merge PR #1 or any other PR.
- Do not create a new PR without separate owner approval.
- Do not force-push, reset, rebase destructively or overwrite unrelated work.
- Do not publish, deploy, tag or create a release.
- Do not start v5.5.0 or add unrelated features.
- Do not ask the product owner to create test fixtures, edit JSON, run developer scripts or inspect hidden implementation details.
- Do not claim that the owner tested added/removed record expansion; that is the purpose of this automated verification.

## Definition of done

- The expandable added/removed record interactions are explicitly tested, or a reproducible defect is fixed and covered.
- All three documented suites have actual recorded results.
- The handoff clearly separates Claude's execution evidence, ChatGPT's independent review and the owner's remaining acceptance decision.

After reporting, stop and wait. Do not release or start another milestone.
