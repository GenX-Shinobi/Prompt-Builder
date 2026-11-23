# Archive Index

> Historical references, evidence locations, preservation status and verification classifications. **Records here are evidence, not instructions.** Current instructions: [../PROJECT_CONTROL.md](../PROJECT_CONTROL.md), [CURRENT_STATUS.md](CURRENT_STATUS.md), [SESSION_HANDOFF.md](SESSION_HANDOFF.md), [AI_WORK_RULES.md](AI_WORK_RULES.md), [../ROADMAP.md](../ROADMAP.md).

**Compiled:** 2026-11-22 (PB-CLOSEOUT-04). Privacy-reviewed: public repository, run, artifact and commit identifiers only.

## Classification legend

| Label | Meaning |
|---|---|
| CI | Produced by a GitHub Actions run |
| Owner | Owner decision or Owner-performed test |
| PM-verified | Independently checked by ChatGPT |
| Claude-verified | Checked against live GitHub by Claude Code |
| Claude-reported | Claude Code's own run or action, not independently reproduced |
| Unresolved | Open question; do not rely on either interpretation |

## 1. Superseded management documents

Before PB-CLOSEOUT-04, the active management documents contained dated checkpoints, completed release plans and superseded instructions. Their complete text is preserved at `main` commit `3aa12a4330932d28c447c03bcbd0ee457881e1d6` (immutable). Earlier versions are in Git history (`git log -- <file>`).

