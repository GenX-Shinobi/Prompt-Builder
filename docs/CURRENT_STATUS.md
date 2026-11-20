# Current Status

> Update this file at every meaningful handoff. This is a dated snapshot, not a live connection to the repository.

**Last checked:** 2026-11-20  
**Repository:** https://github.com/GenX-Shinobi/Prompt-Builder  
**Default branch:** `main`  
**Default-branch application version:** `5.3.1`  
**Latest main commit observed:** `09d60606936b3c08394f72f3bdd586f494b7625f` — "Update index.html to ver_v5_3_1"

## Verified on GitHub at this check

- `index.html` exists on `main`; source declares `currentVersion: "5.3.1"`.
- `index.html` blob SHA: `fbcf3b5bad0461c660750a74ac9a8e717df53e79`.
- `readme.md` exists (lowercase filename) and still described v5.2.0, so it needs alignment.
- `contributing.md` exists.
- `catalog.json`, `PROJECT_CONTROL.md` and `ROADMAP.md` did not exist on `main` at the time of this check.
- Only `main` was returned by the branch search at that time.
- Recent commits show v5.3.1 as the latest application update. Earlier commits added archive material and project PDFs.

## v5.4.0 recovery — unresolved

Claude had reported beginning v5.4.0 work to extract the chatbot catalogue into a separate JSON file, then paused due to usage limits. The actual state of Claude's local workspace, unsaved changes or any branch not visible to GitHub has **not** been verified.

Do not interpret the absence of `catalog.json` on `main` as proof that no work exists. Before restarting:
1. Inspect Claude's actual workspace and branch.
2. Identify changed, uncommitted and saved files.
3. Compare with current GitHub `main`.
4. Preserve work and report what is complete, incomplete and untested.
5. Resume from the actual state, not an old uploaded source file.

## Application capabilities observed from the v5.3.1 source/review

- Nine chatbot choices.
- Two main command tabs: Bot Commands and Prompt Craft.
- Prompt compilation and size estimates.
- Automatic prompt splitting.
- Text/file/image attachment workflow.
- Local browser presets.
- Dev Bay code-migration package and clean HTML export.
- Light/dark theme, colour palettes and movable/pinnable sections.

This list is a summary, not a fresh end-to-end functional test.

## Tests performed for this status entry

- Read the current `index.html`, `readme.md` and `contributing.md` from GitHub.
- Checked recent commits and searched branches.
- Confirmed the version string in the application source.

## Tests not performed

- No browser launch or interactive smoke test.
- No mobile/responsive test.
- No automated JavaScript test suite run.
- No offline/file-URL test.
- No test of Claude's local v5.4.0 workspace.
- No v5.4.0 release verification.

## Next action

Recover Claude's real v5.4.0 working state and reconcile it with GitHub before assigning further application changes. Then update this file with the exact branch, commit, files, tests and handoff.
