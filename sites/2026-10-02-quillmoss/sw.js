/* Quillmoss concept site: cache-first for the page and its Unsplash images */
const CACHE = 'webdrip-2026-10-02-quillmoss-v1';
const PAGE = ['./', './index.html'];
const IMAGES = [
  "https://images.unsplash.com/photo-1777395391040-8b919bc39464?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OHx8ZG9nJTIwbWVhZG93JTIwbW9ybmluZ3xlbnwwfHx8fDE3OTA5MDE0NTR8MA&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1612245229854-e69ff79cd51a?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Nnx8Y2F0JTIwd2luZG93fGVufDB8fHx8MTc5MDkwMTQ1NXww&ixlib=rb-4.1.0&w=2000&q=80",
  "https://images.unsplash.com/photo-1630438994394-3deff7a591bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8cHVwcHklMjB2ZXR8ZW58MHx8fHwxNzkwOTAxNDUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1770836037816-4445dbd449fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OXx8dmV0ZXJpbmFyaWFuJTIwc3RldGhvc2NvcGUlMjBkb2d8ZW58MHx8fHwxNzkwOTAxNDU0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1721907043535-318e2f352757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8dmV0ZXJpbmFyaWFuJTIwZXhhbWluaW5nJTIwY2F0fGVufDB8fHx8MTc5MDkwMTQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1507146426996-ef05306b995a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8cHVwcHklMjB2ZXR8ZW58MHx8fHwxNzkwOTAxNDUzfDA&ixlib=rb-4.1.0&q=80&w=1080"
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
    await Promise.all(keys.filter((k) => k.startsWith('webdrip-2026-10-02-quillmoss') && k !== CACHE).map((k) => caches.delete(k)));
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
