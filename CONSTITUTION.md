# Faberon Frontend Constitution

## I. Work inside an application directory

The repository root is for coordination files and shared agent guidance. Before running an application, package manager, install, scaffold, lint, test, or build command, change the working directory to the target application: `frontend` or `backend`. Never run package-manager commands from the repository root.

Keep package-manager caches outside the repository. In particular, do not configure a repository-local pnpm store. Use pnpm's normal user-level store, or a temporary store outside the repository when a sandbox cannot access the user-level store.

## II. Containers own state

Route-level pages are containers. They select Zustand state, bind actions, and make interaction or navigation decisions. Every Zustand store lives in `frontend/src/store`; containers may own component folders but never store folders. Presentational components receive typed props, render UI, and emit callbacks only. They must not import stores, router hooks, API clients, or other side-effect services.

## III. Components stay focused

Split pages by visual responsibility and keep leaf components small. Prefer composition over configurable components with many flags. Keep feature-specific code near its page and share a primitive only after it has a stable, repeated use.

## IV. Design tokens are the source of truth

Define product colors, fonts, shadows, and any exceptional visual values in the global Tailwind theme. Use semantic token utilities in JSX and Tailwind's standard spacing, radius, and font-size scales. Do not scatter color literals, arbitrary font sizes, or competing MUI theme values through components.

## V. Accessibility is required

Use semantic HTML, associated form labels, descriptive accessible names, visible focus states, keyboard-operable controls, readable contrast, and responsive layouts. Decorative visuals must not add noise for assistive technology.

## VI. Dependencies are intentional

Use modern React, strict TypeScript, Vite, React Router, Zustand, and Tailwind. Use MUI selectively when its accessible primitive or icon set provides real value; Tailwind remains the styling source of truth. Use Node 26 and pnpm for all project commands.

## VII. Scope remains explicit

Implement only requested behavior. A visual prototype must not acquire authentication, persistence, API calls, or speculative business logic. Routes and local UI interactions are allowed when needed to demonstrate the page.

## VIII. Changes are verified

Before handing off frontend changes, run `pnpm lint` and `pnpm build` from `frontend` under Node 26. Resolve introduced diagnostics and keep the production build warning-free where practical.
