# Faberon Mobile — Phase 1 Baseline Audit

**Date:** 2026-07-18  
**Auditor role:** Senior/Staff React Native & Expo engineering review  
**Scope:** Production-oriented FSM/CRM mobile app (Customer, Technician, Owner)  
**Status:** Phase 2 implementation complete (2026-07-18)

### Phase 2 verification (post-implementation)

| Check | Result |
|-------|--------|
| `npm run lint` | ✅ Pass |
| `npm run typecheck` | ✅ Pass |
| `npm test -- --runInBand` | ✅ 9 suites, 30 tests pass |
| `npx expo-doctor` | ✅ 20/20 |
| `npm run format:check` | ⚠️ Pre-existing formatting drift (165 files) — run `npx prettier --write .` separately if desired |

**Phase 2 delivered:** typed routes (`src/constants/routes.ts`), session Zod validation, HTTP service factories decoupled from mock auth, global 401 handler, React Query focus manager + shared query client, `ReportRepairButton`, i18n error strings, `ARCHITECTURE.md`, CI scripts (`check`, `test:ci`, `format:check`), `@types/jest@29.5.14`.

### Phase 3 verification (post-implementation)

| Check | Result |
|-------|--------|
| `npm run lint` | ✅ Pass |
| `npm run typecheck` | ✅ Pass |
| `npm test -- --runInBand` | ✅ 12 suites (see test run) |

**Phase 3 delivered:** query hooks split into `src/hooks/queries/*`, customer tab screens extracted to `src/features/customer/screens/*`, RTL tests (`RoleGate`, `WorkOrderFilterTabs`, `auth-redirect`), localized `+not-found`, `MOBILE_ARCHITECTURE.md` workflow drift fixed.

---

## Phase 1 baseline (original audit)

**Original status:** Audit only — findings below informed Phase 2.

---

## Recommended Git branch before Phase 2

```bash
git checkout -b chore/architecture-audit-phase-2
```

---

## Executive summary

Faberon Mobile is a **well-started Expo SDK 57 application** with clear separation intentions: Expo Router for navigation, TanStack Query for server state, Zustand for locale, service interfaces with mock/HTTP switching, Zod for forms, and centralized design tokens. The codebase is **small enough to evolve pragmatically** without a rewrite.

**Current health (baseline):**

| Check | Result |
|-------|--------|
| `npm run lint` | ✅ Pass |
| `npx tsc --noEmit` | ❌ **1 error** (typed route path) |
| `npm test -- --runInBand` | ✅ 7 suites, 25 tests pass |
| `npx expo-doctor@latest` | ⚠️ 19/20 — `@types/jest` version mismatch |
| `npx expo install --check` | ⚠️ `@types/jest@30.0.0` — expected `29.5.14` |

The project is **not production-ready for real API mode** yet: HTTP is only partially wired, auth remains mock-only, API responses are not validated at boundaries, and there is no token refresh / global 401 handling. Mock mode is suitable for UX development and demos.

**Top priorities for Phase 2:**

1. **P0** — Fix HTTP auth coupling (HTTP services must not depend on `mockAuthService`).
2. **P0** — Ensure dev-only affordances (`EXPO_PUBLIC_DEV_ROLE_SWITCHER`) cannot ship enabled by default in production builds.
3. **P1** — Fix TypeScript typed-route failure and keep `tsc` green in CI.
4. **P1** — Add React Native TanStack Query `onlineManager` / `focusManager`.
5. **P1** — Validate session + API payloads with Zod at boundaries.
6. **P2** — Thin route files; consolidate hooks; expand tests and i18n for error strings.

---

## Baseline command output (recorded before changes)

### Lint

```
npm run lint  → exit 0
```

### TypeScript

```
app/(customer)/(tabs)/work-orders/[id].tsx(106,17): error TS2820:
Type '"/(customer)/work-orders/edit"' is not assignable to typed route union.
Did you mean '"/(customer)/work-orders"'?
```

### Tests

```
7 passed, 25 tests total (jest --runInBand)
```

### Expo Doctor

```
19/20 checks passed
✖ @types/jest — found 30.0.0, expected 29.5.14
```

