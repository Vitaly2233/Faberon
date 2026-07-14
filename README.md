# Faberon

Faberon is a full-stack application with a React frontend and a NestJS backend.
The repository keeps both applications independent, with their own dependencies,
commands, and documentation.

## Structure

```text
Faberon/
├── frontend/          React, Vite, Tailwind CSS, MUI, and Zustand
│   └── src/
│       ├── app/       Routes and application setup
│       ├── pages/     Feature pages and page-owned components
│       ├── components/ Shared UI components
│       └── store/     Zustand stores
├── backend/           NestJS, Drizzle ORM, PostgreSQL, and RabbitMQ
│   └── src/
│       ├── customer/  Customer controller, service, domain, and repository
│       ├── database/  Database client, schemas, and relations
│       └── rabbitmq/  RabbitMQ initialization
└── skills/            Project-specific agent workflows
```

## Development

- [Frontend setup](frontend/README.md)
- [Backend setup](backend/README.md)

Run package-manager, development, test, lint, and build commands from the
relevant application directory.
