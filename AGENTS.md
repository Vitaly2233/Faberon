# Faberon agent instructions

## Required context

Before changing the repository:

1. Read `CONSTITUTION.md`.
2. Read the complete `SKILL.md` for every applicable project skill.
3. Inspect the affected application and follow its existing conventions unless they conflict with these instructions.

`CONSTITUTION.md` defines durable engineering principles. Project skills define task-specific workflows. Keep operational rules here rather than repeating them in those documents.

## Project skills

| Task | Required skill |
| --- | --- |
| Implement or modify frontend code | `skills/build-faberon-frontend` |
| Review frontend code | `skills/review-faberon-frontend` |
| Change or review UI colors or design tokens | `skills/minimize-color-palette` |

Use all matching skills. Skills under `skills` are canonical and shared by every AI tool; tool-specific entries may only point to them.

## Commands

- Run application, package-manager, build, lint, test, and scaffold commands from the affected application directory (`frontend` or `backend`), never from the repository root.
- Use Node 26 and pnpm for frontend commands.
- Keep package-manager stores and caches outside the repository. If the normal pnpm store is unavailable, use `/tmp/faberon-pnpm-store`.
- After changing frontend code, run `nvm use 26`, `pnpm lint`, and `pnpm build` from `frontend` before handoff.