### Expo install --check

```
@types/jest@30.0.0 — expected 29.5.14
```

---

## Current architecture

### High-level diagram

```
app/                          # Expo Router (routes + layouts only — target)
  _layout.tsx                 # QueryClient, fonts, locale hydrate
  index.tsx                   # Session → role home redirect
  (auth)/                     # login, forgot-password
  (customer)/                 # Stack: (tabs) + notifications
    (tabs)/                   # Customer tab navigator
  (technician)/               # Stack: (main) tabs + work-orders detail stack
  (owner)/                    # Stack: (main) tabs + work-orders detail stack
  +not-found.tsx

src/
  components/                 # ui/, navigation/, settings/
  features/                   # auth, assets, work-orders, notifications, i18n, …
  services/                   # interfaces + mock + partial http
  hooks/                      # use-app-queries.ts (monolithic), use-i18n.ts
  schemas/                    # Zod form schemas
  types/                      # domain + API types (mostly manual, not z.infer)
  constants/                  # tokens, env, i18n, tab-bar, roles
  utils/                      # permissions, work-orders, money, dates
  mocks/                      # seed-data (consumed by services only)
```

### Navigation & roles

- **Root:** `app/index.tsx` reads session → redirects to role home.
- **Guards:** `RoleGate` wraps each role layout; redirects unauthenticated users to login and wrong-role users to their home. **UX-only** — backend must enforce authorization.
- **Customer:** `(tabs)` group (pathless) — Home, Assets, Work Orders, Profile; notifications as stack screen outside tabs.
- **Technician / Owner:** `(main)` tabs + nested stacks for work-order detail.
- **Typed routes:** enabled (`experiments.typedRoutes` in `app.json`).

### State ownership (actual)

| Concern | Owner | Notes |
|---------|--------|------|
| Server data | TanStack Query | Central `use-app-queries.ts` |
| Session | Query cache + SecureStore via mock auth | No HTTP auth service |
| Locale | Zustand + SecureStore | Appropriate |
| Forms | React Hook Form + Zod | Used on auth, profile, WO create/edit |
| Route params | Expo Router | `[id]` dynamic routes |
| Dev role | Mock auth `activeRole` | **Risk if exposed in prod** |

No evidence of duplicating server lists in Zustand (good).

### Service layer

- **Composition root:** `src/services/index.ts` selects mock vs HTTP via `env.useMocks`.
- **HTTP today:** `httpWorkOrderService`, `httpPricingService` only.
- **HTTP auth:** `http-work-order.service.ts` imports `mockAuthService` for tokens — **architectural bug in API mode**.
- **API client:** `src/services/api/client.ts` — single `fetch` wrapper, JSON errors, no timeout, no 401 interceptor, no response Zod parsing.

### Configuration files reviewed

| File | Present | Notes |
|------|---------|-------|
| `package.json` | ✅ | Scripts: start, lint, typecheck, test — **no** `format:check`, `test:ci`, `check` |
| `tsconfig.json` | ✅ | `strict: true`, `@/*` → `./src/*`, **excludes `__tests__`** |
| `eslint.config.js` | ✅ | expo flat + prettier |
| `.prettierrc` | ✅ | No format script wired |
| `app.json` | ✅ | SDK 57, typed routes, secure-store plugin |
| `eas.json` | ❌ | Not present |
| `babel.config` / `metro.config` | ❌ | Using Expo defaults (acceptable) |
| `jest.config.js` | ✅ | jest-expo, path alias |

---

## Strengths

1. **Modern, appropriate stack** — Expo 57, RN 0.86, React 19, Expo Router, TanStack Query, RHF, Zod.
2. **Service interfaces** — Work orders, pricing, auth, assets, etc. have typed service contracts.
3. **Single mock/HTTP switch** at `services/index.ts` (not scattered in screens).
4. **Strict TypeScript** enabled; no `any` / `@ts-ignore` found in source scan.
5. **Design tokens** (`src/constants/tokens.ts`) — colors, typography, spacing, status palettes.
6. **i18n foundation** — `en` / `pl`, typed `AppStrings`, `useStrings()` / `useI18n()`, locale persisted in SecureStore.
7. **Permissions as pure functions** (`src/utils/permissions.ts`) — unit tested.
8. **Role-separated route groups** — clear customer / technician / owner trees.
9. **SecureStore for session** — appropriate for small session payload.
10. **Lint passes**; utility/schema tests provide a baseline safety net.

