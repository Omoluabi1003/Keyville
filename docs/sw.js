const CACHE_NAME = 'keyville-cache-v1';
const OFFLINE_URLS = [
  '/',
  '/docs/',
  '/docs/index.html',
  '/docs/styles.css',
  '/docs/app.js',
  '/docs/gameData.js',
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached ||
      fetch(event.request).catch(() => caches.match('/docs/index.html')),
    ),
  );
});
