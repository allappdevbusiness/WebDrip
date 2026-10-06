// Cache-first service worker, versioned by slug. The post-build script fills PRECACHE.
const VERSION = 'eyemax-v1';
const PRECACHE = [
  "./",
  "./index.html",
  "./services.html",
  "./book.html",
  "./assets/HomeWidgets-Bhc1m7m3.js",
  "./assets/Layout-CjjfXkcF.css",
  "./assets/Layout-MYu9jsac.js",
  "./assets/book-GzYfs97y.js",
  "./assets/bricolage-grotesque-latin-wght-normal-DLoelf7F.woff2",
  "./assets/index-D50ZMr7v.js",
  "./assets/instrument-sans-latin-wght-normal-BbzFLZTg.woff2",
  "./assets/services-BKTnT5YJ.js",
  "./assets/images/hero.jpg",
  "./assets/images/spot.jpg",
  "./assets/images/f1.jpg",
  "./assets/images/f2.jpg",
  "./assets/images/f3.jpg",
  "./assets/images/f4.jpg",
  "./assets/images/f5.jpg",
  "./assets/images/f6.jpg",
  "./assets/images/f7.jpg",
  "./assets/images/r1.jpg",
  "./assets/images/r2.jpg",
  "./assets/images/r3.jpg",
  "./assets/images/r4.jpg",
  "./assets/images/glare.jpg",
  "./assets/images/svcHead.jpg",
  "./assets/images/exam.jpg",
  "./assets/images/contacts.jpg",
  "./assets/images/kids.jpg",
  "./assets/images/dry.jpg",
  "./assets/images/sun.jpg",
  "./assets/images/bookHead.jpg",
  "./assets/images/t1.jpg",
  "./assets/images/t2.jpg",
  "./assets/images/t3.jpg",
  "./assets/images/t4.jpg",
  "./assets/images/store.jpg"
];

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
