# AI Prompt Builder Hub — Session Handoff

**Checkpoint:** 2026-11-21, after PR #6 (v5.4.0 code merged into `main`)  
**Written by:** Claude Code (Engineering Lead), Owner-assigned documentation closeout  
**Repository:** https://github.com/GenX-Shinobi/Prompt-Builder  
**Authority:** Product Owner retains final approval for scope, merges and releases. ChatGPT reviews this handoff.

## Read first
1. docs/CURRENT_STATUS.md — top section "Current position — 2026-11-21, after PR #6"
2. PROJECT_CONTROL.md
3. ROADMAP.md
4. docs/AI_WORK_RULES.md
5. docs/REGRESSION_CHECKLIST.md
6. docs/IDEA_INBOX.md
7. docs/CHIMERA_RELATIONSHIP.md
8. This handoff

Verify live GitHub before acting. Repository records are the source of truth; this handoff is a dated snapshot.

## Where things stand
- **Code:** `main` is `fc30269`, the merge of PR #6. Its `index.html` is byte-identical to the verified `release/v5.4.0` code (`ad459df`). `release/v5.4.0` is kept.
- **Testing:** GitHub Actions ran all three Playwright suites on the same code four times: 187 passed, 0 failed every time. The Owner relied on this for PR #6. Owner browser acceptance: six of six PASS.
- **Live site:** GitHub Pages republished automatically from `main`, so the public live app now runs v5.4.0. No tag or GitHub Release exists for v5.4.0.
- **Documentation:** PR #4 (→ `docs/project-control-baseline`) and PR #1 (→ `main`, draft) are open and unmerged. `main` still has the older README text and the old preview image.
- **Preview image:** the `Preview.jpg` on PR #4 is a genuine GitHub Actions capture of v5.4.0 on first open (validated; details in CURRENT_STATUS). The README references it with descriptive alt text and a caption.

## Release position
v5.4.0 is **not formally released or release-approved**. Outstanding gates: real-device mobile/touch, screen reader, Firefox/Safari and manual contrast checks; README/status accurate on `main` (needs PR #4 then PR #1); a decision on a version-log entry for the post-merge commits; explicit Owner release approval, then tag and GitHub Release.

Do not merge PR #4 or PR #1, modify `main`, publish, deploy, tag, release, or begin v5.5.0 or CHIMERA work without separate explicit Owner authorization.

## Safe conflict-resolution plan (prepared, not executed)
Simulated with `git merge-tree` on 2026-11-21; nothing was merged.

1. **PR #4 → `docs/project-control-baseline`.** Fast-forward, no conflicts. Requires Owner approval. Merge with GitHub's normal merge button.
2. **Bring `main` into PR #1's branch.** On `docs/project-control-baseline`, merge `origin/main` (a normal merge, **not** a rebase, so no force-push is needed). Only `readme.md` conflicts. Resolve it by keeping the documentation branch's `readme.md` in full (the PR #4 version, which describes v5.4.0 and the current preview).
3. **Check the result before pushing.** `index.html`, `catalog.json`, `tests/*` and `contributing.md` must match `main` exactly (the simulation confirms they do); `Preview.jpg` must be blob `f59e5837…`; no conflict markers anywhere. Optionally re-run the three suites on that tree; the application files are unchanged, so they should give the same 187.
4. **Push** `docs/project-control-baseline` normally. PR #1 should then show as mergeable with no conflicts. Mark it "Ready for review" (it is a draft).
5. **Owner merges PR #1 into `main`.** Note: Pages will then republish, so `PROJECT_CONTROL.md`, `ROADMAP.md`, `docs/`, the acceptance kit and `.claude/commands/pb-v54.md` will also be reachable on the live site. They are already public in the repository; this only affects the website.
6. Retire the redundant branches (`docs/v5.4.0-preview-capture`, `verify/v5.4.0-independent-playwright`, `fix/v5.4.0-test4-install-button-state`) after the Owner agrees. Retire the verify branch first: its workflow has write access and can push a new `Preview.jpg` to the PR #4 branch if anything is pushed to it.

Steps 2–4 change only documentation branches, but each still needs the Owner's go-ahead because they lead directly into the PR #1 merge.

## Notes for ChatGPT's review
- Confirm the CI runs as the "independent reproduction" label (Owner already relied on them).
- Record whether the automatic Pages update from PR #6 is acceptable under the publication gate.
- PR #5's closing note is inaccurate (the CI runs did execute and pass); correct it on GitHub if wanted.
- Raw evidence lives on `evidence/v5.4.0-ad459df-verification` (`2d22048`), not on PR #4. Decide whether to keep it as a reference branch or merge it.
- Pre-existing cosmetic items, not blockers: the chatbot note under the cards is unstyled (larger text, visible in the preview image); header controls overlap the eyebrow text at ≤600 px. Candidates for IDEA_INBOX.

## Approved cross-project sequence (unchanged)
1. Finish documentation maintenance and handoff cleanup.
2. Complete v5.4.0 release closeout and independent verification.
3. Obtain explicit Owner release approval and make v5.4.0 formally released.
4. Only after that, resume CHIMERA work.
5. After CHIMERA resumes, consider accumulated Prompt Builder future-release ideas as practical CHIMERA test material under a separate bounded plan.

CHIMERA is a separate project and repository: https://github.com/GenX-Shinobi/CHIMERA. No project memory, employee permissions, statutes or release authority transfer between repositories.

## Single next action on resume
ChatGPT reviews the 2026-11-21 checkpoint and asks the Owner for one plain-English approval covering: the live-site status, merging PR #4, and resolving and merging PR #1 by the plan above. Do nothing else until that answer is recorded.
