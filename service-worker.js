const CACHE_NAME = 'voyager-cache-v1';
const urlsToCache = [
  '/voyager-app/',
  '/voyager-app/index.html',
  '/voyager-app/styles.css',
  '/voyager-app/script.js',
  '/voyager-app/manifest.json',
  '/voyager-app/house-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }).catch(err => {
      console.error('Error en addAll:', err);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
