// The Curiosity Path - Service Worker
// Version: 2026-03-11

const CACHE_VERSION = 'tcp-2026-03-11';
const CACHE_NAME = `tcp-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `tcp-runtime-${CACHE_VERSION}`;
const ICON_PATH = './public/Icons/';

const CORE_ASSETS = [
  './',
  './index.html',
  './CSS/main-styles.css',
  './CSS/mobile-styles.css',
  './CSS/dark-mode.css',
  `${ICON_PATH}icon-192x192.png`,
  `${ICON_PATH}icon-512x512.png`,
  `${ICON_PATH}icon-512-maskable.png`,
  `${ICON_PATH}badge-96x96.png`
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
      .catch(err => console.error('[SW] Cache install failed:', err))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith('tcp-') &&
              cacheName !== CACHE_NAME &&
              cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin — must call respondWith or not at all for bfcache
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Skip chrome-extension and non-http schemes
  if (!url.protocol.startsWith('http')) {
    return;
  }

  if (request.destination === 'image' || url.pathname.includes('/Icons/')) {
    e.respondWith(cacheFirst(request));
  } else if (url.pathname.includes('/CSS/') || url.pathname.endsWith('.css')) {
    e.respondWith(networkFirst(request));
  } else if (request.destination === 'script' || url.pathname.endsWith('.js')) {
    e.respondWith(networkFirst(request));
  } else {
    e.respondWith(networkFirst(request));
  }
});

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;
    return new Response('Offline - Please check your internet connection', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
    });
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return new Response('', { status: 503, statusText: 'Service Unavailable' });
  }
}

self.addEventListener('push', event => {
  try {
    const data = event.data ? event.data.json() : {};
    const { title = 'The Curiosity Path', body, icon, tag, data: customData } = data;
    event.waitUntil(
      self.registration.showNotification(title, {
        body: body || 'You have a new notification',
        icon: icon || `${ICON_PATH}icon-512-maskable.png`,
        badge: `${ICON_PATH}badge-96x96.png`,
        tag: tag || 'default',
        data: customData || {},
        vibrate: [200, 100, 200],
        requireInteraction: false
      })
    );
  } catch (error) {
    console.error('[SW] Push notification error:', error);
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(urlToOpen);
      })
  );
});

