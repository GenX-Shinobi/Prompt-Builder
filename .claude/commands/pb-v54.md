# /pb-v54 — Execute the v5.4.0 corrective task

Read `docs/CLAUDE_TASK.md` in full and execute its instructions exactly.

Before editing, inspect the live GitHub repository state and this local workspace. Preserve newer or unrelated work. Work only on `release/v5.4.0`, within the task scope. Do not modify `main`, merge, force-push, publish, deploy, open a PR, or start v5.5.0.

The management documents live on branch `docs/project-control-baseline` (draft PR #1) until the owner approves merging it, so they may be absent from the checked-out branch. Read them with `git fetch origin` then `git show origin/docs/project-control-baseline:docs/CLAUDE_TASK.md`, or use a separate worktree; do not copy them onto the release branch. If the brief says its work is already complete, verify and report rather than repeat it.

If the task file is missing from every branch, stop and report that rather than guessing. If any instruction conflicts with newer owner direction or repository state, stop and ask.