---

## Findings by severity

### P0 — Security / data-loss

| ID | Finding | Location | Recommendation |
|----|---------|----------|----------------|
| P0-1 | **HTTP services use mock auth for bearer tokens** | `http-work-order.service.ts`, `http-pricing.service.ts` | Introduce `HttpAuthService` (or shared session reader) used by all HTTP services; never import mock auth in HTTP path |
| P0-2 | **`EXPO_PUBLIC_DEV_ROLE_SWITCHER` defaults to `true`** | `src/constants/env.ts`, `.env.example` | Default `false`; enable only in `.env.local`; hide `DevRoleSwitcher` when false |
| P0-3 | **Session restored via `JSON.parse` without validation** | `mock-auth.service.ts` `getSession()` | Parse with Zod schema; clear corrupt session |
| P0-4 | **No global 401 / expired session handling** | `api/client.ts` | On 401: clear session, invalidate queries, redirect to login |
| P0-5 | **No token refresh strategy** | auth layer | Document contract; implement refresh or re-login flow before production API mode |
| P0-6 | **Client role checks are not authorization** | `RoleGate`, `permissions.ts` | Document; ensure backend parity; never store cross-tenant data in client cache without scoping |

### P1 — Serious architectural / runtime

| ID | Finding | Location | Recommendation |
|----|---------|----------|----------------|
| P1-1 | **TypeScript fails on typed route** | `work-orders/[id].tsx` → `/(customer)/work-orders/edit` | Regenerate types (`expo start`) or use `Href` / fix path; block CI on `tsc` |
| P1-2 | **Partial HTTP migration** | `services/index.ts` | Only WO + pricing use HTTP; auth, assets, customers, notifications, invoices remain mock — document or complete |
| P1-3 | **No TanStack Query RN focus/online integration** | `app/_layout.tsx` | Wire `focusManager` + `AppState`, `onlineManager` + NetInfo when adding offline UX |
| P1-4 | **Monolithic query hooks file** | `use-app-queries.ts` (~320 lines) | Split by domain; export query key factory from `core/query` |
| P1-5 | **Route files contain substantial UI logic** | `app/(customer)/(tabs)/*` | Extract screen components to `features/*/screens` |
| P1-6 | **`tsconfig` excludes tests from `tsc`** | `tsconfig.json` | Include tests in typecheck or use separate `tsconfig.test.json` in CI |
| P1-7 | **Documentation drift** | `MOBILE_ARCHITECTURE.md` | Still references `CUSTOMER_CONFIRMED` stage; update with audit |

### P2 — Maintainability / testing

| ID | Finding | Location | Recommendation |
|----|---------|----------|----------------|
| P2-1 | **Hardcoded English error strings in screens** | Many `app/**` screens | Move to i18n keys (`errors.loadFailed`, etc.) |
| P2-2 | **No component or integration tests** | — | Add RTL tests for forms, `RoleGate`, `AppTopBar`, critical flows |
| P2-3 | **No API response Zod validation** | HTTP services | Parse `apiRequest` responses with per-endpoint schemas |
| P2-4 | **Missing CI quality scripts** | `package.json` | Add `format:check`, `test:ci`, `check` aggregate |
| P2-5 | **No `eas.json`** | — | Add when preparing builds |
| P2-6 | **Duplicated UI** | Home + Naprawy report button | Extract `ReportRepairButton` shared component |
| P2-7 | **Query client created at module scope** | `app/_layout.tsx` | Acceptable for now; consider factory for tests |
| P2-8 | **not-found screen not localized** | `app/+not-found.tsx` | Use i18n |

### P3 — Optional improvements

