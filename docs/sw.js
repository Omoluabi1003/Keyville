const CACHE_NAME = 'keyville-cache-v3';
const OFFLINE_FALLBACK = '/docs/index.html';
const STATIC_ASSETS = [
  '/docs/',
  '/docs/index.html',
  '/docs/styles.css',
  '/docs/app.js',
  '/docs/gameData.js',
  '/docs/manifest.json',
  '/docs/icons/icon-192.svg',
  '/docs/icons/icon-512.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);

      const fetchAndUpdate = async () => {
        try {
          const preload = await event.preloadResponse;
          if (preload) {
            cache.put(request, preload.clone());
            return preload;
          }
          const response = await fetch(request);
          if (response && response.status === 200 && response.type === 'basic') {
            cache.put(request, response.clone());
          }
          return response;
        } catch (err) {
          if (cached) return cached;
          if (request.mode === 'navigate') {
            const fallback = await cache.match(OFFLINE_FALLBACK);
            if (fallback) return fallback;
          }
          throw err;
        }
      };

      if (cached) {
        fetchAndUpdate();
        return cached;
      }

      return fetchAndUpdate();
    })(),
  );
});
