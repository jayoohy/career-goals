# Stack

This project is a Next.js (App Router) Progressive Web App — not Expo/React Native (retired in
the PWA rebuild, see [tasks/prd-pwa-rebuild.md](./tasks/prd-pwa-rebuild.md)). Persistence is
Dexie (IndexedDB) client-side; the only backend is a handful of API routes under `app/api/` for
push notifications (see `server/`). Read [README.md](./README.md) for the full structure before
writing code.
