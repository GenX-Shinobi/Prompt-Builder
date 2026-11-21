# AI Prompt Builder Hub

*Also known as AI Prompt Builder & Code Migrator.*

A free-first, chatbot-independent prompt builder for everyday people, designed by a non-coder for fellow non-coders. Turn an unclear question, idea or task into a useful prompt, choose an AI chatbot that fits, prepare relevant context and hand it over, without coding skills, developer tools or a paid AI subscription.

The application is one standalone HTML file with no build step, no external libraries and no server. It is open source, and it is designed so that the same AI chatbots it helps you use can also edit it.

## Try it

- **[Open the live app](https://genx-shinobi.github.io/Prompt-Builder/)** (GitHub Pages)
- **[View or download index.html](index.html)** and double-click it to run it offline
- **[Browse older versions](archive/)**
- **[Browse project documents](docs/)**

Which version do you have? The current build is **v5.4.0**. It is the version on the `main` branch and in the live app. It passed the project's automated browser tests on GitHub Actions (187 checks) and the owner's six browser acceptance tests. It is **not yet formally released**: there is no v5.4.0 tag or GitHub Release yet, and some release checks (real phones and tablets, screen readers, Firefox and Safari) are still outstanding. The version is recorded in the comment block at the top of `index.html` (`currentVersion`).

![AI Prompt Builder Hub v5.4.0 as it first opens on a desktop browser](Preview.jpg)

*v5.4.0 as it first opens on a desktop browser (default light theme, nothing saved yet), shown as a full-page capture.*

## Core principles

- **Free-use first:** designed around free chatbot plans, with account requirements, limited quotas and paid-only features clearly labelled. Paid plans are optional, never a prerequisite.
- **Chatbot-independent:** supports choice rather than lock-in.
- **Accessible:** plain language and workflows that make sense to non-coders.
- **Portable:** standalone HTML, no external libraries, no build process, works offline.
- **Honest:** chatbot features, model access and quotas change. Paste budgets are conservative estimates, not official provider limits, and uncertain information is marked rather than presented as fact.
- **Open and AI-editable:** the built-in Dev Bay packages a change request and a clean copy of the app for any chatbot to revise.

## What the app does today (v5.4.0)

- **Nine chatbot choices:** ChatGPT, Gemini, Claude, Perplexity, Grok, Microsoft Copilot, DeepSeek, Meta AI and Mistral. Each card has task-fit guidance, a free-plan note and a conservative paste budget.
- **Bot Commands:** typed commands, switches and modes that differ per chatbot. Each carries a free-tier badge (`Free`, `Free w/ account`, `Limited quota`, `Paid plan`), and you can hide paid-plan-only commands.
- **Prompt Craft:** prompt-shaping tools that work with any chatbot: the brief, output shape, thinking and checking, accuracy, research, writing, persona and tone, and tech.
- **Core prompt and attachments:** drag, browse or paste files and screenshots. Small text files (up to 1 MB) can be inlined; images and larger files are staged locally with upload reminders.
- **Automatic multi-part splitting** when a prompt exceeds the selected chatbot's paste budget. Each part is acknowledged ("Received part N") and the chatbot starts work only after the final part.
- **Presets** saved in your browser, with export and import to back them up or share them.
- **Dev Bay:** prepares an AI-assisted change to the app itself and can download a clean `.html` copy. It also has the chatbot catalog tools below.
- **Freshness labels:** every chatbot card and command carries a last-checked date and a status (confirmed, doc-only, conflicting or unverified). Grey chips mark commands that are unverified or in conflict, and anything not checked for 60 days. No chip does not mean confirmed: commands taken only from a research document stay chip-free until they are 60 days old.
- **Chatbot catalog tools:** the chatbot data is also published as [catalog.json](catalog.json). You can ask any chatbot to refresh it, review exactly what would change, and install it (see below).
- **Light and dark themes, colour palettes and section pin/reorder controls.**

Feature availability and chatbot quotas change by account, region and date. The table shows the catalog as shipped (revision 1); treat the budgets as estimates and check each card's free-plan note and last-checked date.

| Chatbot | Best for (from the catalog) | Paste budget (characters) |
|---|---|---|
| ChatGPT | All-rounder for writing, coding and ideas | about 24,000 |
| Gemini | Google apps and multimodal work | about 60,000 |
| Claude | Long documents, careful writing and code | about 60,000 |
| Perplexity | Web research with cited sources | about 8,000 |
| Grok | Current topics, tied to X | about 24,000 |
| Microsoft Copilot | Windows and Edge users; a free fallback bot | about 8,000 |
| DeepSeek | Free reasoning, coding and maths help | about 30,000 |
| Meta AI | Quick everyday prompts in WhatsApp and Instagram | about 8,000 |
| Mistral | Le Chat / Vibe: a solid non-US alternative | about 24,000 |

## Quick start

1. Open the [live app](https://genx-shinobi.github.io/Prompt-Builder/) or download [index.html](index.html) and double-click it.
2. **Step 0:** choose your chatbot. This sets its paste budget and filters the commands to what it supports.
3. **Step 1:** pick options in **Bot Commands** and **Prompt Craft**, and fill in any `[bracketed]` boxes that appear.
4. **Step 2:** enter your task and any context or attachments.
5. Optionally save the setup in **Saved presets**.
6. Review the compiled prompt and size estimate, then click **Copy & launch** to copy it (or Part 1 of a split) and open your chosen chatbot in a new tab.
7. Review the answer and refine your prompt as needed.

The local file builds prompts without a server, installation or internet connection. Opening a chatbot's website, and checking for a newer catalog, naturally need a connection.

## Improve the app with AI (Dev Bay)

1. In **Dev Bay**, click **Initialize code modification sequence**.
2. Choose the target chatbot, describe the change you want and why, then click **Generate package**.
3. Use **Copy package & launch** (long packages are split to fit the chatbot's budget) or **Download clean .html** to attach the file. **Include change request in .html** embeds your request, and **Copy "paste this first" prompt** gives the one-line instruction to send with it.
4. Paste or attach it in the chatbot. The package asks the chatbot to check that commands and features are current before returning the complete updated `.html`.
5. Save the returned file and **test it in your browser** before sharing. AI-generated changes are not automatically verified.

Before changing anything, read [contributing.md](contributing.md) and [docs/AI_WORK_RULES.md](docs/AI_WORK_RULES.md).

## Refresh the chatbot catalog

1. In **Dev Bay > Chatbot catalog**, click **Package catalog only** to send the current catalog and a refresh request to any chatbot, or click **Check for newer catalog** to look for the latest published `catalog.json`.
2. Paste the reply into **Import catalog** and click **Validate & preview changes**. The app checks the catalog and lists every change installing would make. Changed wording shows before and after, and anything added or removed (commands or whole chatbots) opens to show its complete record. Over 500 changes, **Install and reload** stays off until you have chosen to show them all.
3. Click **Install and reload** only if the changes look right, or **Cancel** to install nothing. **Use built-in catalog** undoes an install.

Nothing is fetched unless you click **Check for newer catalog**.

## Privacy and local storage

- **Client-side:** your prompts, attached files and presets stay in your browser. They only leave it when you choose to paste or upload them into a chatbot or other service. Check each provider's own privacy terms before sharing sensitive information.
- **Network:** the app itself makes one kind of network request, the catalog check you start by clicking **Check for newer catalog** (a plain read of `catalog.json` from GitHub; nothing you typed is sent). It never checks on page load. **Copy & launch** opens the chatbot's own website in a new tab with no prompt text in the address. Loading the page and building prompts were tested with the network switched off.
- **Browser storage keys:** `pb-theme` (theme), `pb-palette` (colour palette), `pb-layout-v1` (pinned and reordered sections), `pb-presets-v1` (your presets), `pb-catalog-v1` (a catalog you installed, optional) and `pb-start-closed` (whether you closed the Start here panel).

## Project management and roadmap

Ideas are captured and prioritised without turning every idea into immediate scope. **Anything in the roadmap or idea inbox is a future idea, not a feature of the current app.**

- [PROJECT_CONTROL.md](PROJECT_CONTROL.md): central project memory, decisions, active work and session-resume instructions.
- [ROADMAP.md](ROADMAP.md): now, next and later direction, and release gates.
- [docs/IDEA_INBOX.md](docs/IDEA_INBOX.md): idea capture and triage.
- [docs/CURRENT_STATUS.md](docs/CURRENT_STATUS.md): dated technical baseline and handoff.
- [docs/REGRESSION_CHECKLIST.md](docs/REGRESSION_CHECKLIST.md): repeatable pre-release checks.
- [docs/](docs/): guides and reference PDFs.

## Older versions

Earlier builds (v5.1 through v5.3.1, and earlier prototypes) are stored in [archive/](archive/). A v5.2.0 release is published under [Releases](https://github.com/GenX-Shinobi/Prompt-Builder/releases).

## Contributing and testing

Contributions and AI-assisted revisions are welcome. Preserve the free-use-first philosophy, the standalone architecture, existing functionality and accessibility. See [contributing.md](contributing.md) for the rules, the Dev Bay workflow and the commands for the automated browser tests in `tests/` (which need Node and Playwright; the app itself needs neither). Those tests do not replace opening the file in a real browser.

## AI assistance note

This project's code and revisions were created and iterated with AI assistance and reviewed through testing. Edge cases may vary, so please test changes and report issues if you spot bugs.

## Creator

Made by a regular person sharing practical tools for non-coders and tinkering with AI workflows. Outside of building tools like this, I also publish gameplay streams on [Twitch](https://www.twitch.tv/genx_shinobi).

## License

Released under the MIT License.
