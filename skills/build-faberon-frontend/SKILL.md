---
name: build-faberon-frontend
description: Builds or extends the Faberon React frontend. Use for pages, routes, components, forms, responsive UI, frontend state, or design-system integration.
---

# Build Faberon Frontend

Follow `AGENTS.md` and `CONSTITUTION.md`, then inspect the affected route, page, store, and styles before editing.

## Workflow

1. Identify the owner of the behavior before choosing a file location.
2. Keep routing in `src/app` and use `src/pages/<feature>` as the route container boundary.
3. Put page-only components, data, and UI types beside their page.
4. When coordinated state warrants Zustand, put its store under `src/store`; select it and bind actions in the page container.
5. Pass typed data and callbacks into presentational children.
6. Reuse design tokens and accessible primitives. When colors or tokens change, also follow `skills/minimize-color-palette`.
7. Implement only the requested behavior and verify the result using the commands required by `AGENTS.md`.

## Placement guide

```text
src/
  app/                       # routes and application composition
  components/                # common, feature-neutral components
  pages/<feature>/
    <Feature>Page.tsx        # container
    components/              # page-owned presentation
    data/                    # page-owned static data
    types.ts                 # page-owned UI types
  store/                     # all Zustand stores and their store types
  styles/                    # global theme and design tokens
```

- Start a component under its owning page. Promote it to `src/components` only after unrelated features reuse a stable API.
- Keep business terminology and feature state out of common components.
- Stores never belong in `components`, `pages`, or a page-local `store` folder.
- A store may declare its state and action shape with a type alias or interface, but it must not import page-owned UI types.
- Component props may use interfaces or type aliases. Prefer interfaces for extendable object-shaped public props and type aliases for unions or composition; stay consistent within a file.
- Introduce `src/features/<feature>` only when one business feature owns behavior composed into multiple routes.

## Container boundary

```tsx
// Page container coordinates state and behavior.
const email = useLoginStore((state) => state.email)
const setEmail = useLoginStore((state) => state.setEmail)

return <LoginForm email={email} onEmailChange={setEmail} onSubmit={handleSubmit} />
```

`LoginForm` renders values and emits intent. It does not access Zustand, routing, APIs, or persistence directly.