| ID | Finding | Recommendation |
|----|---------|----------------|
| P3-1 | Lists use `.map()` not `FlatList` | Fine at current scale; migrate when lists grow |
| P3-2 | Light theme only | Tokens structured for extension; add dark when needed |
| P3-3 | `@expo/vector-icons` (Feather) | Still supported in SDK 57; no urgent migration |
| P3-4 | Barrel files | Keep `components/ui/index.ts` minimal; avoid deep feature barrels |

---

## Security checklist (baseline)

| Item | Status |
|------|--------|
| Secrets in source | ✅ None found |
| Secrets in `EXPO_PUBLIC_*` | ✅ Only API URL + feature flags (acceptable) |
| Token in SecureStore | ✅ Yes |
| Session validation on read | ❌ No Zod |
| Logout clears query cache | ✅ `queryClient.clear()` on logout |
| HTTP auth decoupled from mock | ❌ |
| Dev role switcher gated | ⚠️ Defaults on |
| HTTPS enforced | N/A (configurable URL) |
| Sensitive logging | ✅ No `console.*` in src scan |

---

## Routing checklist (baseline)

| Item | Status |
|------|--------|
| Role-based route groups | ✅ |
| Client-side `RoleGate` | ✅ |
| Pathless `(tabs)` / `(main)` groups | ✅ |
| Notifications outside tab bar | ✅ |
| Typed routes enabled | ✅ (one path broken) |
| `+not-found` route | ✅ |
| Deep linking scheme | ✅ `faberonmobile` |
| Duplicate route files on disk (customer) | ✅ Clean — only `(tabs)` tree |
| Thin route files | ⚠️ Many screens inline |

---

## TanStack Query checklist (baseline)

| Item | Status |
|------|--------|
| Query key factory | ✅ Basic in `use-app-queries.ts` |
| Mutation invalidation | ✅ Present on most mutations |
| `staleTime` default 30s | ✅ |
| Retries | ✅ `retry: 1` |
| `gcTime` explicit | ❌ Default |
| `enabled` on id queries | ✅ |
| Optimistic updates | ✅ None (appropriate) |
| `onlineManager` (RN) | ❌ |
| `focusManager` (AppState) | ❌ |
| Pagination | ❌ N/A yet |
| Error normalization | ⚠️ `ApiRequestError` only |

---

## Forms checklist (baseline)

| Form | RHF | Zod | i18n errors | Double-submit guard |
|------|-----|-----|-------------|---------------------|
| Login | ✅ | ✅ | ✅ | ✅ loading on button |
| Customer WO create/edit | ✅ | ✅ | Partial | ✅ |
| Profile settings | ✅ | ✅ | Partial | ✅ |
| Technician profile | ✅ | ✅ | Partial | ✅ |
| Estimate / comment | ✅ | ✅ | Partial | ✅ |

Server-side validation errors from API are not consistently mapped to form fields in HTTP mode (mock mode rarely returns them).

---

## Testing gaps

**Covered today (25 tests):**

- `auth.schema`, `money`, `permissions`, `work-orders`, `customer-work-orders`, `assets`, `invoice` utils

**Not covered:**

- Any screen or component (RTL)
- `RoleGate`, auth redirect, `services/index` wiring
- Mock service integration flows
- HTTP client / error mapping
- i18n parity tests (en vs pl keys)
- Navigation / deep links
- E2E (Detox/Maestro) — none

**Recommended E2E scenarios (future):**

1. Customer creates service request (mock).
2. Technician assigns self and advances stage.
3. Owner views read-only WO list/detail.
4. Wrong role cannot access another role’s tabs (client UX).

---

## Accessibility gaps

**Present:**

- Many `Pressable`s use `accessibilityRole="button"`.
- Some `accessibilityLabel` on icon buttons (bell, settings).
- `LanguagePicker` uses `accessibilityState.selected`.

**Gaps:**

- Inconsistent `accessibilityLabel` on cards and list rows.
- Hardcoded English in `ErrorState` messages (screen reader).
- Touch targets generally ~36–56px (acceptable).
- No systematic `accessibilityHint`.
- Dynamic type / font scaling not audited.
- Status badges rely on color + text (OK if text always present).

---

## Performance risks

