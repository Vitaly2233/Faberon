---
name: review-faberon-frontend
description: Reviews Faberon React frontend changes for container boundaries, Zustand usage, Tailwind token consistency, visual fidelity, accessibility, routing, and verification. Use when reviewing a frontend feature, page, route, component, store, or pull request in this repository.
---

# Review Faberon Frontend

Read `CONSTITUTION.md` from the repository root and inspect all relevant changes. Enter `frontend` before running application, pnpm, Node, lint, test, or build commands. Never run package-manager commands from the repository root. Keep pnpm's store outside the repository; when a sandbox cannot use the normal user-level store, use `/tmp/faberon-pnpm-store`.

Report concrete findings with file and line references.

## Review checklist

- Pages alone coordinate Zustand, router hooks, navigation, and interaction decisions.
- Every Zustand store is located in `src/store`, never inside a page or container folder.
- Presentational children use typed props and callbacks without importing stores or side-effect services.
- Components are split by clear visual responsibilities without premature abstraction.
- Product colors, fonts, shadows, and exceptional values are centralized in the global Tailwind theme.
- JSX uses semantic tokens and standard Tailwind size scales without scattered literals.
- MUI provides a deliberate primitive or icon and does not compete with Tailwind styling.
- The implementation matches the reference layout at desktop and remains usable on smaller screens.
- Forms have labels, controls have accessible names, focus is visible, and keyboard behavior is preserved.
- No unrequested authentication, API, persistence, or business logic was introduced.
- `pnpm lint` and `pnpm build` pass from `frontend` under Node 26.

Prioritize correctness, architecture violations, accessibility, and visible design drift. Do not report subjective preferences as defects.
