---
name: build-faberon-mobile
description: Builds or extends the Faberon Expo/React Native mobile app. Use for Expo Router screens, feature UI, TanStack Query hooks, services, forms, i18n, tokens, role portals, or mobile architecture work under mobile/.
---

# Build Faberon Mobile

Follow `AGENTS.md` and `CONSTITUTION.md`, then inspect the affected route, feature, hook, and service before editing. When using Expo APIs, read the Expo SDK docs version noted in `AGENTS.md`.

## Workflow

1. Identify the owner of the behavior before choosing a file location.
2. Keep Expo Router files in `app/` thin: layouts, params, role gates, and re-exports.
3. Put feature screens and feature UI under `src/features/<feature>` (use `screens/` when extracting screen bodies from `app/`).
4. Put shared presentational chrome in `src/components` only with a stable, feature-neutral API.
5. Wrap server reads/writes in hooks under `src/hooks` (TanStack Query). Call `services.*` from hooks, not from presentational components.
6. Keep mock and HTTP adapters behind service interfaces in `src/services`. Do not embed mock arrays or raw fetch in screens.
7. Use centralized tokens in `src/constants/tokens.ts` and typed i18n catalogs in `src/constants/i18n`.
8. Prefer typed helpers in `src/constants/routes.ts` over hard-coded paths.
9. Implement only the requested behavior and verify with the mobile commands in `AGENTS.md`.

## Placement guide

```text
mobile/
  app/                         # Expo Router (thin)
  src/
    components/                # shared presentational UI
    constants/                 # tokens, routes, roles, i18n, env
    core/query/                # query client, keys, RN focus manager
    features/<feature>/        # feature UI, screens, small stores
    hooks/                     # TanStack Query hooks
    schemas/                   # Zod schemas
    services/                  # interfaces + mock/HTTP adapters
    types/                     # domain + API types
    utils/                     # pure helpers
    mocks/                     # seed data for mock services
```

## Containers

Screen/feature containers coordinate queries, mutations, navigation, and small client stores. Presentational children receive props and emit callbacks only.

```tsx
const workOrdersQuery = useWorkOrdersQuery()

return (
  <WorkOrderCard
    order={order}
    onPress={() => router.push(routes.customer.workOrder(order.id))}
  />
)
```

## Verification

From `mobile`, use Node 26 and npm:

```sh
nvm use 26
npm run lint
npm run typecheck
npm test -- --runInBand
```

Use `npm run check` when a fuller gate is appropriate.
