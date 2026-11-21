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
- The baseline documentation PR #1 remains open/unmerged unless live verification shows otherwise.
- PR #3 was previously confirmed merged into `release/v5.4.0`; verify current branch state before relying on this.
- Do not merge PR #1 or #4, or alter their base/head, without explicit Owner approval.
- The actual Claude local workspace has not been inspected in this session.

## Release position
AI Prompt Builder Hub v5.4.0 is **not yet publicly released or release-approved**. Prior records say owner browser acceptance was six of six PASS and Claude reported 187 automated tests passing with zero failures; these are historical claims and must be checked against current evidence. Independent reproduction of the three documented Playwright suites and verification of the actual Claude workspace remain the next technical checks.

Do not modify `main`, merge release branches, publish, deploy, tag, release, or begin v5.5.0 without separate explicit Owner authorization. Preserve all v5.4.0 release gates.

## Approved cross-project sequence

1. Finish documentation maintenance and handoff cleanup.
2. Complete v5.4.0 release closeout and independent verification.
3. Obtain explicit Owner release approval and make v5.4.0 publicly available.
4. Only after public availability, resume CHIMERA work.
5. After CHIMERA resumes, consider using accumulated Prompt Builder future-release ideas as practical CHIMERA test material, under a separate bounded plan.

CHIMERA is a separate project and repository: https://github.com/GenX-Shinobi/CHIMERA. Its work is paused until v5.4.0 is publicly released. No project memory, employee permissions, statutes or release authority transfers between repositories.

## Presentation asset note
The Owner noticed that the current project README/repository preview visual appears outdated. Investigate whether this refers to an image embedded in a README, a tracked preview asset (the docs branch contains a `Preview.jpg` asset), or GitHub's repository social-preview image. Do not replace it with an invented image. Identify the exact display surface and current source before proposing an update. This is documentation/presentation maintenance, not a v5.4.0 application-code change unless separately authorized.

## Single next action
Verify the actual Claude workspace and independently run the three documented Playwright suites against the current v5.4.0 release branch. Report the results in plain English, identify the single remaining release gate, and update this handoff with exact evidence. Do not merge or release.
