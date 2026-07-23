# Faberon agent instructions

Operational rules for AI agents working in this repository. Durable engineering principles live in `CONSTITUTION.md`. Task workflows live in project skills under `skills/`.

## Required context

Before changing the repository:

1. Read `CONSTITUTION.md`.
2. Read the complete `SKILL.md` for every applicable project skill.
3. Inspect the affected application and follow its existing conventions unless they conflict with these instructions.

Use all matching skills. Skills under `skills/` are canonical and shared by every AI tool; tool-specific entries (for example under `.cursor/skills/`) may only point to them.

## Project skills

| Task | Required skill |
| --- | --- |
| Implement or modify frontend code (including modals) | `skills/build-faberon-frontend` |
| Review frontend code | `skills/review-faberon-frontend` |
| Change or review UI colors, tokens, or exceptional sizes | `skills/minimize-color-palette` |
| Implement or modify backend code | `skills/build-faberon-backend` |
| Implement or modify mobile code | `skills/build-faberon-mobile` |

## Commands

- Run application, package-manager, build, lint, test, and scaffold commands from the affected application directory (`frontend`, `backend`, or `mobile`), never from the repository root.
- Use Node 26 for all applications (`nvm use 26` / repo `.nvmrc`).
- Frontend and backend use **pnpm**. Mobile uses **npm** (lockfile: `mobile/package-lock.json`).
- After changing frontend code, from `frontend`: `pnpm lint` and `pnpm build`.
- After changing backend code, from `backend`: `pnpm lint`, `pnpm test`, and `pnpm build`.
- After changing mobile code, from `mobile`: `npm run lint`, `npm run typecheck`, and `npm test -- --runInBand` (or `npm run check` when a fuller gate is appropriate).
- Keep secrets out of the repository. Add documented examples to `.env.example` (or the app equivalent) and validate runtime configuration at startup.
- Do not create, generate, or run database migrations unless the user explicitly requests it; never enable automatic schema synchronization outside disposable tests.

## Mobile-specific agent notes

- Expo SDK and React Native APIs change across versions. Before writing mobile code, read the versioned Expo docs for the SDK this app uses (see `mobile/package.json` / `mobile/AGENTS.md`).
- Prefer the app's existing mock/HTTP service seam over embedding fetch logic in screens.
