# AI Prompt Builder & Code Migrator

A zero-dependency, single-file web application designed to help everyday users get the most out of **free AI chatbots**—and to be **open source and directly editable by those same AI chatbots**.

---

## Core Mission

1. **Free-Tier First:** Built around free chatbot plans (with free accounts where required for uploads, history, or connectors). Every bot command includes a free-tier availability badge (`Free`, `Free w/ account`, `Limited quota`, `Paid plan`), realistic paste budgets, and automatic multi-part prompt splitting when a prompt exceeds a bot's safe paste limit.
2. **Self-Contained & AI-Editable:** The entire application lives in a single `.html` file (`index.html` / `prompt_builder_v5_1.html`) with zero build steps, external libraries, or backend servers. Its built-in **Dev Bay** packages your change request alongside a clean snapshot of the app's source code and version-log rules so any AI chatbot can generate the next version.

---

## Supported Chatbots (Free-Tier Baseline)

* **ChatGPT (OpenAI):** Everyday all-rounder (`/Deepresearch`, `/search`, `@study`, `@app`, Canvas, Python data analysis, image generation).
* **Gemini (Google):** Google Workspace `@` Connected Apps, Tools menu (Deep Research, Canvas, Guided Learning, image/music), and built-in Maps/Flights/Hotels/YouTube queries.
* **Claude (Anthropic):** Long documents, careful writing, Artifacts, styles, connectors, and code/file creation.
* **Perplexity (Perplexity AI):** Citation-backed web, academic, finance, and attached-file research.
* **Grok (xAI):** Conversational assistant with DeepSearch, Think mode, Imagine, and live X (Twitter) search.

---

## Quickstart

### Run Locally
1. Download `index.html` (or `prompt_builder_v5_1.html`).
2. Double-click the file to open it in any modern web browser. No installation, server, or internet connection is required to build prompts.

### Build & Launch a Prompt
1. **Step 0 — Choose your AI chatbot:** Pick a target chatbot to set its free-plan paste budget and filter commands to what that bot supports.
2. **Step 1 — System commands & cheat-sheet modifiers:** Mix and match commands across **Bot Commands**, **Prompt Craft**, **Accuracy**, **Research**, **Format**, **Writing**, **Persona & Tone**, and **Tech & Strategy**. Fill in any inline `[bracketed]` fields that appear, and use **Hide paid-plan-only commands** at the bottom of the card if you want to filter out paid-tier items.
3. **Step 2 — Core prompt & attachments:** Enter your query or source text. Drag, browse, or paste (`Ctrl/Cmd+V`) files or screenshots—small text files ($\le 1\text{ MB}$) can be inlined into the prompt, while images and larger files are staged locally with upload/copy reminders. Adjust the truncation and continuity toggles as needed.
4. **Step 3 — Saved presets (optional):** Save frequently used setups to your browser's `localStorage` (`pb-presets-v1`). Presets never leave your device and are never included in code-migration exports.
5. **Copy & launch:** Click **Copy & launch** in the right-hand console to copy the compiled prompt (or Part 1 of an auto-split sequence) and open your chosen chatbot in a new tab.

### Update the App Using an AI Chatbot (Dev Bay)
1. Scroll to the **DEV BAY** section and click **Initialize code modification sequence**.
2. Choose the target AI engine, describe the change you want, and state why it is needed.
3. Click **Generate package**, then use **Copy package & launch** (which auto-splits packages that exceed the target engine's paste budget) or **Download clean .html** to attach the clean source file directly.
4. Paste the copied package (or attach the downloaded `.html` file) into the AI chatbot, save the complete `.html` file it returns, and verify it in your browser.

---

## Privacy & Local Storage

* **100% Client-Side:** Your prompts, attached files, and saved presets never leave your browser until you explicitly paste or upload them into a chatbot tab.
* **Browser Storage Keys:**
  * `pb-theme` — Light/dark theme preference.
  * `pb-presets-v1` — User-saved prompt presets.

---

## License

Released under the [MIT License](LICENSE).