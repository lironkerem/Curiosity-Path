// The Curiosity Path - Service Worker
// Version: 2025-01-23

const CACHE_VERSION = 'tcp-2025-01-23';
const CACHE_NAME = `tcp-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `tcp-runtime-${CACHE_VERSION}`;
const ICON_PATH = './Public/Icons/';

// Core assets to cache immediately
const CORE_ASSETS = [
  './',
  './index.html',
  './CSS/main-styles.css',
  './CSS/mobile-styles.css',
  './CSS/tailwind-output.css',
  './CSS/dark-mode.css',
  `${ICON_PATH}icon-192x192.png`,
  `${ICON_PATH}icon-512x512.png`,
  `${ICON_PATH}icon-512-maskable.png`,
  `${ICON_PATH}badge-96x96.png`
];

// Install event - cache core assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
      .catch(err => console.error('[SW] Cache install failed:', err))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches that don't match current version
          if (cacheName.startsWith('tcp-') && 
              cacheName !== CACHE_NAME && 
              cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => clients.claim())
  );
});

// Fetch event - smart caching strategy
self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Normalize URL (remove trailing slashes for consistency)
  const normalizedUrl = url.pathname.endsWith('/') && url.pathname !== '/' 
    ? url.pathname.slice(0, -1) 
    : url.pathname;

  // Handle different types of requests
  if (request.destination === 'image' || url.pathname.includes('/Icons/')) {
    // Cache-first for images and icons
    e.respondWith(cacheFirst(request));
  } else if (url.pathname.includes('/CSS/') || url.pathname.endsWith('.css')) {
    // Cache-first for CSS files
    e.respondWith(cacheFirst(request));
  } else if (request.destination === 'script' || url.pathname.endsWith('.js')) {
    // Network-first for JavaScript files (to get updates)
    e.respondWith(networkFirst(request));
  } else {
    // Default: network-first for HTML and other resources
    e.respondWith(networkFirst(request));
  }
});

// Network-first strategy (fresh content, fallback to cache)
async function networkFirst(request) {
  // Skip caching for non-GET requests
  if (request.method !== 'GET') {
    return fetch(request);
  }

  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // No cache available - return offline message
    return new Response(
      'Offline - Please check your internet connection',
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/plain; charset=utf-8'
        })
      }
    );
  }
}

// Cache-first strategy (performance priority)
async function cacheFirst(request) {
  // Skip caching for non-GET requests
  if (request.method !== 'GET') {
    return fetch(request);
  }

  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return generic offline response for assets
    return new Response('', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Push notification listener
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

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if not already open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});