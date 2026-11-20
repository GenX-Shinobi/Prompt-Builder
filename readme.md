# AI Prompt Builder Hub

A free-first, chatbot-independent prompt builder for everyday people. Turn an unclear question, idea or task into a useful prompt, choose an AI chatbot that fits, prepare relevant context and transfer the result—without needing coding skills or a paid AI subscription.

The project is open source and designed to stay portable: the application is a standalone HTML file with no build step or external runtime dependencies.

## Try it

- **[Open the live app](https://genx-shinobi.github.io/Prompt-Builder/)**
- **[View or download index.html](index.html)**
- **[Browse older versions](archive/)**
- **[Browse project documents](docs/)**

## Why it exists

The project began with a practical problem: finding the right AI for a task and constructing a prompt that gets a useful result. That task might be writing, research, learning, planning, coding, shopping, everyday problem-solving or even getting past a gameplay roadblock.

The aim is not to make people learn prompt-engineering jargon. It is to help them explain what they need and get more value from whichever chatbot they can access.

## Core principles

- **Free-use first:** design around free chatbot plans and clearly label account requirements, limited quotas and paid-only features. Paid plans are optional, never a prerequisite for the project.
- **Chatbot-independent:** support choice rather than lock-in.
- **Accessible:** plain language and workflows that make sense to non-coders.
- **Portable:** standalone HTML, no external libraries or build process.
- **Honest:** chatbot features, model access and quotas change. Treat budgets as estimates and mark uncertain information rather than presenting it as fact.
- **Open and AI-editable:** users can ask an AI chatbot to help revise the project using the built-in Dev Bay and the documented contribution rules.

## Current application baseline

The default branch currently contains **v5.3.1** (check the version string in `index.html) unless a newer reviewed release has been merged.

The application includes:
- Nine chatbot choices: ChatGPT, Gemini, Claude, Perplexity, Grok, Microsoft Copilot, DeepSeek, Meta AI and Mistral.
- **Bot Commands** for chatbot-specific tools and capabilities.
- **Prompt Craft** for universal prompt-shaping modules, including brief, output, accuracy, research, writing, persona/tone and technical tasks.
- A core prompt area, context/attachment workflow and prompt-size estimates.
- Automatic splitting for prompts that exceed the selected chatbot's conservative paste budget.
- Local browser presets.
- A Dev Bay for preparing AI-assisted code changes and exporting clean standalone HTML.
- Light/dark themes, colour palettes and section layout controls.

Feature availability and chatbot quotas can change by account, region and date. Check the app's current notes and linked provider sources; do not treat estimated paste budgets as official provider limits.

## Quick start

1. Open the [live app](https://genx-shinobi.github.io/Prompt-Builder/) or download [index.html](index.html).
2. Choose the chatbot you want to use.
3. Select useful options in **Bot Commands** and **Prompt Craft**.
4. Enter your task and any context you want the chatbot to consider.
5. Review the compiled prompt and size estimate.
6. Use **Copy & launch** or the splitting workflow to transfer it to your chosen chatbot.
7. Review the AI's answer and refine your prompt as needed.

The local HTML file can build prompts without a server or installation. Features that query external sources, open chatbot websites or use provider services naturally require an internet connection.

## Improve the app with AI

The built-in **Dev Bay** prepares a change request and packages the application source for an AI-assisted revision. Before making changes, read:
- [Contributing & AI code-migration rules](contributing.md)
- [AI work rules](docs/AI_WORK_RULES.md)
- [Project control and continuity file](PROJECT_CONTROL.md)

Always test the complete returned HTML before publishing it. AI-generated changes are not automatically verified.

## Project management and roadmap

The project owner can share ideas freely; they are captured and prioritised without turning every idea into immediate scope.

- [PROJECT_CONTROL.md](PROJECT_CONTROL.md) — central project memory, decisions, active work and session-resume instructions.
- [ROADMAP.md](ROADMAP.md) — now/next/later direction and release gates.
- [docs/IDEA_INBOX.md](docs/IDEA_INBOX.md) — idea capture and triage.
- [docs/CURRENT_STATUS.md](docs/CURRENT_STATUS.md) — dated technical baseline and handoff.
- [docs/REGRESSION_CHECKLIST.md](docs/REGRESSION_CHECKLIST.md) — repeatable pre-release checks.
- [docs/](docs/) — historical guides and reference documents.

## Privacy

Prompt text, attachments and presets are handled in the browser by the standalone app. They are not sent to this project or stored on a project server. They only leave the browser when the user chooses to paste or upload them to an external chatbot or service. Check each provider's own privacy terms before sharing sensitive information.

## Contributing

Contributions and AI-assisted revisions are welcome. Preserve the free-use-first philosophy, standalone architecture, existing functionality and accessibility. See [contributing.md](contributing.md) and the project control files before proposing changes.

## License

Released under the MIT License.
