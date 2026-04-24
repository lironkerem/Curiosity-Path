// The Curiosity Path — Service Worker

const CACHE_VERSION  = 'tcp-2026-04-24-1226';
const CACHE_NAME     = `tcp-static-${CACHE_VERSION}`;
const RUNTIME_CACHE  = `tcp-runtime-${CACHE_VERSION}`;
const ICON_PATH      = './Icons/';

// Core assets to pre-cache on install
const CORE_ASSETS = [
  './',
  './index.html',
  `${ICON_PATH}icon-192x192.png`,
  `${ICON_PATH}icon-512x512.png`,
  `${ICON_PATH}icon-512-maskable.png`,
  `${ICON_PATH}badge-96x96.png`
];

// Minimal offline HTML — shown when page fetch fails and no cache available
const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Offline — The Curiosity Path</title>
  <style>
    body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;
         font-family:system-ui,sans-serif;background:#f8f5f0;color:#333;text-align:center;padding:2rem}
    h1{font-size:1.5rem;margin-bottom:0.75rem}
    p{color:#666;max-width:320px;line-height:1.5}
    button{margin-top:1.5rem;padding:0.75rem 2rem;background:#6b9b37;color:#fff;
           border:none;border-radius:8px;font-size:1rem;cursor:pointer}
  </style>
</head>
<body>
  <div>
    <h1>You're offline</h1>
    <p>Please check your internet connection and try again.</p>
    <button onclick="location.reload()">Retry</button>
  </div>
</body>
</html>`;

// ─── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
      .catch(err => console.error('[SW] Install cache failed:', err))
  );
});

// ─── Activate ───────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
          .filter(name => name.startsWith('tcp-') && name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

// ─── Fetch ───────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip cross-origin (CDN, Supabase, APIs — let them go direct)
  if (url.origin !== self.location.origin) return;

  // Skip WebSocket upgrade requests (cannot be intercepted)
  if (request.headers.get('upgrade') === 'websocket') return;

  const path = url.pathname;

  if (request.destination === 'image' || path.includes('/Icons/')) {
    // Images: cache-first for speed
    event.respondWith(cacheFirst(request));
  } else if (path.includes('/CSS/') || path.endsWith('.css')) {
    // CSS: network-first (supports ?v= versioning)
    event.respondWith(networkFirst(request, false));
  } else if (request.destination === 'script' || path.endsWith('.js')) {
    // JS: network-first (stay fresh)
    event.respondWith(networkFirst(request, false));
  } else if (request.destination === 'document' || path === '/' || path.endsWith('.html')) {
    // HTML pages: network-first, serve offline page on failure
    event.respondWith(networkFirst(request, true));
  } else {
    event.respondWith(networkFirst(request, false));
  }
});

// ─── Network-first strategy ──────────────────────────────────────────────────
async function networkFirst(request, serveOfflinePage) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone()); // background update
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    if (serveOfflinePage) {
      return new Response(OFFLINE_HTML, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

// ─── Cache-first strategy ────────────────────────────────────────────────────
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 503, statusText: 'Service Unavailable' });
  }
}

// ─── Push Notifications ──────────────────────────────────────────────────────
self.addEventListener('push', event => {
  try {
    const data  = event.data ? event.data.json() : {};
    const title = typeof data.title === 'string' ? data.title.slice(0, 100) : 'The Curiosity Path';
    const body  = typeof data.body  === 'string' ? data.body.slice(0, 200)  : 'You have a new notification';

    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon:               data.icon  || `${ICON_PATH}icon-512-maskable.png`,
        badge:              `${ICON_PATH}badge-96x96.png`,
        tag:                typeof data.tag === 'string' ? data.tag : 'default',
        renotify:           data.renotify === true,
        data:               data.data && typeof data.data === 'object' ? data.data : {},
        vibrate:            [200, 100, 200],
        requireInteraction: false
      })
    );
  } catch (err) {
    console.error('[SW] Push error:', err);
  }
});

// ─── Notification Click ──────────────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const notifData = event.notification.data || {};

  // Validate URL — only allow same-origin navigation
  let urlToOpen = '/';
  if (typeof notifData.url === 'string') {
    try {
      const parsed = new URL(notifData.url, self.location.origin);
      if (parsed.origin === self.location.origin) {
        urlToOpen = parsed.pathname + parsed.search + parsed.hash;
      }
    } catch { /* malformed URL — fall back to '/' */ }
  }

  const fullUrl = self.location.origin + urlToOpen;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        if (clientList.length > 0) {
          const client = clientList[0];
          client.focus();

          if (notifData.type === 'whisper' && typeof notifData.senderId === 'string') {
            client.postMessage({
              type:     'OPEN_WHISPER_THREAD',
              senderId: notifData.senderId
            });
          }

          return;
        }

        if (clients.openWindow) return clients.openWindow(fullUrl);
      })
  );
});
