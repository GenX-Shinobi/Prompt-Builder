# v5.5.0 Guided Path test build: tester guide

This is a **draft test build** (PB-550-01, version `5.5.0-test.4`). It is not the live app and has not been released. The live v5.4.0 app at https://genx-shinobi.github.io/Prompt-Builder/ is unchanged and is still fine for informal exploration.

## Open the test build safely

**Recommended: download it and open it from your device.** This works offline and needs no account.

1. Open [index.html on the test branch](https://github.com/GenX-Shinobi/Prompt-Builder/blob/feat/v5.5.0-guided-path/index.html).
2. Use the **Download raw file** button (the down-arrow icon above the code). On a phone, open the `…` menu if you don't see it.
3. Open the downloaded file in your browser. On a computer, double-click it. On a phone, open it from your Downloads or Files app.

**Optional: view it in the browser without downloading.** This preview link is served by a third-party site, raw.githack.com, and was not checked before this guide was published: https://raw.githack.com/GenX-Shinobi/Prompt-Builder/feat/v5.5.0-guided-path/index.html#guided

Nothing you type leaves your device. The test build stores nothing new, and Copy & launch only copies your prompt and opens the chatbot you picked.

## What to do

Don't read ahead or ask for help. Use it the way you would on your own.

1. Pick a chatbot you already use.
2. Choose **Guided path**.
3. Describe **a real task you actually need done this week**, in your own words.
4. Choose an answer format if you want one.
5. Read the prompt. Change anything you like. Then press **Copy & launch** (right under your task, or under the prompt) and paste it into the chatbot.
6. Read the chatbot's answer, then fill in the form below.

## Feedback form

Copy this into a comment on [issue #11](https://github.com/GenX-Shinobi/Prompt-Builder/issues/11), or send it to the owner. Short answers are fine.

```
Tester (first name or initials):
Device and browser (e.g. Android phone, Chrome):
Chatbot used:
Opened by: download / preview link
Task, in one line (leave out anything private):
Answer format chosen (or "none"):

1. Where did you hesitate or feel unsure? (which screen or step, and why)
2. Did you change the prompt before copying? What did you change?
3. Was the prompt useful? (1 = not at all, 5 = very)  ___  Why?
4. Was the chatbot's answer useful? (1 = not at all, 5 = very)  ___  Why?
5. Compared with v5.4.0 (if you've used it): what felt easier?
6. Compared with v5.4.0: what felt harder or was missing?
7. Did anything look broken, overlap, or not respond?
8. Anything else?
```

## Known limits of this build

- **Copy & launch** now also sits right under where you type: under the Core prompt in Standard builder, and under your task in Guided path. All of them do the same thing.
- If your prompt is too long for the chatbot, the **Copy part** buttons appear right under the Copy & launch you pressed.
- In the Guided path, the standard commands, saved presets, attachments and Dev Bay are hidden. Switch to **Standard builder** to use them.
- Your edits to the prompt are kept only while the page is open.
