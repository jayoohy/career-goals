# Career Goals

A PWA tracking Joy's path from frontend engineer to computer vision/robotics engineer. See
[cv_accountability_app_PRD.md](./cv_accountability_app_PRD.md) for the original feature spec and
[tasks/prd-pwa-rebuild.md](./tasks/prd-pwa-rebuild.md) for why this is a PWA rather than the
original Expo/React Native app (Apple's $99/year Developer Program is required for any standalone
iOS install, even for personal use — a PWA installed via "Add to Home Screen" sidesteps that
entirely, at zero cost).

Built with Next.js (App Router, TypeScript), Tailwind CSS, and Dexie (IndexedDB) for local-first
persistence — no database beyond the two tiny records the push-notification backend needs (see
below). [tasks/tasks-pwa-rebuild.md](./tasks/tasks-pwa-rebuild.md) tracks the build itself.

## Get started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the values (see that file's comments) before
push notifications or the API routes will work locally.

## Scripts

- `npm run dev` — Next.js dev server
- `npm run build` / `npm start` — production build / serve
- `npm run lint` — ESLint
- `npm run format` — Prettier
- `npm test` — Jest

## Project structure

- `app/` — pages (Next.js App Router) and API routes (`app/api/`)
- `components/` — reusable UI
- `hooks/` — stateful logic consumed by pages
- `services/` — client-side Dexie access, business logic
- `server/` — server-only code (Redis, VAPID/push sending, cron auth) — never imported by client code
- `utils/` — pure helper functions shared by client and server
- `data/seed/` — seed content (course sections, roadmap items, quiz bank)
- `types/` — shared TypeScript types
- `public/sw.js` — service worker (offline caching + Web Push)

## Push notifications

Real scheduled notifications (the PRD's "supervisor" escalation) run entirely free, via the
standard Web Push API — no Apple Developer account, no push vendor. See
[tasks/prd-pwa-rebuild.md](./tasks/prd-pwa-rebuild.md) for the full design and
[vercel.json](./vercel.json) for the cron schedule. Requires a free Upstash Redis database and a
Vercel deployment (task 5.2 / 7.1 in the task list) to actually send.
