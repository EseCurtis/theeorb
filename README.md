# Starter

Boilerplate for a three-surface TypeScript product:

- `app/` — Capacitor + Vite + React mobile client
- `server/` — Express + Prisma API
- `web/` — Next.js App Router web client
- `.agent/` — agent rules, project notes, and handover procedure

## Setup

Copy env examples before running a package:

```sh
cp app/.env.example app/.env
cp server/.env.example server/.env
cp web/.env.example web/.env
```

Install and run each surface from its own directory:

```sh
cd server && pnpm install && pnpm dev
cd app && pnpm install && pnpm dev
cd web && pnpm install && pnpm dev
```

Read `.agent/shared-mind.txt` before starting agent work.

For project-specific branding, Firebase credentials, app IDs, and generated native assets, start with [INIT.md](./INIT.md).
