# Faberon

## Run the frontend

Requirements:

- Node.js 26
- pnpm 10.13.1

From the repository root, enter the frontend directory:

```sh
cd frontend
```

Select the project's Node.js version, install dependencies, and start the development server:

```sh
nvm use
pnpm install
pnpm dev
```

Open the local URL printed by Vite in your browser. The default is usually `http://localhost:5173`.

To verify a frontend change:

```sh
pnpm lint
pnpm build
```
