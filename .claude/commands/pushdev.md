---
description: Commit all changes and push to dev
---

Commit every pending change in the working tree and push to the `dev` branch.

Steps:
1. Run `git status` and `git diff HEAD` to see what changed.
2. Stage everything with `git add -A`.
3. Commit with a **short, plain message**:
   - Describe *what* changed, not why. No body, no bullet lists, no explanations.
   - No emojis, no conventional-commit prefixes unless the repo's existing history already uses them (check `git log --oneline -10` first).
   - No "Generated with Claude Code" footer, no Co-Authored-By trailer.
   - Examples of the target style: `fix null check in order parser`, `add tenant domain resolver`, `update deps`.
4. If the current branch is not `dev`, switch to it with `git checkout dev` before committing. Do not create new branches.
5. If the branch has no upstream, use `git push -u origin dev`.

Rules:
- Never amend or rewrite existing commits, never force-push.
- If there is nothing to commit, say so and stop.
- If the push is rejected, report the error and stop — do not pull, rebase, or merge without asking.
- Report the final result in one line: commit hash + message.

$ARGUMENTS
