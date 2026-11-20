# Contributing to AI Prompt Builder Hub

This tool is built to be improved by ordinary people **using free AI chatbots**. You do not need to code, use Git, or edit JSON by hand. The app has a built-in **Dev Bay** that packages everything a chatbot needs, and the chatbot does the editing.

There are three ways to help, from easiest to most involved.

---

## 1. Tell us something is out of date (no tools needed)

Free chatbot plans change constantly, so the chatbot list is the part most likely to go stale.

1. Open the app, pick the chatbot, and find the command or note that looks wrong.
2. Click **Suggest a correction** next to it. A ready-made note is copied to your clipboard.
3. Paste it into any chatbot (or into a GitHub issue) and add what you see in the app.

Grey chips in the app show commands that are unverified or in conflict between sources, and anything not checked for more than 60 days. A chatbot's note also shows its last-checked date and whether it comes only from a research document. Those are the best items to look at first.

---

## 2. Refresh the chatbot catalog with any chatbot (about 5 minutes)

The chatbot cards, free-plan notes and commands live in a small **catalog** (`catalog.json`, also built into `index.html`). To refresh it:

1. Scroll to **Dev Bay > Chatbot catalog**.
2. Pick the chatbot you will use (any of the nine works) and click **Package catalog only**. A short request plus the current catalog is copied and the chatbot opens. Long packages are split into numbered parts automatically.
3. Paste it in. Ask the chatbot to browse for current information if it can.
4. When it replies with the new catalog, copy the whole reply and click **Import catalog**, paste, and click **Validate & preview changes**.
5. Read the list of changes. If they look right, click **Install and reload**. If the catalog has a problem the app tells you in plain English and installs nothing.
6. Optional, to share it: click **Download catalog.json** and submit it (see "Sharing your update" below).

Rules the chatbot is asked to follow: keep the same JSON shape, raise `rev` by 1, set `updated` to today, and for every item it actually checked set `v` (date) and `st` (`confirmed`). Anything it could not check should stay marked `doc` or `unverified`, and sources that disagree get `conflicting`. Honest grey chips are better than false confidence.

**Use any chatbot, but check its work.** A chatbot that cannot browse will guess. The preview shows exactly what changed before anything is installed.

---

## 3. Change the app itself with any chatbot

1. Scroll to **Dev Bay** and click **Initialize code modification sequence**.
2. Choose the chatbot, describe the change you want, and say why. Click **Generate package**.
3. Pick the route that suits that chatbot:
   - **Copy package & launch**: copies the package (split into parts if the chatbot's paste limit is small) and opens the chatbot.
   - **Download clean .html**: gives you the app file to attach. Tick **Include change request in .html** to embed your request in the file, and use **Copy "paste this first" prompt** for the one-line instruction to send with it.
4. Save the complete `.html` the chatbot returns, open it in your browser, and test it (checklist below) before sharing it.

If the chatbot stops mid-file, reply `continue` until it reaches the closing `</html>`.

---

## Rules every revision must follow

1. **Zero external dependencies.** One standalone `index.html`. No CDNs, no npm, no build step, no external stylesheets or scripts.
2. **Free-tier first.** Design for free plans (a free account where uploads, history or connectors need one). Tag every command in the catalog with an accurate `tier` (`free`, `account`, `limited`, `paid`) and `kind` (`type`, `ui`, `ask`). Keep paid items clearly badged as paid.
3. **Explicit metadata, not text matching.** Use explicit `bots: [...]` arrays on pills or select options so `applyFilters()` can hide unsupported items. Never filter by matching words in a prompt.
4. **Keep `getCleanSource()` clean.** It builds Dev Bay packages from a snapshot taken at page load and `hardReset()` returns everything to its default state. If you add overlays, modals, dynamic containers (`[data-render]`) or form controls, make `hardReset()` reset them. Never read `localStorage` (presets, saved catalog, layout, theme) inside `getCleanSource()`. It embeds the active catalog from memory.
5. **Safe rendering and accessibility.** Escape dynamic strings with `esc()`. Keep keyboard use (`Tab`, `Enter`, `Space`, `Escape`), ARIA roles and attributes, and visible focus outlines.
6. **Do not fetch anything automatically.** The only network request the app itself makes is the catalog check the user starts by clicking a button. Nothing is fetched on page load, and nothing the user typed is sent anywhere by the app. The app must work offline from a downloaded file.
7. **Increment the version log.** Update `currentVersion` in the `IMMUTABLE CODE METADATA & VERSION MIGRATION HISTORY LOG` comment and append a new entry (version, bot, date, change, why, and a `freshnessCheck` saying what was confirmed, removed or could not be verified). Never edit or delete older entries.
8. **Emit the complete file.** From `<!DOCTYPE html>` to `</html>`, with no `// rest of code unchanged` placeholders.

## Catalog fields (for reference)

| Where | Field | Meaning |
|---|---|---|
| top level | `rev`, `updated` | Catalog revision (whole number) and date (`YYYY-MM-DD`) |
| `CHATBOTS[]` | `name`, `maker`, `url`, `color`, `limit` | Card details and safe paste budget in characters |
| `CHATBOTS[]` | `blurb`, `brief`, `best`, `free` | Short card text, task fit, and the free-plan note |
| `BOT_NOTES` | one text per chatbot | How that chatbot's commands work |
| `BOT_CMDS[bot][]` | `g`, `k`, `tier`, `t`, `l`, `w`, `d`, `f` | Group, kind, free-tier badge, text added to the prompt, label, where to find it, description, optional fill-in boxes |
| any item | `v`, `st` | Date last checked and status: `confirmed`, `doc`, `conflicting`, `unverified` |

The app validates every catalog before using it, and only known fields are kept.

## Smoke test before you share a new version

- Opens with no errors in the browser console.
- Every chatbot card switches, the Bot Commands list and notes change, and the paste limit updates.
- A prompt compiles, and a very long prompt splits into parts on a small-budget chatbot (Perplexity or Copilot).
- A preset saves, loads, exports and imports.
- **Check for newer catalog**, **Import catalog** (diff shown, nothing installed until you confirm) and **Use built-in catalog** work.
- **Generate package** and **Download clean .html** produce a file with no typed text or saved presets in it.
- Light and dark themes, palettes, and the section pin/reorder controls still work.

## Sharing your update

- **Catalog only:** open a GitHub issue or pull request with the downloaded `catalog.json`.
- **Whole app:** attach the new `.html`, and say which chatbot made it and what the version log says it changed.

## Maintainer release steps

1. Save the new file as `index.html` in the repository root, and put the previous version in `archive/` (for example `archive/prompt_builder_v5_3_1.html`).
2. Update `catalog.json` in the root. It must match the catalog block inside `index.html`: use **Download catalog.json** from the new build.
3. Update the version numbers in `readme.md`, and add a release under **Releases** with the `.html` attached.