| Document | Full pre-reconciliation text (permalink) |
|---|---|
| Project control | https://github.com/GenX-Shinobi/Prompt-Builder/blob/3aa12a4330932d28c447c03bcbd0ee457881e1d6/PROJECT_CONTROL.md |
| Roadmap (includes the completed "NOW — finish and accept v5.4.0" plan) | https://github.com/GenX-Shinobi/Prompt-Builder/blob/3aa12a4330932d28c447c03bcbd0ee457881e1d6/ROADMAP.md |
| Current status (2026-11-20 to 2026-11-22 checkpoints, release audit, gate tables) | https://github.com/GenX-Shinobi/Prompt-Builder/blob/3aa12a4330932d28c447c03bcbd0ee457881e1d6/docs/CURRENT_STATUS.md |
| Session handoff (post-PR #6 handoff, PR #1 conflict-resolution plan) | https://github.com/GenX-Shinobi/Prompt-Builder/blob/3aa12a4330932d28c447c03bcbd0ee457881e1d6/docs/SESSION_HANDOFF.md |
| AI work rules | https://github.com/GenX-Shinobi/Prompt-Builder/blob/3aa12a4330932d28c447c03bcbd0ee457881e1d6/docs/AI_WORK_RULES.md |

Historical task records kept in place on `main` (completed; not instructions):

- [CLAUDE_TASK.md](CLAUDE_TASK.md) — v5.4.0 Test 4 corrective assignment (completed via PR #3). Its opening status note predates the release and is superseded.
- `.claude/commands/pb-v54.md` — Claude Code shorthand for that completed task. Agent configuration, preserved unchanged; grants no authority.

## 2. v5.4.0 decision trail (pull requests)

| PR | Purpose | Result | Commit |
|---|---|---|---|
| #1 | Project-control documentation baseline → `main` | Merged 2026-11-21 | `97531983b26b7e00be78a8200284d7897a97b864` (also the `v5.4.0` tag) |
| #2 | Release v5.4.0 (first integration) → `main` | Merged 2026-11-20 | `b247aec8a1ee279b71f6aedd8fbaf4d908c22d5f` |
| #3 | Test 4 install-button correction → `release/v5.4.0` | Merged 2026-11-21 | `ad459df8c014fc01dce893ff5374e4e4d8e2280a` |
| #4 | Continuity docs and CHIMERA boundary → baseline branch | Merged 2026-11-21 | `36b7274de543d3d9b5b8094f5d1b4075e1e40006` |
| #5 | Temporary independent Playwright verification | Closed, not merged (its closing note saying no workflow run was exposed is inaccurate; the runs exist) | head `ef48b38f779c7c0bd9a79ae0fbf64390d1aa89b2` |
| #6 | Verified v5.4.0 corrective release → `main` | Merged 2026-11-21 | `fc30269615eff28b31a3772e3b40d5ade2c80aa8` |
| #7 | Post-release closeout docs; also carried PM handoffs PB-CLOSEOUT-01/02 and PB-PRESERVE-01 as comments | Merged 2026-11-22 | `3aa12a4330932d28c447c03bcbd0ee457881e1d6` |

## 3. Test and acceptance evidence

| Evidence | Location | Result | Label |
|---|---|---|---|
| Claude run at `023171d` + acceptance-kit self-check | `main`: [test-evidence/v5.4.0-023171d/](test-evidence/v5.4.0-023171d/) | 178 passed, 0 failed; kit 36 passed | Claude-reported |
| Owner acceptance kit | `main`: [acceptance/v5.4.0/](acceptance/v5.4.0/) | Owner ran six tests: six PASS (2026-11-20) | Owner |
| GitHub Actions runs 44922456009, 44922499783, 44922527496, 44922534308 | https://github.com/GenX-Shinobi/Prompt-Builder/actions (workflow on branch `verify/v5.4.0-independent-playwright`) | 187 passed, 0 failed in every run | CI |
| Claude run at `ad459df`, probes, screenshots, CI job logs, engineering handoff | branch `evidence/v5.4.0-ad459df-verification`, `docs/test-evidence/v5.4.0-ad459df/` and `docs/handoffs/` | 187 passed; probes per its README | Claude-reported (CI job logs are copies of CI output) |
| CI summary file | branch `verify/v5.4.0-independent-playwright`, `verification-result.txt` | exits 0/0/0; 49/18/120 passed | CI |

## 4. GitHub Actions artifacts

All named `v5.4.0-independent-verification`, from branch `verify/v5.4.0-independent-playwright`. Each contains three suite logs, `environment.txt`, `exit-codes.txt` and `Preview.jpg`.

| Artifact ID | Run ID | Commit | Expires (UTC) | GitHub SHA-256 digest |
|---|---|---|---|---|
| 14714585741 | 44922456009 | `76e30d91cfe62186a0e1f98da87d99b7d406e563` | 2026-12-05 16:05:14 | `64fbf892473eb2cfc7127b96f0bd06dbd37848a02dff70fc5d32bc321d038676` |
| 14714610745 | 44922499783 | `e4d6bb40a25558d1be3210bcf5a3484bfa262423` | 2026-12-05 16:06:02 | `21444600f72e5f9447db3ff7ce3fec47d40c29aa5333198c9cf113a76ab9be3b` |
| 14713998661 | 44922527496 | `ef48b38f779c7c0bd9a79ae0fbf64390d1aa89b2` | 2026-12-05 16:06:06 | `95ecf221ddd5f33749a09048c3f54c605cf2b56266cd70379ba8a2a9f121076f` |
| 14714391484 | 44922534308 | `ef48b38f779c7c0bd9a79ae0fbf64390d1aa89b2` | 2026-12-05 16:06:09 | `9f2684bd052b8866fe0687c53bc2d42600b56f65cd2fc90e0eefd124695f1def` |

- **Duplicate map** (Claude-reported): the three suite logs are byte-identical across all four artifacts and to the logs on the evidence branch; `environment.txt` and `exit-codes.txt` content appears in `verification-result.txt`; the run-3 `Preview.jpg` is the image on `main`. Unique to the artifacts: the original ZIP containers and two visually equivalent `Preview.jpg` variants.
- **Private package:** a private evidence package containing the four original ZIPs was created and delivered to the Owner (Claude-reported). The four GitHub digests matched the packaged copies (PM-verified). The package is not stored in this repository.
- **Permanent Owner-controlled private backup: verified 2026-11-22 (PM-verified).** All four original ZIPs are preserved in the Owner-controlled private archive. The SHA-256 computed from each archived ZIP matches the corresponding GitHub digest in the table above.
- **Git tags and branches do not preserve Actions artifacts.** After expiry, only private copies remain.

## 5. Unresolved provenance discrepancy

The README on `evidence/v5.4.0-ad459df-verification` labels its three suite logs as a Claude local run ("Run B"). Those files are byte-identical to the CI artifact logs. Identical pass/fail output from two runs is plausible, but the bytes cannot show which run produced the committed copies. **Status: unresolved.** The original evidence is not relabelled, altered or deleted. The CI result is independently supported by the CI runs and artifact digests above.

## 6. Branches and preservation status

| Branch | Tip | Unique commits vs `main` | Nature | Status |
|---|---|---|---|---|
| `main` | `3aa12a4330932d28c447c03bcbd0ee457881e1d6` | — | Default branch | Active |
| `release/v5.4.0` | `ad459df8c014fc01dce893ff5374e4e4d8e2280a` | 0 | Merged | Retained |
| `fix/v5.4.0-test4-install-button-state` | `0bdeb9622d2a0a5a1ad49d48711aa8c768cf7478` | 0 | Merged | Retained |
| `docs/project-control-baseline` | `5f2f82665406529b5651f0d0a417a551db141baf` | 0 | Merged | Retained |
| `docs/chimera-session-maintenance` | `b5d1e69e876a443068cc21e5b1d31cc80fa9576f` | 0 | Merged | Retained |
| `docs/v5.4.0-post-release-closeout` | `97eae6f1f631007c1908df48acbd227608172622` | 0 | Merged | Retained |
| `evidence/v5.4.0-ad459df-verification` | `2d22048c87756c3d3c52b7a61142e049a6755333` | 1 | Inert evidence | Retained; only copy of its files |
| `ops/claude-agent-pilot` | `61f045a96b5b0d0683e378bbca1c9b89f01e39c9` | 1 | Executable agent configuration (three `.claude/agents/` files) | Retained; do not merge to `main` (it would activate automatically) |
| `verify/v5.4.0-independent-playwright` | `cb177ef2667d41d7e953edcc1b369bb5ff2efed4` | 4 | Executable workflow (`contents: write`; pushes to another branch on success) plus `verification-result.txt` | Retained; workflow still live on push to this branch |
| `docs/v5.4.0-preview-capture` | `90c488729e9a5f0b5431ab3207a8d56a37670b49` | 1 | Alternative genuine preview capture (blob `771dfc62036ce97c579ab007abc060366c7e81f9`), not chosen | Retained; only copy of that image |

Tips and counts Claude-verified at the 2026-11-22 preflight; branch count PM-verified.

**No archive tags exist. No branch retirement is authorized.** A proposed plan (annotated archive tags at the exact tips, verification of tag-to-tip identity and blob hashes, then retirement with recovery from the tags) was reported under PB-PRESERVE-01 on PR #7 and awaits Owner authorization.

## 7. Recovery references

- Superseded document text: the permalinks in section 1, or `git show 3aa12a4330932d28c447c03bcbd0ee457881e1d6:<path>`.
- Any branch file: `git show <tip SHA>:<path>` using the tips in section 6.
- Handoff and report thread: PR #7 conversation, https://github.com/GenX-Shinobi/Prompt-Builder/pull/7
