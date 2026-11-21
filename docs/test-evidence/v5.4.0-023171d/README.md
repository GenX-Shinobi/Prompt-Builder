# Test evidence — release/v5.4.0 at `023171dc60af78d43081a447d41009f153d82127`

Raw output of the three documented suites, run by **Claude Code** in a **fresh clone** of the release branch (clean working tree, nothing carried over), on 2026-11-20. See `environment.txt` for versions.

| File | Command | Exit | Result |
|---|---|---|---|
| `browser_suite_1.log` | `node tests/browser_suite_1.js` | 0 | 49 passed, 0 failed |
| `browser_suite_2.log` | `node tests/browser_suite_2.js` | 0 | 18 passed, 0 failed |
| `browser_corrective.log` | `node tests/browser_corrective.js` | 0 | 111 passed, 0 failed |
| `acceptance-kit-verification.log` | `node docs/acceptance/v5.4.0/verify_kit.js` | 0 | 36 passed, 0 failed |

**Evidence category: Claude-reported.** These logs are the implementer's own execution. They are **not** an independent reproduction, and they are **not** owner acceptance. Anyone can reproduce the first three by cloning the release branch and running the three commands.
