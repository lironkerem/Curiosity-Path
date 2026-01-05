const CACHE_NAME = 'dc-v1';
const urlsToCache = [
  './',
  './Icons/icon-192x192.png',
  './Icons/icon-512x512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.error('Cache failed:', err))
  );
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim()); // Take control immediately
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

// PUSH NOTIFICATION LISTENER
self.addEventListener('push', event => {
  const { title, body, icon, tag, data } = event.data.json();
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: icon || '/Icons/icon-192x192.png',
      tag: tag || 'default',
      data: data || {},
      badge: '/Icons/icon-192x192.png',
      vibrate: [200, 100, 200]
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(urlToOpen));
});