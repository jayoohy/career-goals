# PRD: Rebuild Career Goals as a Progressive Web App (PWA)

**Owner:** Joy
**Status:** Draft v1
**One-line pitch:** Replace the current Expo/React Native app with a Progressive Web App that delivers the same CV/Robotics accountability experience defined in [cv_accountability_app_PRD.md](../cv_accountability_app_PRD.md), installable on Joy's iPhone home screen, hosted free on the internet so it works without her laptop being on.

---

## 1. Introduction/Overview

The current app is built with Expo/React Native. On iOS, running or installing it on a physical device without paying Apple's $99/year Developer Program fee is not possible for a real standalone build, and the free fallback (Expo Go, even sideloaded via `sign.expo.dev`) requires Joy's computer to be running and reachable every time she opens the app — unworkable for a daily-habit tool she needs to open anytime, especially away from her desk.

A PWA solves the "always-on computer" problem: once hosted on free web hosting (Vercel) and added to the iPhone home screen via Safari, it opens independently like an installed app, with no computer involved. This PRD covers rebuilding the entire existing feature set as a PWA, from scratch, on a web stack — **replacing** the Expo/React Native codebase entirely (per Joy's decision, the old native code is retired, not kept alongside).

Real-time push notifications (the "supervisor" escalation logic in the original PRD) are included in this v1, at zero cost — see §4 (Push notifications) and §7 for the free architecture. This uses the standard **Web Push API** (VAPID), which is unrelated to and does not require Apple's paid Developer Program — that fee only applies to native iOS push via APNs, not to browser-based Web Push for installed PWAs (supported on iOS since 16.4).

## 2. Goals

- Every feature in [cv_accountability_app_PRD.md](../cv_accountability_app_PRD.md) works in a web browser and functions identically in meaning (course tracking, roadmap, daily log, streaks, quizzes, segmented progress, job-ready badge, weekly review) — full feature parity, not an MVP slice.
- The app installs to Joy's iPhone home screen via Safari's "Add to Home Screen" and opens in standalone mode (no browser chrome), with no computer required to use it day-to-day.
- The app works fully offline after first load (data is local-first, same as the current SQLite approach, just via browser storage).
- The app is deployed and live on the public internet (Vercel), replacing the current repo's native app.
- The codebase follows strict separation of concerns: pages compose components only, UI lives in `/components`, business logic lives in `/hooks` and `/services`, no monolithic files.

## 3. User Stories

- As Joy, I want to open the app from my iPhone home screen icon without my laptop being on, so I can log a study day from anywhere.
- As Joy, I want my daily log, streak, and roadmap progress to persist in the browser so I don't lose data between sessions, without needing an account or backend.
- As Joy, I want to see the same segmented progress bars, path-progress visual, and job-ready badge as originally specified, so the emotional/motivational design isn't lost in the rebuild.
- As Joy, I want to take section quizzes and see flagged-for-review sections in a weekly review screen, same as the original spec.
- As Joy, I want the app to still visually nudge me if today isn't logged when I open it (even without push notifications yet), so the "supervisor" feel isn't entirely lost in v1.

## 4. Functional Requirements

**Course tracking (Layer 1)**
1. The system must list all 11 course sections from [courseSections.ts](../src/data/seed/courseSections.ts) with status (not_started/in_progress/done/skipped).
2. The system must let Joy bulk-mark sub-groups of Section 1 (Python Prerequisites) as "already know this" in one action, per §4.1 of the original PRD.
3. The system must let Joy open a section's detail view and change its status.

**Roadmap (Layer 2)**
4. The system must list all Layer 2 roadmap items from [roadmapItems.ts](../src/data/seed/roadmapItems.ts), grouped by `section_group` (course/core_skills/robotics_track/portfolio/deployment/career).
5. The system must keep `sequence_position` read-only (no reordering) until every non-skipped course section is done or skipped; once true, the system must allow drag-to-reorder and a per-item "defer" action.
6. The system must allow adding a new Layer 2 item at any time, always appended to the end of the sequence, regardless of lock state.
7. The system must compute `job_ready` as true only when all Layer 1 sections are done/skipped AND every `job_ready_threshold` roadmap item is done, and must never store this as a persisted flag.
8. The system must show a one-time distinct message when `job_ready` first becomes true, and must persist that it has already been shown (`MilestoneState.job_ready_notified`) so it never repeats.
9. The system must show a persistent (non-dismissable-permanently) job-ready badge on the progress view once `job_ready` is true.

**Daily log (Layer 3)**
10. The system must let Joy log a day as Studied (with linked section/item and duration) or Rest.
11. The system must reject a "Studied" entry with duration under 10 minutes, treating it the same as unlogged for day-close purposes (§6.1 of the original PRD).
12. The system must only allow marking a rest day for the current calendar day (no marking past or future days as rest).
13. The system must cap rest days at 4 per calendar month (configurable in settings) and disable the rest-day option once the cap is reached for that month.
14. The system must display remaining rest days for the current month (e.g. "2 of 4 rest days left this month").
15. The system must treat any day past midnight with nothing logged (and not marked rest) as missed, resetting `current_streak` to 0.

**Streaks & progress**
16. The system must track and display current streak, longest streak, and total hours logged.
17. The system must show a neutral one-line message the next time the app opens after a streak reset (e.g. "Streak's back to 0. Longest was 23."), per §6.1.
18. The system must render segmented progress: one bar for Layer 1, and separate bars per Layer 2 `section_group` (core skills, robotics track, portfolio, deployment/ongoing, career), rather than one combined percentage.
19. The system must render a path/route visual (waypoints, not a plain bar) showing movement from "frontend developer" toward "CV/robotics engineer," per §6.

**Quizzes**
20. The system must present a static multiple-choice quiz (from [quizQuestions.ts](../src/data/seed/quizQuestions.ts)) when a course section is marked done.
21. The system must not gate progress on quiz results.
22. The system must flag a section for review when its quiz score is below 60%, and surface that flag on the section and in the weekly review.

**Weekly review**
23. The system must present a weekly review screen (accessible any time, and highlighted specifically on Sundays) showing days logged, hours total, flagged quiz sections, and what's next on the roadmap.

**In-app "supervisor" nudge (fallback for when push isn't available)**
24. The system must show a visible in-app banner/state when opened on a day where nothing has been logged yet, using copy consistent with the tone rules in §7 of the original PRD (direct, not punitive, not falsely cheerful). This remains even with push enabled, as a fallback for the case where notification permission was denied or a subscription has silently expired.

**Push notifications (server-side, zero-cost)**
25. The system must prompt Joy to enable notifications only after the PWA has been installed to her home screen (iOS only supports Web Push for home-screen-installed PWAs, not for a browser tab).
26. The system must use a self-generated VAPID key pair (public key embedded in the client at build time, private key held only as a server environment variable) to authenticate push sends — no third-party push vendor (Firebase, OneSignal, etc.) and no Apple Developer Program enrollment.
27. The system must store Joy's current push subscription server-side (a single record, since this is a single-user app), replacing it whenever the browser issues a new one.
28. The client must sync a minimal daily-log status flag (`date`, `logged: boolean`) to the server the moment a day is logged as Studied or Rest, so server-side checks can know whether to notify without access to the full local dataset.
29. The system must run scheduled server-side checks at 19:00, 19:45, 20:00, and 22:00 Joy's local time daily, each sending the corresponding notification tier from §5 of the original PRD only if that day's log-status flag is still false at check time.
30. The system must send the weekly review as a fifth scheduled push, once weekly (Sunday evening), per §7 of the original PRD.
31. The system must treat a 410 Gone response from a push send as an expired subscription, clear the stored record, and rely on the client re-subscribing next time the app is opened.
32. The system must protect the subscribe/log-sync API routes with a simple shared-secret token (not full authentication) embedded in the client build, since this remains a single-user app with no account system.

**Installability & offline**
25. The system must include a web app manifest (name "Career Goals", icons, standalone display mode) so Safari's "Add to Home Screen" installs it as a home-screen app.
26. The system must register a service worker that caches the app shell so it loads and functions fully offline after first visit.
27. The system must persist all data (course/roadmap/log/streak/quiz state) in browser storage (IndexedDB) so nothing is lost between sessions without any backend or account.

**Code structure**
33. The system must organize UI into `/components`, business logic into `/hooks` and `/services`, and keep pages/routes as thin composition layers only, per the project's code-separation rule. Server-side push/cron logic must live under its own `/server` or `/app/api` boundary, separate from client hooks/services, since it runs in a different runtime.

## 5. Non-Goals (Out of Scope for this v1 rebuild)

- Multi-user, accounts, or cloud sync across devices (the push backend stores exactly two single-record pieces of state for Joy alone — see §7 — this is not a general accounts/sync system).
- Video playback inside the app.
- AI-generated/dynamic coaching messages or dynamic (API-based) quiz generation.
- Android-specific packaging (this rebuild targets iOS Safari/home-screen installation as the primary target, since that's Joy's only device).
- Retaining or maintaining the existing Expo/React Native code — it is retired as part of this work, not kept in parallel.

## 6. Design Considerations

- Reuse the existing tone/copy rules from §7 of the original PRD for all in-app messaging (streak resets, nudges, weekly review).
- The path-progress visual (§6, §19 above) is the emotional centerpiece — worth deliberate visual design effort, not a generic percentage bar. Route/waypoint metaphor.
- Per the project's data-presentation rule: no raw enum values, IDs, or database-shaped fields shown to Joy directly anywhere in the UI — statuses, dates, and durations must be human-readable (e.g. "9h 41m", "Aug 27, 2026", "In Progress").
- iOS-specific PWA meta tags are required in addition to the manifest (`apple-mobile-web-app-capable`, `apple-touch-icon`, status bar style) since Safari's home-screen support predates full manifest support.

## 7. Technical Considerations

- Recommended stack: Next.js (matches Joy's existing React/Next.js/TypeScript background per the original PRD's §9 stack note) with the App Router, deployed to **Vercel** (per decision).
- Recommended local persistence: **Dexie.js** (a well-maintained IndexedDB wrapper) as the SQLite replacement — the existing service-layer functions in [src/services/](../src/services/) (e.g. `dailyLogService.ts`, `streakService.ts`, `roadmapService.ts`) should be ported with their logic intact, only their storage calls swapped from `expo-sqlite` to Dexie.
- Existing seed data files ([courseSections.ts](../src/data/seed/courseSections.ts), [quizQuestions.ts](../src/data/seed/quizQuestions.ts), [roadmapItems.ts](../src/data/seed/roadmapItems.ts)) are plain TypeScript and portable as-is.
- Existing pure-logic files with tests (`streakLogic.ts`, `dayCloseService.ts`, `restDayBudgetService.ts`, `milestoneService.ts`, `quizService.ts`) should port with minimal change since they don't depend on React Native APIs — carry their `.test.ts` files over too.
- Service worker: use a standard Next.js PWA setup (manifest + service worker registration) rather than a heavyweight framework plugin, to keep the app auditable and match the "no monolithic file" code rule. The service worker also needs a `push` event listener (to display the incoming notification) and a `notificationclick` listener (to focus/open the app) — this is separate from the offline-caching logic and should live in its own clearly-scoped section of the service worker file.

**Push notification architecture (zero cost)**
- **Mechanism:** the standard Web Push API + VAPID, via the `web-push` npm package server-side. This is a web platform standard (same one Chrome/Firefox use), not an Apple product — it requires no Apple Developer Program membership and no third-party push vendor. Generate the VAPID key pair once (`web-push generate-vapid-keys`); the public key ships in client code, the private key is a Vercel environment variable only.
- **Storage:** a single Upstash Redis instance (free tier, native Vercel Marketplace integration — far more headroom than a single-user app needs) holding exactly two keys: the current push subscription object, and today's `{date, logged}` flag. No user table, no accounts, no general database — this is the minimum possible backend, not a general sync service.
- **Scheduling:** Vercel Cron Jobs (free on the Hobby plan). Each cron entry may fire at most once per 24 hours on Hobby, but multiple separate entries at different fixed times are allowed (Vercel supports up to 100 cron entries per project on every plan) — define five entries in `vercel.json`: 19:00, 19:45, 20:00, 22:00 daily, plus one Sunday-evening entry for the weekly review. Since Joy is in Lagos (WAT, UTC+1 year-round, no DST), each local time converts to a single fixed UTC time with no seasonal adjustment needed.
- **Send flow:** each cron hits its own tiny API route → reads today's `logged` flag from Redis → if still false, calls `webpush.sendNotification()` with the stored subscription and that tier's copy from §5 of the original PRD → on a 410 response, deletes the stored subscription.
- **Security:** the `/api/subscribe` and `/api/log-sync` routes require a shared-secret bearer token (a long random string as an environment variable, embedded in the client build) rather than full auth — proportionate for a single-user app with no sensitive data, just enough to stop random internet traffic from writing to the two stored records.

## 8. Success Metrics

- Joy can add the app to her iPhone home screen and open it with her laptop fully off.
- The app remains usable (all logging/viewing functions) with the device in airplane mode after first load.
- Joy receives an actual push notification on her locked iPhone at each of the four daily check times when a day is unlogged, and none when it's already logged — with zero recurring cost (no paid Apple account, no paid push vendor, all free tiers).
- Every functional requirement in §4 is implemented and manually verified against the original PRD's acceptance intent.
- No file in `/components`, `/hooks`, or `/services` mixes unrelated concerns (spot-checked against the code-separation rule).

## 9. Open Questions — resolved

- **Icon:** a new/different icon will be sourced for the PWA rather than re-exporting the existing Expo icon set. Still needs export at PWA-appropriate sizes (192x192, 512x512, apple-touch-icon) once chosen.
- **Naming:** repo/`package.json` name changes to `career-goals`, matching the app name already set in `app.json` ("Career Goals").
- **Push subscription staleness:** accepted as-is — Joy will open the app periodically, which keeps the subscription alive; the in-app fallback banner (§4, req. 24) covers the rare gap.
- Upstash's free tier is effectively unlimited for this app's single-user, two-key usage pattern — worth a quick confirmation of current free-tier limits at implementation time in case terms have changed.
