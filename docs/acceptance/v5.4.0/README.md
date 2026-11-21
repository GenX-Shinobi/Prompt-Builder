# v5.4.0 owner acceptance kit

**For the owner:** download `acceptance-kit.html` ([open it on GitHub](https://github.com/GenX-Shinobi/Prompt-Builder/blob/docs/project-control-baseline/docs/acceptance/v5.4.0/acceptance-kit.html), then use *Download raw file*), double-click it, and follow the page. You only need a web browser.

The kit tests the real release app (`index.html` on `release/v5.4.0`) with six ready-made test catalogues: add/remove commands, add a chatbot, remove a chatbot, a 631-change catalogue (over the 500 limit), booby-trapped text, and a broken catalogue. Every test ends with **Cancel**; nothing is installed.

For maintainers (not the owner):
- `catalogs/*.json` — the same six catalogues as plain files (the import box takes pasted text).
- `build_kit.js <release catalog.json> <sha>` regenerates everything from the release's own `catalog.json`.
- `verify_kit.js <release index.html>` acts like the owner against the real app. Last run: 36 passed, 0 failed (see `docs/test-evidence/v5.4.0-023171d/`).
- Rebuild and re-verify whenever `catalog.json` or the import/preview behaviour changes.
