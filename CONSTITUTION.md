# Faberon engineering constitution

Durable architectural and product-engineering principles for every application in this repository (`frontend`, `backend`, `mobile`). Operational AI instructions belong in `AGENTS.md`. Task workflows belong in project skills under `skills/`.

## Shared principles

### I. Ownership is explicit

Each application owns its routes, feature code, and shared primitives. Dependencies point toward shared/common code, never from common code into feature or route internals. One feature must not import another feature's internals.

### II. Containers coordinate; children present

Containers (pages, screens, named modals) own data fetching, stores, routing, and interaction decisions. Presentational components receive typed props, render UI, and emit callbacks. They do not import stores, router hooks, API clients, or other side-effect services.

### III. Abstractions follow proven reuse

Keep feature code local by default. Prefer small components with one visual responsibility and composition over broad components controlled by many flags. Extract common code only when reuse and a feature-neutral contract are clear.

### IV. Scope and dependencies stay intentional

Implement the requested behavior without speculative authentication, persistence, API integration, or business logic. Add a dependency only when the existing stack cannot meet a concrete need and the maintenance cost is justified.

### V. Changes remain verifiable

Keep strict TypeScript and automated checks healthy. Validate changes in proportion to their risk, resolve introduced diagnostics, and leave production builds warning-free where practical.

Do not add new automated tests until this temporary constraint is explicitly lifted. Continue running and maintaining the existing checks.

### VI. Secrets and contracts stay intentional

Keep secrets out of the repository. Document configuration in `.env.example` (or the app equivalent) and validate runtime configuration at the boundary. Do not leak persistence models, internal exceptions, or infrastructure details through public contracts.

---

## Frontend (`frontend/`)

### VII. Web ownership and layout

Routes live in `frontend/src/app`. Route-level pages are containers and own page-specific components, data, and UI types under `frontend/src/pages/<feature>`. Common components live in `frontend/src/components` only after they have a stable, feature-neutral API and reuse across unrelated features.

Global dialogs live in `frontend/src/modals`. Each named modal is a container. `ModalsHost` is mounted once from application composition and decides which open modals to render. Shared dialog chrome (backdrop, shell) belongs in `frontend/src/components` when feature-neutral.

Every Zustand store lives in `frontend/src/store`. Group related store modules in a domain folder when types and store logic belong together (for example `store/modals/`). A store is infrastructure, never a common component or page-owned module. Store-specific state and action types stay with the store and must not depend on page UI types.

### VIII. Global modals are store-driven

Named application modals open and close through `store/modals`, not local page state. Register each modal name and its open-time `data` and callbacks in `store/modals/types.ts`. The stack is LIFO: `open` pushes (re-open moves that name to the top); `close` pops the top entry. Callers open modals by name and may pass typed callbacks such as `onSaved`, `onClosed`, or `onError`. Do not mount feature modals from individual pages; `ModalsHost` owns display.

### IX. Web design system and accessibility

Tailwind semantic tokens are the source of truth for product colors, typography, shadows, layout sizes, and exceptional visual values. Define them in `frontend/src/styles/index.css`. Components use those tokens and Tailwind's standard scales instead of local literals or competing theme systems. Use MUI selectively for an accessible primitive or icon; Tailwind owns visual styling.

Use semantic HTML, associated labels, descriptive accessible names, visible focus states, keyboard-operable controls, readable contrast, and responsive layouts. Decorative content must remain silent to assistive technology.

---

## Backend (`backend/`)

### X. The backend protects the domain

Backend code is organized by bounded context with domain, application, infrastructure, and presentation boundaries. Domain behavior remains independent of NestJS, transports, databases, and brokers. Dependencies point inward through explicit ports; adapters implement those ports at the edge.

Business state and emitted integration events remain consistent. Use PostgreSQL migrations for schema evolution and a transactional outbox for RabbitMQ messages coupled to database writes. Consumers assume at-least-once delivery and are idempotent.

### XI. API contracts are explicit

Validate inputs at the boundary and expose dedicated request and response models. Every HTTP endpoint documents its success and expected error schemas in OpenAPI. Do not expose persistence models, internal exceptions, secrets, or infrastructure details through public contracts.

In resource controllers, declare handler methods in Create → Get → Update → Delete order. When a controller owns nested resources, keep the same verb grouping: all creates, then all gets, then all updates, then all deletes (parent before child within each group when both appear). Append-only or auth-only surfaces expose only the verbs they support, still in that relative order.

Tenant-scoped application and repository methods take `companyId` as their first parameter and must not include "company" in the method name.

Prefer top-level resources for first-class entities (`/products`, `/work-orders`). Put foreign keys such as `customerId` in the request body on create and as an optional query filter on list; do not nest them under `/customers/:customerId/...` unless the screen is literally a customer sub-collection (for example contact).

When composing related reads (populate/include), keep entity repositories focused on their own model; orchestrate batch loads in the application layer unless a dedicated read/query adapter is justified.

---

## Mobile (`mobile/`)

### XII. Mobile ownership and layout

Routes live in `mobile/app` (Expo Router). Keep route files thin: params, layouts, role gates, and re-exports. Feature screens and feature UI live under `mobile/src/features/<feature>` (including `features/<feature>/screens` when a screen body is extracted from `app/`).

Shared presentational chrome lives in `mobile/src/components` only with a stable, feature-neutral API. Domain service interfaces and mock/HTTP adapters live in `mobile/src/services`. TanStack Query hooks live in `mobile/src/hooks`. Shared tokens, routes, roles, and i18n catalogs live in `mobile/src/constants`.

### XIII. Mobile containers and data flow

Feature screens and route containers coordinate queries, mutations, navigation, and local stores. Presentational feature components and shared UI receive typed props and emit callbacks; they do not call services or Query hooks directly.

Preferred data flow:

```text
Screen/container → query/mutation hooks → services → mock or HTTP adapter
```

Use TanStack Query for server state. Keep Zustand for small client concerns (for example locale or explicit dev-only UI state), not as a second server cache. Prefer typed route helpers in `src/constants/routes.ts` over hard-coded path strings.

### XIV. Mobile design system, i18n, and accessibility

Product colors, spacing, radii, and typography come from centralized tokens in `mobile/src/constants/tokens.ts`. Prefer those tokens over one-off literals.

Locale strings live in typed catalogs under `mobile/src/constants/i18n` and are accessed through `useI18n` / `useStrings`. Keep catalogs and locale selection in sync when adding copy.

Preserve accessible labels, readable contrast, and touch-friendly targets. Role-based UI gates are not a substitute for backend authorization.
