---
name: build-faberon-backend
description: Build or modify Faberon's NestJS backend, including HTTP APIs, domain models, application use cases, PostgreSQL persistence, RabbitMQ messaging, migrations, Swagger contracts, configuration, health checks, and backend tests. Use for any implementation or architectural change under backend/.
---

# Build Faberon Backend

Apply domain-driven design without turning simple behavior into unnecessary framework code. Keep business rules independent of NestJS, Drizzle, transport DTOs, and messaging clients.

## Workflow

1. Read `CONSTITUTION.md` and inspect the affected bounded context.
2. Model behavior in the domain layer before selecting transport or persistence details.
3. Implement the use case in the application layer with explicit input and output ports.
4. Add infrastructure adapters for PostgreSQL, RabbitMQ, clocks, IDs, or external services.
5. Expose the use case through an interface adapter such as an HTTP controller.
6. Leave database migrations to the user unless they explicitly request migration work; never rely on schema synchronization.
7. Document every HTTP operation and its request, success response, and expected error responses in Swagger.
8. Test domain behavior and use cases in isolation, then cover adapter integration where the risk warrants it.
9. Run the required backend verification commands from `backend`.

## Architecture

- Organize code by bounded context, then by `domain`, `application`, `infrastructure`, and `presentation`.
- Keep domain entities, value objects, domain services, events, and repository interfaces free of NestJS and Drizzle imports.
- Put orchestration and transaction boundaries in application use cases. Depend on ports represented by explicit injection tokens.
- Keep controllers thin: validate and map DTOs, dispatch the use case, and map the result to a documented response.
- Keep Drizzle schemas, repositories, and mappers in infrastructure. Do not expose persistence models from HTTP endpoints.
- Publish integration events through a transactional outbox when state changes and messages must remain consistent.
- Make consumers idempotent. Treat message delivery as at least once and define retry/dead-letter behavior deliberately.
- Use configuration validation, structured logging, graceful shutdown, and health/readiness indicators.

## API contracts

- Enable global validation with unknown fields rejected and transformed values enabled.
- Use dedicated request and response DTOs with `@ApiProperty` or `@ApiPropertyOptional` on every field.
- Declare status codes and concrete schemas with `@ApiCreatedResponse`, `@ApiOkResponse`, and named error responses.
- Keep a stable global prefix and URI versioning. Do not leak stack traces or database errors.
- Represent identifiers, timestamps, enums, nullable fields, and examples accurately in OpenAPI.
- Order controller methods Create → Get → Update → Delete. For nested resources in the same controller, group by verb (all creates, then gets, then updates, then deletes), with parent before child within each group.
- Prefer full CRUD for mutable resources. Append-only collections (for example work-order history) expose create and get only. Authentication controllers expose only the auth verbs they need.
- Scope tenant data with `companyId` from `@CurrentUser()`. Pass `companyId` as the first parameter of tenant-scoped service and repository methods; never put "company" in those method names (use `findById(companyId, id)`, not `findByIdForCompany`).
- Prefer top-level resources for first-class entities (`/products`, `/work-orders`). Put foreign keys such as `customerId` in the request body on create and as an optional query filter on list; do not nest them under `/customers/:customerId/...` unless the screen is literally a customer sub-collection (for example contact).
- When linking related tenant entities, verify they belong to the same company (and the same customer when required).

## Verification

From `backend`, use Node 26 and pnpm, then run:

```sh
nvm use 26
pnpm lint
pnpm test
pnpm build
```

Run integration or end-to-end tests when changing adapters or HTTP contracts.