| Risk | Severity | Notes |
|------|----------|-------|
| Full list re-render on filter change | Low | Small mock datasets |
| No list virtualization | Low now | Will matter with 50+ WOs |
| `useMemo` on filtered data | OK | Used in several screens |
| Query waterfalls on detail screens | Medium | WO detail + assets + pricing sequential |
| Module-scope `QueryClient` | Low | |
| Reanimated / worklets in deps | Low | Standard Expo 57 stack |

---

## Dependency risks

| Package | Risk | Action |
|---------|------|--------|
| `@types/jest@30` vs Expo expected `29.5.14` | Low–Medium | `npx expo install @types/jest@29.5.14` |
| Expo SDK 57 / RN 0.86 | Low | Current target |
| `zod@4` | Low | Verify RHF resolver compatibility (working) |
| No `@react-native-community/netinfo` | Medium for offline | Add only when implementing connectivity UX |

---

## Mobile / FSM connectivity (explicit)

**Not offline-first today:**

- No durable outbox for mutations
- No draft persistence for WO forms
- No sync status UI
- No conflict resolution
- No idempotency keys on submissions
- Mock services use in-memory state (lost on reload except SecureStore session)

**When connectivity returns:** TanStack Query will refetch on remount/default behavior only — **not** configured for RN app focus/reconnect.

---

## Recommended target structure (pragmatic)

Do **not** move `app/` to `src/app/` unless team strongly prefers it — Expo convention is root `app/`. Align naming with features:

```
app/                          # routes + layouts only (keep)
src/
  core/
    api/                      # client.ts, errors.ts, interceptors
    auth/                       # session schema, token reader
    config/                     # env.ts (Zod-validated)
    query/                      # queryClient factory, keys, RN managers
    i18n/                       # move from constants + locale store
    storage/                    # SecureStore helpers
  features/
    auth/
    work-orders/                # rename from scattered WO files
    assets/
    notifications/
    profile/
    technician/
    owner/
    invoices/
    pricing/
  shared/
    ui/                         # from components/ui
    navigation/                 # AppTopBar, TabBarButton, …
    hooks/
    utils/
    constants/                  # tokens, roles, tab-bar
    types/
  mocks/
  test/                         # render helpers, MSW later
```

Migrate **feature by feature**; avoid empty folders.

---

## Proposed implementation plan (Phase 2+)

### Phase 2a — Stabilize (no behavior change)
- Fix P1-1 typed route / `tsc` green
- Pin `@types/jest` to Expo-compatible version
- Add `format:check`, `test:ci`, `check` scripts
- Update `MOBILE_ARCHITECTURE.md` drift

### Phase 2b — Security & API boundaries
- P0-1–P0-5 auth + HTTP client hardening
- Zod env + session schemas
- Default dev flags off in `.env.example`

### Phase 2c — Query & RN integration
- Split `use-app-queries.ts`
- `focusManager` / `onlineManager`
- Document refetch policy

### Phase 2d — Thin routes & i18n errors
- Move screen bodies to `features/*/screens`
- Externalize error strings

### Phase 2e — Tests
- RTL: login, RoleGate, one form, one mutation flow
- CI gate: `npm run check`

### Phase 2f — HTTP completion (when backend ready)
- HTTP implementations for remaining services
- Response validation + mappers

---

## Verification commands (target after Phase 2)

```bash
npm run format:check   # to be added
npm run lint
npm run typecheck
npm run test:ci        # to be added
npx expo install --check
npx expo-doctor@latest
```

---

## Remaining risks after audit (unchanged codebase)

1. Production API mode is **misleading** — partially wired HTTP with mock auth.
2. TypeScript CI would **fail** today on typed routes.
3. Test coverage is **narrow** — regressions in UI/navigation likely undetected.
4. i18n incomplete for operator-facing error copy.
5. No offline/sync story for field technicians despite FSM domain needs.

---

## Sign-off

Phase 1 audit is **complete**. Refactoring should proceed only on a dedicated branch, in the ordered phases above, with lint + typecheck + tests run after each phase.

**Next step:** Review this document → approve Phase 2a scope → create branch → implement stabilization fixes.
