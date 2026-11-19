# Contributing & AI Code-Migration Rules

Thank you for helping improve **AI Prompt Builder & Code Migrator**! Because this project is maintained by both human contributors and AI chatbots via the built-in **Dev Bay**, please follow these rules so every revision stays reliable and self-contained.

---

## Core Design Rules

1. **Zero External Dependencies:** Keep the application in a single standalone `.html` file (`index.html`). Do not introduce external CDNs, npm build pipelines, frameworks, or external stylesheets/scripts.
2. **Free-Tier & Free-Account Baseline:**
   * Design features, character budgets, and command descriptions for users on **free chatbot tiers** (assuming users will sign into free accounts where needed for uploads, history, or connectors).
   * Tag every new command in `BOT_CMDS` with an accurate `tier` (`free`, `account`, `limited`, or `paid`) and `kind` (`type`, `ui`, or `ask`).
3. **Explicit Metadata Filtering Only:**
   * Do not filter commands by matching substrings in prompt wording.
   * Use explicit `bots: [...]` arrays on pills or select options (`option[5]`) so `applyFilters()` can hide unsupported items cleanly.
4. **Preserve `getCleanSource()` Hygiene:**
   * The app captures `PRISTINE_HTML` at load time and cleans a detached DOM copy via `hardReset()` when generating Dev Bay modification packages.
   * If you add new UI overlays, modals, dynamic containers (`[data-render]`), or form controls, ensure `hardReset()` resets them back to their clean default state.
   * Never read `localStorage` (such as user presets) inside `getCleanSource()`.
5. **Safe Rendering & Accessibility:**
   * Escape all dynamic strings inserted into HTML templates with `esc()`.
   * Keep keyboard navigation (`Tab`, `Enter`, `Space`, `Escape`), ARIA roles/attributes (`role="tablist"`, `aria-selected`, `role="radiogroup"`), and focus outlines intact.

---

## Rules for AI-Assisted Revisions (Dev Bay)

When using an AI chatbot to generate a new version of the `.html` file:

* **Increment the Version Log:** Update `currentVersion` in the top `IMMUTABLE CODE METADATA & VERSION MIGRATION HISTORY LOG` comment block and append a new JSON entry describing the bot, change, and reason.
* **Emit the Complete File:** Always require the AI to output the **entire runnable `.html` file** from `<!DOCTYPE html>` to `</html>` with zero omitted sections or `// rest of code unchanged` placeholders.
* **Smoke Test Before Merging:** Open the generated file in a browser and verify bot switching, prompt compilation, auto-splitting, preset save/load, and Dev Bay export before publishing.