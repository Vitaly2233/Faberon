# Faberon backend

Requires Node.js 26, pnpm 11, and Docker.

## Run locally

```bash
cp .env.example .env
pnpm install
docker compose up -d
pnpm dev
```

The API runs at `http://localhost:3000/api/v1` and Swagger UI at
`http://localhost:3000/docs`.

## Checks

```bash
pnpm lint
pnpm test
pnpm build
```

## Database migrations

Make sure `DATABASE_URL` is available in the shell, then generate and run Drizzle
migrations:

```bash
export DATABASE_URL=postgresql://faberon:faberon@localhost:5432/faberon
pnpm migration:generate
pnpm migration:run
```
