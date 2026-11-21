# Claude Code Assignment — v5.4.0 Test 4 corrective fix

> Status: prepared for owner submission; not yet authorized or started. This is the current canonical implementation brief. Do not infer authorization from the file's presence.

## Objective

A 631-change catalogue preview worked, but the disabled Install and reload button looked too much like its enabled state. The owner did not attempt installation, so the functional installation gate has not been owner-verified.

The task is narrowly scoped to the button's actual disabled logic and its visual/accessibility communication. Preserve the existing visual design.

## Roles and reporting

- Product owner: approves implementation, product direction, merges and release.
- Claude Code: implementation engineer; inspect, implement and run automated tests.
- ChatGPT: project manager and independent reviewer; reviews full technical evidence and gives the owner a concise plain-English outcome and one next action.
- Do not ask the owner to interpret code, diffs, logs or test output. Supply full technical evidence to ChatGPT and a short owner-facing summary.

## Owner acceptance evidence to preserve

- Test 1 — add one command and remove another: PASS.
- Test 2 — add a chatbot: PASS.
- Test 3 — remove Mistral: PASS.
- Test 4 — 631-change catalogue: FAIL because disabled Install and reload looked too much like enabled. Preview/update worked. Installation was not attempted; do not claim the install action passed or failed.
- Test 5 — booby-trapped text remains inert: PASS.
- Test 6 — broken catalogue refused: PASS.
- Optional narrow-window repeat of Test 1: PASS.
- Exact browser version, device model and viewport dimensions were not recorded.

Do not ask the owner to repeat the five passed tests.

## Authorized work — only after the owner submits this assignment

1. Verify live GitHub branch heads, recent commits, open PRs and the actual local workspace before editing. If the release branch changed since the recorded checkpoint, preserve newer work and report the difference.
2. Read the current release source and relevant tests. Inspect the 500-item review/install gate and identify the actual cause of the ambiguous button state.
3. Verify that the control is genuinely disabled before the required review action, not merely styled to look disabled. Test pointer, Enter, Space and programmatic activation paths.
4. Make the smallest correction that makes enabled and disabled states unmistakably different across all five existing colour palettes and applicable light/dark modes.
5. Check the affected control's text contrast, borders/state cues, pointer behavior, visible keyboard focus and accessible disabled state. Do not rely on colour alone.
6. Preserve the current visual design. Theme/palette changes affect selected regions (including the header, smaller boxes and Dev Bay); the compiled-prompt area deliberately remains dark even in light mode. Do not redesign the page, expand theme coverage, or recolour the compiled-prompt area in this task.
7. Add focused automated regression coverage for functional gating and visual/state coverage where practical. Avoid brittle tests that merely assert one specific colour without checking meaningful distinction.
8. Test the large-change workflow using a fresh isolated copy/fixture representing 631 changes. Verify the state before and after Show all. If installation is tested, do so only in the disposable copy and record exactly what was verified.
9. Run relevant existing browser suites and new regression tests. Record exact commands, environment, pass/fail totals and raw output. Report every test not run.
10. Commit the focused change to a new branch created from the verified release/v5.4.0 head. Do not commit directly to the release branch.

## Branch and release restrictions

- Create a separate descriptive corrective branch from release/v5.4.0.
- Do not modify main, release/v5.4.0 or docs/project-control-baseline.
- Do not merge, rebase destructively, force-push, publish, deploy, tag or create a release.
- Do not create a pull request unless the owner separately authorizes it.
- Do not start v5.5.0 or implement the future visual/multilingual proposal.
- Do not change unrelated application behavior or documentation.
- Preserve the owner's existing acceptance results and test package.

## Completion report to ChatGPT

Provide root cause; exact branch and base commit; resulting commit hash; exact files changed; automated test commands and full results; evidence that disabled logic is real and all activation paths are blocked before review; five-palette and light/dark verification; confirmation the intentionally dark compiled-prompt area was preserved; 631-change workflow results before/after Show all and whether disposable installation was actually tested; remaining limitations and tests not run; and one recommended next action.

Do not claim the owner acceptance test passes. ChatGPT will review the evidence; the owner will retest Test 4 on a fresh copy.

After reporting, stop and wait. No merge or release action is authorized.