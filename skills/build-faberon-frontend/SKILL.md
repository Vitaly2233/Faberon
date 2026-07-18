---
name: build-faberon-frontend
description: Builds or extends the Faberon React frontend. Use for pages, routes, components, forms, modals, responsive UI, frontend state, or design-system integration.
---

# Build Faberon Frontend

Follow `AGENTS.md` and `CONSTITUTION.md`, then inspect the affected route, page, modal, store, and styles before editing.

## Workflow

1. Identify the owner of the behavior before choosing a file location.
2. Keep routing in `src/app` and use `src/pages/<feature>` as the route container boundary.
3. Put page-only components, data, and UI types beside their page.
4. When coordinated state warrants Zustand, put its store under `src/store` (use a domain folder such as `store/modals/` when types and store logic belong together); select it and bind actions in a page or modal container.
5. For global dialogs, register the name in `store/modals/types.ts`, implement the container under `src/modals`, render it from `ModalsHost`, and open it with `useModalsStore().open`.
6. Pass typed data and callbacks into presentational children.
7. Reuse design tokens and accessible primitives. When colors or tokens change, also follow `skills/minimize-color-palette`.
8. Implement only the requested behavior and verify the result using the commands required by `AGENTS.md`.

## Placement guide

```text
src/
  app/                       # routes and application composition (mount ModalsHost)
  components/                # common, feature-neutral components (e.g. Modal shell)
  modals/                    # named modal containers + ModalsHost
  pages/<feature>/
    <Feature>Page.tsx        # page container
    components/              # page-owned presentation
    data/                    # page-owned static data
    types.ts                 # page-owned UI types
  store/                     # Zustand stores
    <domain>/                # optional domain folder (types + store + index)
  styles/                    # global theme and design tokens
```

- Start a component under its owning page. Promote it to `src/components` only after unrelated features reuse a stable API.
- Keep business terminology and feature state out of common components.
- Stores never belong in `components`, `pages`, or `modals`.
- A store may declare its state and action shape with a type alias or interface, but it must not import page UI types.
- Component props may use interfaces or type aliases. Prefer interfaces for extendable object-shaped public props and type aliases for unions or composition; stay consistent within a file.
- Introduce `src/features/<feature>` only when one business feature owns behavior composed into multiple routes.

## Containers

Page and modal containers coordinate state and behavior. Presentational children receive props and emit callbacks only.

```tsx
const openModal = useModalsStore((state) => state.open)

openModal('NewCustomer', {
  data: { initialName: 'Acme' },
  onSaved: ({ customerId }) => undefined,
})
```

```tsx
const email = useLoginStore((state) => state.email)
const setEmail = useLoginStore((state) => state.setEmail)

return <LoginForm email={email} onEmailChange={setEmail} onSubmit={handleSubmit} />
```

## Global modals

- Open and close through `store/modals` only (LIFO stack). Do not keep modal open state on pages.
- Add a modal by extending `ModalDefinitions`, adding `src/modals/<Name>Modal.tsx`, and switching on it in `ModalsHost`.
- `ModalsHost` maps the stack and chooses which modal to display; modal containers receive typed options as props.
- Use the shared `components/Modal` shell for backdrop and chrome.
