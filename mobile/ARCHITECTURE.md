# Faberon Mobile — Architecture

Expo Router app for Faberon field-service workflows. Three role-based portals share UI primitives, domain types, and a service layer that can run against mocks or HTTP.

Canonical engineering rules: repository root `CONSTITUTION.md` (mobile section). Agent workflow: root `AGENTS.md` and `skills/build-faberon-mobile`.

## Stack

| Layer | Choice |
| --- | --- |
| Runtime | Expo SDK 57, React 19, React Native 0.86 |
| Navigation | Expo Router (file-based, typed routes) |
| Server state | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Local state | Zustand (locale), SecureStore (session) |
| i18n | `src/constants/i18n` + `useI18n` / `useStrings` |

## Directory layout

```
app/                    # Expo Router screens (role groups)
src/
  components/           # Shared UI (Screen, buttons, navigation chrome)
  constants/            # env, tokens, routes, i18n
  core/query/           # Query client factory, keys, RN focus manager
  features/             # Feature UI + small feature logic
  hooks/                # TanStack Query hooks (use-app-queries.ts)
  mocks/                # Seed data for mock services
  schemas/              # Zod schemas (forms + session validation)
  services/             # Auth, API client, domain service interfaces + mocks/HTTP
  types/                # Domain + API TypeScript types
  utils/                # Pure helpers (dates, money, permissions, work orders)
```

## Navigation

- **Auth:** `app/(auth)/` — login, forgot password
- **Customer:** `app/(customer)/(tabs)/` — home, assets, work orders, profile; notifications on stack
- **Technician / Owner:** separate route groups with role-specific tabs and detail screens

Typed customer routes live in `src/constants/routes.ts`. Prefer these helpers over hard-coded path strings.

## Data flow

```
Screen → useAppQuery/Mutation (hooks/use-app-queries.ts)
       → services.* (src/services/index.ts)
       → mock service OR HTTP service factory
       → apiRequest (src/services/api/client.ts)
```

`services/index.ts` picks implementations from `EXPO_PUBLIC_USE_MOCKS`. HTTP services receive `AuthService` via `createWithAccessToken` — they never import mock auth directly.

## Auth & session

- `MockAuthService` persists session JSON in SecureStore.
- On read, `authSessionSchema` (Zod) validates stored data; corrupt sessions are cleared.
- HTTP `401` responses call `notifyUnauthorized()` → `UnauthorizedSessionHandler` clears session and redirects to login.

## React Query

- `createAppQueryClient()` — shared defaults (retry 1, staleTime 30s)
- `setupReactQueryFocusManager()` — refetch on app foreground (RN `AppState`)
- `queryKeys` — centralized in `src/core/query/keys.ts`

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `EXPO_PUBLIC_USE_MOCKS` | `true` | Mock vs HTTP services |
| `EXPO_PUBLIC_API_URL` | `http://localhost:3000/api/v1` | API base when mocks off |
| `EXPO_PUBLIC_DEV_ROLE_SWITCHER` | `false` | Login-screen role picker for dev |

## Quality gates

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
npm run check          # lint + format + typecheck + test:ci
```

## Workflow domain

Repair lifecycle stages are defined in `RepairWorkflowStage`. `REPAIRED` is terminal for customers (no separate confirmation step). Legacy `CUSTOMER_CONFIRMED` values are normalized via `normalizeWorkflowStage()`.
