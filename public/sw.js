/**
 * Service worker — two independent concerns, kept in their own sections per the PRD's technical
 * considerations (offline caching vs. push handling shouldn't be tangled together):
 *
 * 1. Offline app-shell caching: runtime cache-as-you-go (not a build-time precache list, since
 *    Next's hashed asset filenames change every build and this project deliberately avoids a
 *    heavyweight SW-generation plugin — see PRD §7). Every page/asset visited while online gets
 *    cached, so a repeat visit works offline. A page never opened online first won't be cached —
 *    acceptable for a single-user app that naturally opens every tab at least once.
 * 2. Web Push: 'push' displays the incoming notification, 'notificationclick' focuses/opens the
 *    app — the client side of the zero-cost push architecture in task 5.
 */

const CACHE_NAME = 'career-goals-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

// --- 1. Offline app-shell caching ---------------------------------------------------------

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached ?? Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    return Response.error();
  }
}

// --- 2. Web Push ----------------------------------------------------------------------------

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
