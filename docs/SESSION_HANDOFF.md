# AI Prompt Builder Hub — Session Handoff

**Checkpoint:** 2026-11-21  
**Repository:** https://github.com/GenX-Shinobi/Prompt-Builder  
**Authority:** Product Owner retains final approval for scope, merges and releases.

## Read first
1. PROJECT_CONTROL.md
2. ROADMAP.md
3. docs/CURRENT_STATUS.md
4. docs/AI_WORK_RULES.md
5. docs/REGRESSION_CHECKLIST.md
6. docs/CLAUDE_TASK.md
7. docs/IDEA_INBOX.md
8. docs/CHIMERA_RELATIONSHIP.md
9. This handoff

Verify live GitHub and the actual Claude workspace before acting. Repository records are the source of truth; this handoff is a dated snapshot.

## Current documentation workspace
- Documentation PR #4 is open: https://github.com/GenX-Shinobi/Prompt-Builder/pull/4
- PR #4 is documentation-only and targets `docs/project-control-baseline`, not `main` or `release/v5.4.0`.
- The baseline documentation PR #1 remains open and unmerged.
- PR #3 is merged into `release/v5.4.0`.
- PR #1 and PR #4 must remain open; do not merge either without explicit Owner approval.
- Live comparison confirms PR #4 is 16 commits ahead of its base and has no behind commits. Its changed-file list remains documentation-only.
- The actual Claude local workspace has not been inspected in this session. Do not claim otherwise.

## Release position
AI Prompt Builder Hub v5.4.0 is **not yet publicly released or release-approved**. Historical records report owner browser acceptance of six of six scenarios and 187 Claude-reported automated passes, but the three Playwright suites have not been independently reproduced in this session. The actual Claude workspace and current test evidence must be verified before relying on those reports.

Do not modify `main`, merge release branches, publish, deploy, tag, release, or begin v5.5.0 without separate explicit Owner authorization. Preserve all v5.4.0 release gates.

## Approved cross-project sequence
1. Finish documentation maintenance and handoff cleanup.
2. Complete v5.4.0 release closeout and independent verification.
3. Obtain explicit Owner release approval and make v5.4.0 publicly available.
4. Only after public availability, resume CHIMERA work.
5. After CHIMERA resumes, consider accumulated Prompt Builder future-release ideas as practical CHIMERA test material under a separate bounded plan.

CHIMERA is a separate project and repository: https://github.com/GenX-Shinobi/CHIMERA. Its implementation, integration and testing remain paused until v5.4.0 is publicly released. No project memory, employee permissions, statutes or release authority transfers between repositories.

## README preview image — Prompt Builder
The stale visual is in **Prompt Builder**, not CHIMERA. The current `readme.md` embeds `Preview.jpg` directly:
```md
![AI Prompt Builder Preview](Preview.jpg)
```
Live GitHub inspection confirms that `Preview.jpg` has the same blob SHA on `main` and `docs/chimera-session-maintenance` (`03cdbe8a14a4cadf7b215895e2b724c68154e71c`). The documentation PR has not refreshed it. This is the README image, not evidence of a separate GitHub social-preview setting.

**Remaining asset task:** replace `Preview.jpg` with a genuine capture of the current v5.4.0 interface, then verify the README renders it. Do not substitute invented artwork or a mock screenshot. The current Claude/local browser workspace was not accessible for a fresh capture in this session, so this visual update remains explicitly outstanding. It is presentation maintenance, not permission to change application code or release scope.

## Single next action on resume
Resume AI Prompt Builder Hub v5.4.0 release closeout. First inspect the actual Claude workspace and current release-branch evidence; arrange independent reproduction of the three documented Playwright suites. Capture and refresh the README preview from the verified current build as part of the remaining presentation maintenance. Report the single remaining release gate in plain English. Do not merge, publish, deploy, tag or release without explicit Owner approval.
