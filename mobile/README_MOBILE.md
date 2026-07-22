# Faberon Mobile

React Native mobile app for Faberon field service workflows.

## Install

```bash
cd "D:\faberon all\faberon-mobile"
npm install
```

Copy environment defaults:

```bash
copy .env.example .env
```

## Run

```bash
npm start
npm run android
```

## Scripts

- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript strict check
- `npm run test` — Jest unit tests

## Docs

- [MOBILE_ARCHITECTURE.md](./MOBILE_ARCHITECTURE.md)
- [MOBILE_IMPLEMENTATION_PLAN.md](./MOBILE_IMPLEMENTATION_PLAN.md)

## Mock mode

Set `EXPO_PUBLIC_USE_MOCKS=true` in `.env`. Mock data is accessed through `src/services/*` only.

## Design reference

`D:\faberon all\faberon design\FaberonDesign` — especially `MobileClient.tsx`.

## Status

Phase 7 notifications and invoice preview complete. Phase 8 (backend HTTP services) is next.
