# Faberon engineering constitution

These are durable architectural and product-engineering principles. Repository operation belongs in `AGENTS.md`; task procedures belong in project skills.

## I. Ownership is explicit

Routes live in `frontend/src/app`. Route-level pages are containers and own page-specific components, data, and UI types under `frontend/src/pages/<feature>`. Common components live in `frontend/src/components` only after they have a stable, feature-neutral API and reuse across unrelated features.

Global dialogs live in `frontend/src/modals`. Each named modal is a container. `ModalsHost` is mounted once from application composition and decides which open modals to render. Shared dialog chrome (backdrop, shell) belongs in `frontend/src/components` when feature-neutral.

Dependencies point from pages and modals toward common code and stores, never from common code toward pages or modals. One feature must not import another feature's internals.

## II. Containers coordinate behavior

Page containers and modal containers select Zustand state, bind actions, use router hooks when needed, and make navigation or interaction decisions. Presentational components receive typed props, render UI, and emit callbacks. They do not import stores, router hooks, API clients, or other side-effect services.

Every Zustand store lives in `frontend/src/store`. Group related store modules in a domain folder when types and store logic belong together (for example `store/modals/`). A store is infrastructure, never a common component or page-owned module. Store-specific state and action types stay with the store and must not depend on page UI types.

## III. Global modals are store-driven

Named application modals open and close through `store/modals`, not local page state. Register each modal name and its open-time `data` and callbacks in `store/modals/types.ts`. The stack is LIFO: `open` pushes (re-open moves that name to the top); `close` pops the top entry. Callers open modals by name and may pass typed callbacks such as `onSaved`, `onClosed`, or `onError`. Do not mount feature modals from individual pages; `ModalsHost` owns display.

## IV. Abstractions follow proven reuse

Keep feature code local by default. Prefer small components with one visual responsibility and composition over broad components controlled by many flags. Extract common code only when reuse and a feature-neutral contract are clear.

## V. The design system is centralized

Tailwind semantic tokens are the source of truth for product colors, typography, shadows, layout sizes, and exceptional visual values. Define them in `frontend/src/styles/index.css`. Components use those tokens and Tailwind's standard scales instead of local literals or competing theme systems. Use MUI selectively for an accessible primitive or icon; Tailwind owns visual styling.

## VI. Accessibility and resilience are product requirements

Use semantic HTML, associated labels, descriptive accessible names, visible focus states, keyboard-operable controls, readable contrast, and responsive layouts. Decorative content must remain silent to assistive technology.

## VII. Scope and dependencies stay intentional

Implement the requested behavior without speculative authentication, persistence, API integration, or business logic. Add a dependency only when the existing stack cannot meet a concrete need and the maintenance cost is justified.

## VIII. Changes remain verifiable

Keep strict TypeScript and automated checks healthy. Validate changes in proportion to their risk, resolve introduced diagnostics, and leave production builds warning-free where practical.

Do not add new automated tests until this temporary constraint is explicitly lifted. Continue running and maintaining the existing checks.

## IX. The backend protects the domain

Backend code is organized by bounded context with domain, application, infrastructure, and presentation boundaries. Domain behavior remains independent of NestJS, transports, databases, and brokers. Dependencies point inward through explicit ports; adapters implement those ports at the edge.

Business state and emitted integration events remain consistent. Use PostgreSQL migrations for schema evolution and a transactional outbox for RabbitMQ messages coupled to database writes. Consumers assume at-least-once delivery and are idempotent.

## X. API contracts are explicit

Validate inputs at the boundary and expose dedicated request and response models. Every HTTP endpoint documents its success and expected error schemas in OpenAPI. Do not expose persistence models, internal exceptions, secrets, or infrastructure details through public contracts.

Controller handlers must declare an explicit TypeScript return type using the concrete response DTO (`Promise<CustomerResponse>`, `Promise<ContactResponse[]>`, `Promise<void>`, and so on). Do not rely on inferred return types. That keeps response-contract drift visible at compile time when DTOs or returned values change.

In resource controllers, declare handler methods in Create → Get → Update → Delete order. When a controller owns nested resources, keep the same verb grouping: all creates, then all gets, then all updates, then all deletes (parent before child within each group when both appear). Append-only or auth-only surfaces expose only the verbs they support, still in that relative order.

Tenant-scoped application and repository methods take `companyId` as their first parameter and must not include "company" in the method name.

## XI. Prefer fail-fast over sentinel values

Do not paper over missing required inputs with empty strings, `0`, fake ids, nullish coalescing placeholders, or "disabled" stand-in keys. Express required values in the type system (`string`, not `string | undefined`) and keep call sites honest.

When a value may be absent (for example an optional route param), branch at the boundary before invoking code that requires it—extract a child component so hooks receive defined arguments and stay compatible with the rules of hooks. Do not add redundant runtime checks for parameters the type system already requires.
