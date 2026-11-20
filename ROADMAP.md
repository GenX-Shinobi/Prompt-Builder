# AI Prompt Builder Hub — Roadmap

This roadmap describes direction, not a promise that every proposed feature will ship. The free-use-first principles in [PROJECT_CONTROL.md](PROJECT_CONTROL.md) govern every stage.

## Product north star

Make it easy for an ordinary person to get a useful result from the AI chatbot they can access. The app should help them decide **which AI to use**, **what to ask**, **what context to include**, and **how to transfer the prompt**—without requiring a paid AI subscription or coding knowledge.

## Now — recover, stabilise and document v5.4.0

- Recover Claude's actual working state before restarting or overwriting anything.
- Confirm the source version, branch, changed files and what has or has not been tested.
- Complete the agreed catalogue separation only if the working state supports it:
  - standalone catalogue file with per-entry freshness/source/status metadata;
  - embedded fallback so the app still works offline or when fetching fails;
  - validation and safe failure behaviour that preserves the last known-good catalogue;
  - Dev Bay packages that identify the catalogue snapshot and freshness information they include.
- Consider validated preset import/export and catalogue import/export within the agreed v5.4 scope.
- Keep the app self-contained, dependency-free and usable as a downloaded HTML file.
- Correct documentation to describe the shipped product, not planned features.
- Run the regression checklist and browser smoke tests before calling the release complete.

**Status:** Planned work; implementation status must be recovered from the actual Claude workspace and repository before proceeding.

## Next — first-use experience and Guided Path

Design and test a guided prompt-building route for people who do not know prompt terminology. The user describes their goal in ordinary language; the app asks only useful follow-up questions and produces a prompt using the same underlying compiler as the advanced builder.

Candidate starting areas:
1. Work and productivity
2. Research and learning
3. Writing and communication
4. Career and employment
5. Shopping and decisions
6. Creative projects
7. Technology and coding
8. Everyday life and hobbies

Acceptance direction:
- A first-time user can complete a useful prompt without help.
- The guided route and advanced builder produce compatible, editable prompts.
- No paid chatbot feature is required.
- Users can still choose their own chatbot and edit the result.
- The flow stays compact and avoids overwhelming users with forms or jargon.

## Later — practical quality improvements

Promote these only when evidence, testing or user feedback justifies them:

- A chatbot/task recommender that explains trade-offs and distinguishes free, account-required, limited and paid capabilities.
- Clear catalogue freshness indicators, official source links and explicit confirmed/conflicting/unverified states.
- Reusable task loadouts for common workflows.
- Better attachment previews and clearer distinction between text embedded in the prompt and files the user must upload separately.
- More reliable token/character estimates and safer Unicode-aware prompt splitting.
- Session checkpointing for long multi-part conversations.
- Preset import/export and optional settings portability, if not completed in v5.4.

## Parked / not current scope

- Full folder/repository-scale context packing.
- Cloud accounts, synchronisation or a backend.
- Mandatory subscriptions, provider lock-in or paid AI-only workflows.
- Framework/build-system migration or external runtime dependencies.
- Large feature additions before core reliability and first-use usability are demonstrated.

## Release gates

A release is ready for review only when:
- The version and migration history are updated.
- The README and status accurately describe the release.
- Free-tier assumptions and chatbot claims are dated and sourced or clearly marked uncertain.
- Existing features pass the regression checklist.
- The app is tested in a browser at desktop and mobile widths.
- Offline/downloaded-file behaviour is checked where applicable.
- The complete standalone HTML is preserved and can be opened without a build step.
- Known limitations and unverified items are disclosed.

## How to change this roadmap

Ideas are welcome at any time. Capture them in [docs/IDEA_INBOX.md](docs/IDEA_INBOX.md). The project manager proposes placement and trade-offs; the owner decides whether an idea becomes active scope.
