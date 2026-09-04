/**
 * Service worker — two independent concerns kept in their own sections (offline caching vs.
 * push handling).
 *
 * 1. Caching. The earlier version cache-first'd *everything* into a single never-versioned
 *    cache, so after a few deploys the app served a mix of JS chunks from different builds and
 *    Next.js kept forcing full-page reloads on the mismatch. This version is deliberately
 *    conservative:
 *      - /api/*                     → not intercepted at all (always straight to network)
 *      - page navigations (HTML)    → network-first, cached copy only as an offline fallback
 *      - /_next/static/* (hashed)   → cache-first (those URLs are immutable)
 *      - everything else same-origin → network-first, fall back to cache
 *    CACHE_NAME carries a version; `activate` deletes every other cache, so bumping it wipes a
 *    poisoned cache on the next SW update.
 * 2. Web Push: 'push' shows the notification, 'notificationclick' focuses/opens the app.
 */

const CACHE_NAME = 'career-goals-v2';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

// --- 1. Caching --------------------------------------------------------------------------------

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only same-origin GETs are our business. Anything else (POST/PUT, cross-origin, and crucially
  // every /api/* call — sync, subscribe, log-sync) goes straight to the network untouched.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // Content-hashed build assets are safe to keep forever.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Navigations and everything else: fresh when online, cached copy when not.
  event.respondWith(networkFirst(request));
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const shell = await caches.match('/');
      if (shell) return shell;
    }
    return Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return Response.error();
  }
}

// --- 2. Web Push ------------------------------------------------------------------------------

self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }
  const payload = event.data.json();
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/api/icon?size=192',
      badge: '/api/icon?size=192',
      data: { url: payload.url ?? '/' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url ?? '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsList) => {
      for (const client of clientsList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    }),
  );
});
