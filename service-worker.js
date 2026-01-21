// Digital Curiosity PWA - Service Worker

const CACHE_NAME = 'dc-v4';
const RUNTIME_CACHE = 'dc-runtime';

// Core assets to cache immediately
const CORE_ASSETS = [
  './',
  './Public/Icons/icon-192x192.png',
  './Public/Icons/icon-512x512.png',
  './Public/Icons/icon-512-maskable.png',
  './Public/Icons/badge-96x96.png',
  './CSS/main-styles.css',
  './CSS/mobile-styles.css',
  './CSS/tailwind-output.css'
];

// Install event - cache core assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
      .catch(err => console.error('Cache install failed:', err))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => clients.claim())
  );
});

// Fetch event - network-first strategy
self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  // Handle different types of requests
  if (request.destination === 'image' || request.url.includes('Icons')) {
    // Cache-first for images
    e.respondWith(cacheFirst(request));
  } else if (request.url.includes('CSS') || request.url.includes('css')) {
    // Cache-first for CSS files
    e.respondWith(cacheFirst(request));
  } else if (request.destination === 'script' || request.url.includes('js')) {
    // Network-first for JavaScript files
    e.respondWith(networkFirst(request));
  } else {
    // Default: network-first for everything else
    e.respondWith(networkFirst(request));
  }
});

// Network-first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // If successful, cache the response
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache, try core cache
    const coreResponse = await caches.match(request);
    if (coreResponse) {
      return coreResponse;
    }
    
    // Return offline fallback
    return new Response('Offline - content not available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
}

// Cache-first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, responseClone);
    }
    return networkResponse;
  } catch (error) {
    return new Response('Offline - image not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Push notification listener
self.addEventListener('push', event => {
  try {
    const { title, body, icon, tag, data } = event.data.json();
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: icon || 'Public/Icons/icon-512-maskable.png',
        tag: tag || 'default',
        data: data || {},
        badge: 'Public/Icons/badge-96x96.png',
        vibrate: [200, 100, 200]
      })
    );
  } catch (error) {
    console.error('Push notification error:', error);
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});