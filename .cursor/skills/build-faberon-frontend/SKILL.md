---
name: build-faberon-frontend
description: Builds or extends Faberon React frontend features with Vite, TypeScript, Tailwind, Zustand, routing, and the project's container/presentational architecture. Use for pages, routes, components, form UI, design tokens, responsive layouts, or frontend state in this repository.
---

# Build Faberon Frontend

Read `CONSTITUTION.md` from the repository root and inspect the existing feature before editing.

## Workflow

1. Put route declarations in `frontend/src/app` and page containers in `frontend/src/pages/<feature>`.
2. Use a feature Zustand store only for state that the container needs to coordinate.
3. Select store values and actions in the page container.
4. Pass typed values and event callbacks to child components.
5. Keep child components store-free, router-free, and side-effect-free.
6. Add product visual values to the global Tailwind theme in `frontend/src/styles/index.css`.
7. Use semantic tokens plus standard Tailwind spacing, radius, and font-size scales in JSX.
8. Use MUI only for an accessible primitive or icon that is worth the dependency.
9. Keep prototypes free of API, authentication, persistence, and speculative business logic.
10. Run `nvm use`, `pnpm lint`, and `pnpm build` from `frontend`.

## File placement

- Keep page-owned code feature-local by default. Put page-only components, data, and feature types under `src/pages/<feature>`.
- Put every Zustand store in the central `src/store` directory. Containers may own local component folders but must not contain store folders or store files.
- Use `src/shared/ui` only for stable visual primitives used by multiple unrelated features.
- Do not use a generic `src/components` directory as a dumping ground.
- Promote a local component to `shared/ui` only after it has real reuse and a feature-neutral prop API.
- Keep business terminology and feature state out of shared UI.
- Keep layout-specific components beside their layout, such as `src/pages/workspace/components`.
- Introduce `src/features/<feature>` when one business feature must be composed into multiple routes; pages should then compose features rather than own their internals.
- Preserve dependency direction: shared code must not import page or feature code, and one feature must not reach into another feature's internals.

```text
src/
  app/
  shared/ui/
  store/
    customersStore.ts
  pages/
    customers/
      CustomersPage.tsx
      components/
      data/
      types.ts
```

## Boundary example

```tsx
// Container selects state and binds actions.
<LoginForm value={form} onEmailChange={setEmail} onSubmit={handleSubmit} />

// Child renders data and emits intent.
type LoginFormProps = {
  value: LoginFormValues
  onEmailChange: (email: string) => void
  onSubmit: () => void
}
```

Never import a Zustand store, router hook, or API client into `LoginForm`.
