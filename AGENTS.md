# Faberon agent instructions

Read `CONSTITUTION.md` before changing this repository.

Before running application or package commands, enter the application being worked on: `frontend` or `backend`. Do not run package-manager commands from the repository root.

Project skills are shared by all AI agents under `skills`:

- Use `skills/build-faberon-frontend` for frontend implementation.
- Use `skills/review-faberon-frontend` for frontend reviews.
- Use `skills/minimize-color-palette` when changing or reviewing UI colors.

When a task matches a project skill, every AI agent, including Codex, must read that skill's complete `SKILL.md` before acting. Tool-specific skill entries may only point to these canonical shared skills.

For frontend work, use Node 26 and pnpm from `frontend`. Keep pnpm's store outside the repository. If a sandbox cannot write to the normal user-level pnpm store, use a temporary location such as `/tmp/faberon-pnpm-store`.
