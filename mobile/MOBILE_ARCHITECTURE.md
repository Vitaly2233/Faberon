# Faberon Mobile — Architecture

## Overview

Faberon Mobile is a React Native (Expo) app for **CUSTOMER**, **TECHNICIAN**, and limited **OWNER** field workflows. It uses mock services first, with a replaceable service layer for future REST integration.

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Expo SDK 57, React Native 0.86, React 19 |
| Navigation | Expo Router (file-based) |
| Server state | TanStack Query |
| Forms | React Hook Form + Zod |
| Auth storage | Expo SecureStore |
| Push (future) | Expo Notifications |
| Client state | Zustand only for dev role switcher |
| Styling | StyleSheet + centralized tokens |
| Language keys | English in `src/constants/i18n/en.ts` |

## Folder structure

```
app/                          # Expo Router routes only
  _layout.tsx                 # Root providers (Query, fonts)
  app/index.tsx                   # Session redirect hub
  (auth)/                     # Login + forgot password
  (customer)/                 # Customer tab navigation
  (technician)/               # Technician tab navigation
  (owner)/                    # Limited owner stack

src/
  components/ui/              # Reusable visual components
  features/                   # Feature-specific UI + small stores
  services/                   # API abstractions + mock/http impl
  hooks/                      # TanStack Query hooks
  schemas/                    # Zod validation
  types/                      # Domain + API TypeScript types
  constants/                  # tokens, env, i18n, roles
  utils/                      # dates, money, permissions
  mocks/                      # Seed data (not used in screens directly)
```

## Layering rules

1. **Screens** (`app/`) compose UI and call hooks — no embedded mock arrays.
2. **Hooks** (`src/hooks/`) wrap TanStack Query and call services.
3. **Services** (`src/services/`) implement interfaces; mocks and HTTP are swappable.
4. **Types/schemas** define contracts shared across layers.
5. **UI components** are presentational; business rules live in utils/features.

## Domain model highlights

### Work order

- `id`: UUID string
- `number`: visible incrementing number (assigned by backend in production)
- `status`: `DRAFT | SUBMITTED | ACCEPTED | IN_PROGRESS | COMPLETED | CANCELLED`
- `workflowStage`: `WAITING | TRAVEL_AND_DIAGNOSIS | WAITING_FOR_PARTS | REPAIRED` (terminal for customers; legacy `CUSTOMER_CONFIRMED` normalized to `REPAIRED`)
- `timeline[]`: typed events with `customerVisible` flag

### Asset (generic)

Printer is `assetType: 'printer'`. Includes meter readings and ownership type.

### Money

Stored as integer minor units in types (`MoneyMinor`). Formatting via `src/utils/money.ts`.

### Permissions

UI enforces role rules in `src/utils/permissions.ts`. Comments in code remind that **backend must enforce the same rules**.

## Mock mode

Set in `.env`:

```env
EXPO_PUBLIC_USE_MOCKS=true
EXPO_PUBLIC_DEV_ROLE_SWITCHER=true
```

`src/services/index.ts` exports mock implementations when mocks are enabled. Screens never import `src/mocks/seed-data.ts` directly.

Development role selection sets the mock auth persona via `mockAuthService.setDevRole()` (remove before production).

## Authentication flow

1. Login form validates with Zod.
2. `AuthService.login()` returns session.
3. Session stored in SecureStore.
4. Root `app/index.tsx` reads session query and routes to the role group.
5. `RoleGate` protects each role layout from cross-role access.

## TanStack Query strategy

| Query key | Data |
|-----------|------|
| `session` | Auth session |
| `workOrders` | Role-filtered work orders |
| `workOrders/:id` | Detail |
| `assets` | Customer assets |
| `notifications` | In-app notifications |

Mutations invalidate affected lists/details. Mock services mutate in-memory copies.

## Design system

Tokens in `src/constants/tokens.ts` mirror `FaberonDesign/src/app/components/MobileClient.tsx`:

- Canvas background `#FAFAF8`
- Primary brand `#202020`
- Workflow stage semantic colors
- Inter font family
- 44px minimum touch targets

## Testing

- Unit tests for money, permissions, Zod schemas
- Future component tests for critical UI (workflow tracker, status badge)

## Current limitations (Phase 2)

- No role-based navigation yet
- No real HTTP client wiring
- No push notification registration
- No invoice/PDF preview screens
- Foundation screen is dev-only preview

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `EXPO_PUBLIC_API_URL` | `http://localhost:3000/api/v1` | Future REST base URL |
| `EXPO_PUBLIC_USE_MOCKS` | `true` | Toggle mock services |
| `EXPO_PUBLIC_DEV_ROLE_SWITCHER` | `true` | Show dev role picker on login |

Copy `.env.example` to `.env` for local overrides. Do not commit `.env`.
