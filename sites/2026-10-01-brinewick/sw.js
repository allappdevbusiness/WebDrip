/* Brinewick concept site: cache-first for the page and its Unsplash images */
const CACHE = 'webdrip-2026-10-01-brinewick-v1';
const PAGE = ['./', './index.html'];
const IMAGES = [
  "https://images.unsplash.com/photo-1512130017599-6e7db038ea4f?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8c3VyZmVyJTIwb2NlYW4lMjB3YXZlJTIwYWVyaWFsfGVufDB8MHx8fDE3OTA4OTc5NDd8MA&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1517699418036-fb5d179fef0c?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8c3VyZmVyJTIwc3VucmlzZXxlbnwwfDB8fHwxNzkwODk3OTQ4fDA&ixlib=rb-4.1.0&w=2000&q=80",
  "https://images.unsplash.com/photo-1722515261499-6f5c955a99d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8c3VyZiUyMGxlc3NvbiUyMGJlYWNofGVufDB8MHx8fDE3OTA4OTc5NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1723214274483-e8da5eaa41c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8c3VyZiUyMGxlc3NvbiUyMGJlYWNofGVufDB8MHx8fDE3OTA4OTc5NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1685548765392-d7c5585188e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8c3VyZiUyMGxlc3NvbiUyMGJlYWNofGVufDB8MHx8fDE3OTA4OTc5NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1637291047375-947201895583?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTJ8fHN1cmYlMjBjYW1wfGVufDB8MHx8fDE3OTA4OTc5NDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1685548765628-063d276065bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8c3VyZiUyMGxlc3NvbiUyMGJlYWNofGVufDB8MHx8fDE3OTA4OTc5NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1504214522030-2dc5eb504c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8c3VyZiUyMGNhbXB8ZW58MHwwfHx8MTc5MDg5Nzk0OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1652296911548-8b807b8da792?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8c3VyZmJvYXJkcyUyMHJhY2t8ZW58MHwwfHx8MTc5MDg5Nzk0OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1719470331562-c3a981927823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8c3VyZmJvYXJkcyUyMHJhY2t8ZW58MHwwfHx8MTc5MDg5Nzk0OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1476937578872-e13654674462?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTF8fHN1cmZlciUyMG9jZWFuJTIwd2F2ZSUyMGFlcmlhbHxlbnwwfDB8fHwxNzkwODk3OTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080"
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(PAGE);
    await Promise.all(IMAGES.map(async (url) => {
      try {
        const res = await fetch(new Request(url, { mode: 'no-cors' }));
        await cache.put(url, res);
      } catch (e) { /* offline at install: skip this image */ }
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('webdrip-2026-10-01-brinewick') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

const PRECACHED = new Set(IMAGES);

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/index.html') || url.pathname === new URL('./', self.location).pathname);
  if (!isPage && !PRECACHED.has(req.url)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: false });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    } catch (e) {
      return hit || Response.error();
    }
  })());
});
