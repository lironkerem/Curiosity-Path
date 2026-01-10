// Digital Curiosity PWA - Service Worker
// Network-first strategy + theme-cache for zero-blink skins

const CACHE_NAME = 'dc-v4';
const RUNTIME_CACHE = 'dc-runtime';

// Core assets (always cached)
const CORE_ASSETS = [
  './',
  './Icons/icon-192x192.png',
  './Icons/icon-512x512.png',
  './Assets/CSS/main-styles.css',
  './Assets/CSS/mobile-styles.css',
  './Assets/CSS/tailwind-output.css'
];

// Install – cache core
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate – clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.map(n => (n !== CACHE_NAME && n !== RUNTIME_CACHE) ? caches.delete(n) : null)
      )
    ).then(() => clients.claim())
  );
});

// Fetch – network-first with fall-backs
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // ① Theme skins – cache-first (instant paint, no blink)
  if (url.pathname.includes('/Assets/CSS/Skins/')) {
    e.respondWith(cacheFirst(e.request));
    return;
  }

  // ② CSS / JS – network-first (fresh code)
  if (url.pathname.match(/\.(css|js)$/)) {
    e.respondWith(networkFirst(e.request));
    return;
  }

  // ③ Images – cache-first (offline visuals)
  if (e.request.destination === 'image' || url.pathname.includes('/Icons/')) {
    e.respondWith(cacheFirst(e.request));
    return;
  }

  // ④ Everything else – network-first
  e.respondWith(networkFirst(e.request));
});

// ---------- helpers ----------
async function networkFirst(req) {
  try {
    const net = await fetch(req);
    if (net.ok) {
      const clone = net.clone();
      caches.open(RUNTIME_CACHE).then(c => c.put(req, clone));
    }
    return net;
  } catch {
    const cached = await caches.match(req);
    return cached || caches.match('./');
  }
}

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;

  try {
    const net = await fetch(req);
    if (net.ok) {
      const clone = net.clone();
      caches.open(RUNTIME_CACHE).then(c => c.put(req, clone));
    }
    return net;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

// ---------- push ----------
self.addEventListener('push', e => {
  try {
    const {title, body, icon, tag, data} = e.data.json();
    e.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: icon || '/Icons/icon-192x192.png',
        tag: tag || 'dc-note',
        data: data || {},
        badge: '/Icons/icon-192x192.png',
        vibrate: [200, 100, 200]
      })
    );
  } catch (err) {
    console.error('Push error:', err);
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(clients.openWindow(url));
});