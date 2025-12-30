const CACHE_NAME = 'social-dl-v1';
const ASSETS = [
  './',
  './index.html',
  './script.js',
  './manifest.json'
];

// Install Event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Fetch Event (Network First, then Cache)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .catch(() => caches.match(e.request))
  );
});

// Activate Event (Cleanup Old Caches)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});
