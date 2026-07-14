# Faberon engineering constitution

These are durable architectural and product-engineering principles. Repository operation belongs in `AGENTS.md`; task procedures belong in project skills.

## I. Ownership is explicit

Routes live in `frontend/src/app`. Route-level pages are containers and own page-specific components, data, and UI types under `frontend/src/pages/<feature>`. Common components live in `frontend/src/components` only after they have a stable, feature-neutral API and reuse across unrelated features.

Dependencies point from pages toward common code, never from common code toward pages. One feature must not import another feature's internals.

## II. Containers coordinate behavior

Page containers select Zustand state, bind actions, use router hooks, and make navigation or interaction decisions. Presentational components receive typed props, render UI, and emit callbacks. They do not import stores, router hooks, API clients, or other side-effect services.

Every Zustand store lives in `frontend/src/store`. A store is infrastructure, never a common component or page-owned module. Store-specific state and action types stay with the store and must not depend on page UI types.

## III. Abstractions follow proven reuse

Keep feature code local by default. Prefer small components with one visual responsibility and composition over broad components controlled by many flags. Extract common code only when reuse and a feature-neutral contract are clear.

## IV. The design system is centralized

Tailwind semantic tokens are the source of truth for product colors, typography, shadows, and exceptional visual values. Components use those tokens and Tailwind's standard scales instead of local literals or competing theme systems. Use MUI selectively for an accessible primitive or icon; Tailwind owns visual styling.

## V. Accessibility and resilience are product requirements

Use semantic HTML, associated labels, descriptive accessible names, visible focus states, keyboard-operable controls, readable contrast, and responsive layouts. Decorative content must remain silent to assistive technology.

## VI. Scope and dependencies stay intentional

Implement the requested behavior without speculative authentication, persistence, API integration, or business logic. Add a dependency only when the existing stack cannot meet a concrete need and the maintenance cost is justified.

## VII. Changes remain verifiable

Keep strict TypeScript and automated checks healthy. Validate changes in proportion to their risk, resolve introduced diagnostics, and leave production builds warning-free where practical.

## VIII. The backend protects the domain

Backend code is organized by bounded context with domain, application, infrastructure, and presentation boundaries. Domain behavior remains independent of NestJS, transports, databases, and brokers. Dependencies point inward through explicit ports; adapters implement those ports at the edge.

Business state and emitted integration events remain consistent. Use PostgreSQL migrations for schema evolution and a transactional outbox for RabbitMQ messages coupled to database writes. Consumers assume at-least-once delivery and are idempotent.

## IX. API contracts are explicit

Validate inputs at the boundary and expose dedicated request and response models. Every HTTP endpoint documents its success and expected error schemas in OpenAPI. Do not expose persistence models, internal exceptions, secrets, or infrastructure details through public contracts.
