# Faberon Mobile — Implementation Plan

Last updated: 2026-07-18

## 1. Design folder findings

**Location:** `D:\faberon all\faberon design\FaberonDesign`

This is a **Figma Make exported web prototype** (package name `@figma/my-make-file`), linked to Figma file [Revise app design guidelines](https://www.figma.com/design/cVJu7Gt5zrX3271W6EBRPG/Revise-app-design-guidelines).

It is **not** a React Native project. It combines:

- A **desktop admin shell** for owner/technician (`App.tsx`, dark sidebar `#141414`)
- A **customer mobile portal** preview (`MobileClient.tsx`, route `/mobile`, max width 430px phone frame)

Shared mock state lives in `src/app/store.tsx` with seed customers, printers, work orders, and notifications.

---

## 2. Technology / formats detected

| Format | Usage |
|--------|--------|
| TypeScript (`.tsx`, `.ts`) | All UI and logic |
| Vite 6 | Dev server and build |
| Tailwind CSS 4 | Utility styling |
| shadcn/ui + Radix UI | Desktop component library (`src/app/components/ui/*`) |
| Lucide React | Icons |
| CSS variables | `src/styles/theme.css`, `default_shadcn_theme.css` |
| PNG assets | Figma imports under `src/imports/` |
| Markdown | Guidelines (mostly template), color palette notes |

---

## 3. Reusable design elements (mapped to mobile tokens)

| Element | Design source | Mobile token / component |
|---------|---------------|--------------------------|
| Primary brand | `#202020` mobile, `#2B2B2B` admin | `colors.brand.primary` |
| Canvas background | `#FAFAF8` | `colors.background.canvas` |
| Login background | `#F5F5F2` | `colors.background.login` |
| Typography | Inter, black/extrabold headings | `@expo-google-fonts/inter` |
| Spacing | 20px horizontal, 76px bottom nav | `spacing`, `layout.bottomNavHeight` |
| Border radius | 18–26px cards, 16px inputs | `radii` |
| Buttons | 56px height, dark fill | `AppButton` |
| Inputs | Rounded bordered fields | `AppInput` |
| Cards | White bordered + dark hero cards | `Card` |
| Status badges | 5 workflow pills | `StatusBadge` |
| Navigation | 4 bottom tabs | Phase 3 tab layouts |
| Modals | Bottom sheet / dialog patterns | `ConfirmationModal` |
| Timeline | WO detail progress + history | `TimelineItem` |
| Empty/loading/error | Not explicit | `EmptyState`, `LoadingState`, `ErrorState` |

---

## 4. Screens present in design

### Customer mobile (`MobileClient.tsx`)

1. Login (+ help bottom sheet)
2. Home — greeting, active repair card, printer preview, latest update
3. Printers list — search, stats, cards
4. Repairs list — filters (All/Active/Completed), cards
5. Profile — contact rows, service provider, sign out
6. Notifications — unread dots, mark all read
7. Create service request — printer picker, problem, address/contact, success state
8. Printer detail — hero, B&W meter, warranty, location, repair history
9. Work order detail — status hero, 5-step tracker, service details, updates, confirm repair

### Desktop admin (reference, not mobile target)

- Login (split panel)
- Work orders list / create / detail (stage stepper, pricing, invoice modal)
- Customers list / add / detail
- Printers list / add / detail (meter readings table)
- Admin settings (company name/logo)

---

## 5. Missing screens vs user stories

| Required screen / capability | Design coverage |
|------------------------------|-----------------|
| Technician mobile navigation + flows | **Missing entirely** |
| Owner mobile (limited WO/customer/asset views) | **Missing** |
| Forgot password placeholder | Link only |
| Dev role switcher (CUSTOMER/TECHNICIAN/OWNER) | Desktop owner/tech only |
| Edit unaccepted work order | Mentioned in copy, no dedicated screen |
| Pricing line items (technician) | Desktop only |
| Invoice / service report preview | Desktop invoice modal only |
| PDF generation placeholder | Not in mobile design |
| Offline / no-connection state | Not in design |
| Dedicated loading/empty/error components | Not in design |
| Full meter reading history | Partial stat only |
| Push notification registration | Not in design (in-app list exists) |

---

## 6. Recommended mobile architecture

- **Expo Router** file-based routes grouped by role: `(auth)`, `(customer)`, `(technician)`, `(owner)`
- **TanStack Query** for all server state (mock or HTTP)
- **Service interfaces** swappable at `src/services/index.ts`
- **Strict domain types** separating `WorkOrderStatus` and `RepairWorkflowStage`
- **Generic Asset** model; printer = `assetType: 'printer'`
- **Permissions** in UI via `src/utils/permissions.ts` (backend must enforce too)
- **i18n-ready strings** in `src/constants/i18n/en.ts`
- **Design tokens** in `src/constants/tokens.ts` — no hardcoded colors in screens

---

## 7. Planned folder structure

```
app/
  _layout.tsx
  index.tsx
  (auth)/
    login.tsx
    forgot-password.tsx
  (customer)/
    _layout.tsx
    index.tsx                 # home
    assets/
    work-orders/
    notifications.tsx
    profile.tsx
  (technician)/
    _layout.tsx
    index.tsx
    available.tsx
    my-orders.tsx
    work-orders/[id].tsx
  (owner)/                    # limited scope
    work-orders/

src/
  components/ui/
  features/
  services/
  hooks/
  schemas/
  types/
  constants/
  utils/
  mocks/
```

---

## 8. Packages installed (Phase 2)

| Package | Why |
|---------|-----|
| `expo`, `expo-router` | Core app + navigation |
| `@tanstack/react-query` | Server state / caching |
| `react-hook-form`, `@hookform/resolvers`, `zod` | Forms + validation |
| `expo-secure-store` | Auth token persistence |
| `expo-notifications` | Future push integration |
| `zustand` | Dev-only role switcher state |
| `@expo-google-fonts/inter` | Design typography |
| `@expo/vector-icons` | Tab/header icons |
| `eslint`, `prettier`, `jest`, `@testing-library/react-native` | Quality tooling |

---

## 9. Files created in Phase 2

### Documentation
- `README_MOBILE.md`
- `MOBILE_ARCHITECTURE.md`
- `MOBILE_IMPLEMENTATION_PLAN.md`
- `.env.example`

### Config
- `eslint.config.js`, `.prettierrc`, `jest.config.js`

### App
- `app/_layout.tsx` — fonts, QueryClient, Stack
- `app/index.tsx` — foundation preview screen
- `app/+not-found.tsx`

### Source
- `src/constants/tokens.ts`, `env.ts`, `roles.ts`, `i18n/en.ts`
- `src/types/*` — domain models
- `src/schemas/*` — Zod forms
- `src/utils/*` — dates, money, permissions + tests
- `src/mocks/seed-data.ts`
- `src/services/*` — auth, work orders, assets, notifications (mock)
- `src/hooks/use-app-queries.ts`
- `src/features/auth/dev-auth.store.ts`
- `src/components/ui/*` — AppButton, AppInput, Screen, Card, StatusBadge, states, modal, timeline

---

## 10. Assumptions and contradictions

1. **Five workflow stages** — user story mentions four but lists five; implement all five enums.
2. **Status vs stage** — design uses single `stage` field; mobile/backend split into `status` + `workflowStage`.
3. **Asset naming** — design says "printers"; code uses generic `Asset`.
4. **Color evolution** — palette notes mention teal/blue; **mobile follows monochrome `#202020` client design**, not older teal admin experiments.
5. **Language** — design copy is English; i18n keys prepared for PL/UA/EN later.
6. **WO numbering** — mock simulates increment; production backend assigns sequence.
7. **Security** — UI hides forbidden actions; backend enforcement documented as required.

---

## Phased delivery

| Phase | Status | Scope |
|-------|--------|-------|
| 1 Analysis | ✅ Complete | This document |
| 2 Foundation | ✅ Complete | Expo project, tokens, UI kit, mocks, tests |
| 3 Auth + navigation | ✅ Complete | Login, role switcher, tab layouts |
| 4 WO vertical slice | ✅ Complete | Home → list → detail → confirm repair |
| 5 Assets | ✅ Complete | List, detail, history, create WO |
| 6 Technician workflow | ✅ Complete | Assign, stages, estimates, pricing |
| 7 Notifications + invoice | ✅ Complete | Center, deep links, preview |
| 8 Backend readiness | Next | HTTP services, endpoint docs |

---

## Backend endpoints required (Phase 8)

| Method | Path |
|--------|------|
| POST | `/auth/login` |
| POST | `/auth/logout` |
| GET | `/work-orders` |
| GET | `/work-orders/:id` |
| POST | `/work-orders` |
| PATCH | `/work-orders/:id` |
| POST | `/work-orders/:id/assign` |
| POST | `/work-orders/:id/stage` |
| POST | `/work-orders/:id/estimate` |
| POST | `/work-orders/:id/comments` |
| GET/POST | `/work-orders/:id/pricing` |
| GET | `/assets`, `/assets/:id` |
| GET | `/notifications`, PATCH read |

Error JSON: `{ "code": "WORK_ORDER_NOT_FOUND", "message": "Work order does not exist" }`

Dates: ISO 8601. Money: integer minor units in API types.
