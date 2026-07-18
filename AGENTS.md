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
| Implement or modify frontend code (including modals) | `skills/build-faberon-frontend` |
| Review frontend code | `skills/review-faberon-frontend` |
| Change or review UI colors, tokens, or exceptional sizes | `skills/minimize-color-palette` |
| Implement or modify backend code | `skills/build-faberon-backend` |

Use all matching skills. Skills under `skills` are canonical and shared by every AI tool; tool-specific entries may only point to them.

## Commands

- Run application, package-manager, build, lint, test, and scaffold commands from the affected application directory (`frontend` or `backend`), never from the repository root.
- Use Node 26 and pnpm for frontend and backend commands.
- After changing frontend code, run `nvm use 26`, `pnpm lint`, and `pnpm build` from `frontend` before handoff.
- After changing backend code, run `nvm use 26`, `pnpm lint`, `pnpm test`, and `pnpm build` from `backend` before handoff.
- Keep secrets out of the repository. Add documented examples to `.env.example` and validate runtime configuration at startup.
- Do not create, generate, or run database migrations unless the user explicitly requests it; never enable automatic schema synchronization outside disposable tests.
