// Cache-first service worker, versioned by slug. The post-build script fills PRECACHE.
const VERSION = 'eyemax-v1';
const PRECACHE = [];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) =>
      Promise.all(PRECACHE.map((url) =>
        cache.add(new Request(url, { mode: url.startsWith('http') ? 'no-cors' : 'same-origin' })).catch(() => {})
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('eyemax-') && k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((hit) => hit || fetch(event.request).then((res) => {
      if (res && (res.ok || res.type === 'opaque')) {
        const copy = res.clone();
        caches.open(VERSION).then((cache) => cache.put(event.request, copy));
      }
      return res;
    }))
  );
});
