# AI Prompt Builder Hub — Roadmap

The free-first, chatbot-independent mission and project scope in [PROJECT_CONTROL.md](PROJECT_CONTROL.md) govern this roadmap. Proposed work is not a commitment until approved by the owner. Current state: [docs/CURRENT_STATUS.md](docs/CURRENT_STATUS.md). The completed v5.4.0 release plan is recoverable through [docs/ARCHIVE_INDEX.md](docs/ARCHIVE_INDEX.md).

## Released

- **v5.4.0** — formally released 2026-11-21: https://github.com/GenX-Shinobi/Prompt-Builder/releases/tag/v5.4.0 (tag at `97531983b26b7e00be78a8200284d7897a97b864`). Released with disclosed testing limitations (see [docs/CURRENT_STATUS.md](docs/CURRENT_STATUS.md)).

## Authorized progression

- **Active:** PB-550-01 Guided Path test build and review under the Owner's bounded approval. [Issue #11](https://github.com/GenX-Shinobi/Prompt-Builder/issues/11) and [draft PR #12](https://github.com/GenX-Shinobi/Prompt-Builder/pull/12) track the work. v5.5.0-test.4 is ready for deferred Owner desktop browser acceptance.
- **Separate authorization required:** further implementation, tester distribution, merge, deployment, release, archive tags, branch retirement, and CHIMERA work.

## Backlog — follow-up candidates (not scheduled, not authorized)

- Real-device mobile/touch, Firefox/Safari, screen-reader and manual colour-contrast checks (disclosed as untested in v5.4.0).
- Header controls overlap the small heading text at widths of about 600 px or less.
- Chatbot note under the chatbot cards is unstyled.
- In-file version log lacks a separate entry for the final locked-button correction.
- GitHub Release notes for v5.4.0 contain a malformed double-bracket link to the online app (the release is marked immutable; whether it can be edited is unconfirmed).
- Evidence preservation and branch housekeeping (see [docs/ARCHIVE_INDEX.md](docs/ARCHIVE_INDEX.md)).

## NEXT — roadmap reassessment (proposal)

Reassess the next milestone from user evidence and the idea inbox. Use Guided Path acceptance and tester feedback to inform the next milestone. A separate visual, accessibility and multilingual finishing phase remains a proposal.

## LATER — evidence-led improvements

- Task/chatbot recommendations with clear free/account/limited/paid distinctions.
- Better attachment previews and clearer manual-upload guidance.
- More reliable token/character estimates and Unicode-safe splitting.
- Session checkpointing and reusable task loadouts.
- Optional preset/settings portability improvements if not already delivered.

## LATER — project-management improvements (owner-requested; not active)

**Future infrastructure ideas only — not active work, not approved.** To be started only as a separate owner-approved task: a general `/resume-project` command; a four-layer project-memory architecture; project agents; communication/transfer shorthand and transfer-integrity safeguards; and efficiency improvements to the working process. None is a commitment.

## Future finishing round-up — proposal only

Consider a separate owner-approved finishing phase to improve visual consistency, extend the existing colour palettes across more of the page, and add multilingual support with accessibility as a design requirement. Preserve deliberate visual choices—including the compiled-prompt area's dark treatment in light mode—unless usability evidence supports changing them. Consider translation architecture, longer strings, non-Latin scripts and right-to-left layouts. Future proposal, not current work.

## PARKED / outside current scope

- Full folder/repository-scale context packer.
- Cloud accounts, synchronisation or hosted prompt storage.
- Provider lock-in, paid-only core workflows or mandatory subscriptions.
- Framework/build-system migration or runtime dependencies.
- Large feature expansions before core reliability and first-use usability are proven.

## Release gates (apply to every release)

- Version and migration history consistent.
- README and status accurately describe the actual release.
- Existing behaviour passes regression checks.
- Automated test output is recorded, not merely claimed.
- Desktop and mobile browser acceptance completed.
- Offline/downloaded-file behaviour checked where promised.
- Standalone HTML remains complete and dependency-free.
- Known limitations disclosed.
- Owner explicitly approves release.

## Separate initiative boundary — CHIMERA

CHIMERA (https://github.com/GenX-Shinobi/CHIMERA) is a separate open-source workforce-framework project. Prompt Builder may be considered as its first adopter only when the owner authorizes a separate integration milestone. Prompt Builder improvements beyond PB-550-01 remain backlog and may serve as CHIMERA pilot material under a separate, explicitly approved plan. This is not an active roadmap item. Do not combine project files, statutes or memory.
