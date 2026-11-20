# AI Prompt Builder Hub — Project Control

> **This is the continuity file.** At the start of a new ChatGPT or coding-agent session, read this file first, then the linked supporting documents and the live repository state. Update it whenever an important decision, task, status, or handoff changes.

**Repository:** https://github.com/GenX-Shinobi/Prompt-Builder  
**Application:** AI Prompt Builder Hub  
**Current version on `main` at last check:** 5.3.1  
**Last repository check:** 2026-11-20  
**Project owner:** GenX-Shinobi  
**Project management:** ChatGPT, working with the owner's direction and final approval

## Resume this project

Use this instruction in any new conversation:

> Resume AI Prompt Builder Hub. Read `PROJECT_CONTROL.md` and the supporting project files from GitHub. Check the actual repository state, branches, recent commits and any open pull requests before making recommendations. Restore the current priorities, active work, decisions and next action. Do not assume an earlier chat summary is more current than GitHub. Preserve unfinished work and ask before overwriting or merging anything.

## Mission

Help ordinary people turn unclear thoughts, questions and goals into useful prompts for whichever AI chatbot they can access. Make it easier to choose an appropriate chatbot, explain what they need, prepare supporting context, and transfer the finished prompt reliably.

The project began with a practical need: finding the right AI for a task and constructing a prompt that gets a useful result. It is not limited to software development. Everyday problems, learning, writing, research, decisions, hobbies and gameplay roadblocks (including the owner's use while playing Grounded 2 on PlayStation 5) are valid examples.

## Non-negotiable principles

1. **Free-use first.** The free chatbot experience is the design baseline. Paid plans may be described where useful, but must never be required to use, understand, contribute to or benefit from this project.
2. **Chatbot-independent.** Help people choose and use the AI that fits their task; do not lock the project to one provider.
3. **Accessible to non-coders.** Plain language, guided workflows and AI-assisted editing. Users should not need to hand-edit JSON or understand the source code.
4. **Open, portable and self-contained.** Preserve the zero-dependency, single-file HTML application unless the owner explicitly approves a change to that architecture.
5. **Useful before clever.** Prioritise clear outcomes, reliability and reduced friction over feature count.
6. **Honest about changing AI services.** Label access requirements and uncertainty. Record verification dates and credible sources; never present estimates or rumours as guarantees.
7. **Owner has final say.** ChatGPT manages, organises, recommends and reviews. The owner decides product direction and approves releases.

## Product definition and scope

The product is primarily a **prompt builder** with lightweight context preparation and transfer management.

- Core: chatbot choice, bot-specific commands, universal Prompt Craft, prompt compilation and task shaping.
- Supporting layer: source text and attachments, size awareness, prompt splitting, copying/launching, local presets and Dev Bay handoff.
- Not the current goal: a full folder/repository-scale context packer, knowledge-base manager or complex multi-file platform.
- Keep the first-use experience obvious: a new user should be able to open the app, understand what to do, create a useful prompt and take it to an AI without assistance.

## Current known baseline

The default branch was checked on 2026-11-20:
- `main` points to application version **5.3.1**.
- The app is a standalone `index.html`; no `catalog.json` was present on `main` at that check.
- The existing app includes nine chatbot choices, Bot Commands and Prompt Craft, prompt compilation, character/word/token estimates, splitting, attachments, local presets, Dev Bay, themes and layout customisation.
- The root README was behind the application and still described v5.2.0; a documentation update is being proposed separately.
- The only branch visible during that check was `main`. Claude's possible local or unsaved v5.4.0 work cannot be inferred from GitHub. **Inspect Claude's actual workspace and any newly created branches/commits before restarting or replacing that work.**

These are a dated snapshot, not a claim that no newer local work exists. Always re-check GitHub before acting.

## Active work and immediate priorities

### Active: recover and stabilise v5.4.0

The planned v5.4.0 work concerns separating chatbot catalogue data into `catalog.json`, keeping an embedded offline fallback, freshness metadata, safe catalog validation/import, and preset/catalog export-import improvements. This is a plan, not a verified implementation.

Before continuing:
1. Inspect the actual Claude workspace, branch, current files and uncommitted changes.
2. Compare that state with the live repository and preserve all useful work.
3. Identify exactly what is complete, incomplete and tested.
4. Agree the safe source branch and next bounded task.
5. Do not regenerate v5.4.0 from an old v5.2.0/v5.3.0 snapshot or overwrite unfinished changes.

### After v5.4.0 is recovered

- Complete the smallest reliable v5.4.0 scope.
- Verify the app online, offline and as a downloaded `file://` HTML file where relevant.
- Review chatbot command accuracy and freshness labels.
- Run the regression checklist.
- Update README, roadmap, status and migration notes to match what actually shipped.

### Next major product milestone

Explore a **Guided Path** that helps a first-time user describe what they are trying to do and builds a prompt using the same compiler as the advanced builder. Candidate task areas: work/productivity, research/learning, writing/communication, career, shopping/decisions, creative projects, technology/coding and everyday life. This is a proposal, not an approved implementation scope. Validate usability before expanding it.

## Working method

- The owner can submit ideas in any order and at any level of detail. Capture first; prioritise later.
- ChatGPT maintains the idea inbox, roadmap, status and coding-agent briefs.
- Keep one primary implementation task active at a time.
- Coding agents work from the live repository on a dedicated branch, preserve existing behaviour, test, and report exact files/commits/results.
- Prefer small, reviewable changes and one coherent commit per logical documentation or code task.
- Use Conventional Commit prefixes: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`. Use actual Git version tags for reviewed releases, not for every documentation commit.
- Never claim a test, browser check, upload or release happened unless it was actually performed.
- Do not merge to `main` or publish a release without the owner's approval.

## Supporting project files

- [Roadmap](ROADMAP.md) — priorities and staged direction.
- [Idea inbox](docs/IDEA_INBOX.md) — uncensored idea capture and triage.
- [Current status](docs/CURRENT_STATUS.md) — dated technical state and handoff.
- [AI work rules](docs/AI_WORK_RULES.md) — instructions for coding agents.
- [Regression checklist](docs/REGRESSION_CHECKLIST.md) — repeatable acceptance tests.
- [Contributing rules](contributing.md) — existing project-specific code conventions.
- [Project documents](docs/) — source guides and historical reference material.

## Handoff update rule

At the end of each meaningful work session, update:
1. `CURRENT_STATUS.md` with the actual repository state and tests.
2. `PROJECT_CONTROL.md` with the active task, decisions and next action.
3. `ROADMAP.md` if priorities or scope changed.
4. `IDEA_INBOX.md` when ideas were added, promoted or postponed.

A handoff is complete only when another session can resume from these files without needing the previous conversation.
