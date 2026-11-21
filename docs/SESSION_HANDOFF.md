# AI Prompt Builder Hub — Session Handoff

**Checkpoint:** 2026-11-21  
**Repository:** https://github.com/GenX-Shinobi/Prompt-Builder  
**Authority:** Product owner retains final approval for scope, merges and releases.

## Read first
1. PROJECT_CONTROL.md
2. ROADMAP.md
3. docs/CURRENT_STATUS.md
4. docs/AI_WORK_RULES.md
5. docs/REGRESSION_CHECKLIST.md
6. docs/CLAUDE_TASK.md
7. docs/IDEA_INBOX.md

Verify live GitHub and the actual Claude workspace before acting. Repository records are the source of truth; this handoff is a dated snapshot.

## Verified GitHub checkpoint at start of maintenance
- main: d4ea76f1e3b896f8494529295e2e75d049cbfc93
- release/v5.4.0: ad459df8c014fc01dce893ff5374e4e4d8e2280a
- docs/project-control-baseline: c114217903d72099c11f301eea22d2b9747b1b6c
- ops/claude-agent-pilot: 61f045a96b5b0d0683e378bbca1c9b89f01e39c9
- PR #1 remains open and unmerged. PR #3 is merged into release/v5.4.0.
- Documentation changes from this pass are isolated on docs/chimera-session-maintenance, based on docs/project-control-baseline.
- The actual Claude local workspace was not inspected.

## Release position
v5.4.0 remains **not release-approved**. Owner browser acceptance is recorded as six of six PASS. Claude-reported automated results on the corrective branch are 187 passed, 0 failed; they remain implementer-reported, not independently reproduced. Cross-browser, mobile, screen-reader and offline checks remain outstanding as documented.

Do not modify main, merge PR #1, merge/rebase release branches, publish, deploy, tag, release, or begin v5.5.0 without separate owner authorization.

## CHIMERA boundary
CHIMERA is a separate public repository: https://github.com/GenX-Shinobi/CHIMERA. It may become Prompt Builder's first adopter only after formal v5.4.0 release approval and a separately authorized integration milestone. No project memory, employee permissions or release authority transfers between repositories.

## Single next action
Verify the actual Claude workspace and arrange an independent run of the three documented Playwright suites against the current release branch. Then update this handoff with the exact evidence and one next action.
