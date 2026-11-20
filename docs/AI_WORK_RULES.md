# AI Work Rules — AI Prompt Builder Hub

These rules apply to ChatGPT, Claude, Claude Code and any other AI-assisted contributor. Read [PROJECT_CONTROL.md](../PROJECT_CONTROL.md), [ROADMAP.md](../ROADMAP.md), [CURRENT_STATUS.md](CURRENT_STATUS.md), [REGRESSION_CHECKLIST.md](REGRESSION_CHECKLIST.md) and [contributing.md](../contributing.md) before changing code.

## 1. Read before writing

- Inspect the live repository, default branch, recent commits, active branches and open pull requests.
- Read the current source file and relevant project documents. Do not rely on a stale upload or chat summary when GitHub has newer content.
- If another agent may have unfinished work, inspect its actual workspace and ask for a handoff. Never assume that work is absent because it is not on the default branch.
- Report the current state before making a change when the starting point is uncertain.

## 2. Protect the product principles

- Free chatbot tiers are the baseline. A paid subscription must never be a prerequisite for using the app or contributing with AI assistance.
- Keep the app chatbot-independent and understandable to non-coders.
- Preserve the standalone, zero-dependency HTML architecture unless the owner explicitly approves a change.
- Do not turn the product into a full context repository/packer without an explicit scope decision.
- Be honest about capability, quota, model, feature and regional uncertainty. Prefer official provider documentation; record verification dates and links. Mark conflicting or unverified claims rather than guessing.

## 3. Preserve existing behaviour

- Make the smallest change that satisfies the task.
- Do not remove, rename or silently alter existing features, storage keys, preset identifiers, migration history or user data formats without an explicit compatibility plan.
- Preserve the clean-source export/reset hygiene described in `contributing.md`.
- Escape dynamic content, validate imported data and keep keyboard accessibility and visible focus states.
- Keep all essential app functionality available without external dependencies or a paid service.

## 4. Work safely in Git

- Use a dedicated, descriptive branch for each logical task.
- Never push directly to `main` unless the owner explicitly requests it.
- Do not overwrite or force-update a branch without checking its current head and obtaining approval.
- Use clear Conventional Commit messages, for example:
  - `feat: add guided prompt path`
  - `fix: keep split messages in sync`
  - `docs: update project handoff`
  - `test: add prompt transfer checks`
- Open a pull request with a concise summary, changed files, tests performed, known limitations and any manual checks still needed.
- Actual Git version tags are for reviewed releases only. Do not create a release tag for ordinary documentation commits.

## 5. Test and report honestly

- Run JavaScript syntax checks and the regression checklist where possible.
- Open the app in a real browser and test the changed workflow; test desktop and mobile layouts for UI changes.
- Check offline and downloaded-file behaviour when a change affects loading, dependencies or the single-file promise.
- Report tests as **passed**, **failed**, **not run** or **not applicable**. Never imply that code was browser-tested when only static inspection occurred.
- Include exact branch, commit SHA, PR link, changed files, test evidence and remaining risks in the handoff.
- Return the complete updated `index.html` when a task changes the app source; do not return a partial replacement.

## 6. Keep work bounded

- One primary implementation task at a time.
- Capture additional ideas in `docs/IDEA_INBOX.md`; do not silently expand the current task.
- If a requested change conflicts with the architecture, free-first philosophy, reliability or accessibility, explain the trade-off and propose a smaller alternative.
- Ask the owner when product intent or an irreversible decision is unclear.

## 7. Repository task briefs and Claude Code shorthand

- For the current v5.4.0 closeout, the canonical, owner-approved bounded task is `docs/CLAUDE_TASK.md` (currently executed and awaiting review). These management documents live on `docs/project-control-baseline` until PR #1 is approved for merge; read them from that branch and do not duplicate them onto others.
- In Claude Code, invoke the repository slash command `/pb-v54`, defined by `.claude/commands/pb-v54.md`. It must read the canonical task file and execute it; it is not permission to ignore newer owner instructions.
- Always re-check the live branch head and local workspace before executing a saved task brief. Treat recorded SHAs as historical checkpoints, not overwrite targets.
- If the task file conflicts with a newer owner instruction or live repository state, stop and ask rather than guessing.
- Do not treat task-file presence as approval to merge, publish, deploy, or modify `main`.

## 8. Session continuity

Follow the **Session Continuity & Context Protection Protocol** in [PROJECT_CONTROL.md](../PROJECT_CONTROL.md): treat the repository as authoritative over recollection, checkpoint at task boundaries, label every claim (verified, Claude-reported, independently reviewed, owner-tested), prepare a short resume prompt before a session becomes unwieldy, name exactly one next action, and never claim background monitoring or updates that have not happened.

## 9. Definition of done

A task is not complete merely because code was generated. It is complete when:
- The change is saved on the intended branch.
- Existing functionality is preserved or migration is documented.
- Relevant tests have been run and results reported.
- Documentation and project status match the actual result.
- A reviewable handoff or pull request is available.
- The checkpoint in `docs/CURRENT_STATUS.md` matches the actual commits, test evidence and next action.
