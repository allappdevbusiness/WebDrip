/* Cogsparrow concept site: cache-first for the page and its Unsplash images */
const CACHE = 'webdrip-2026-10-02-cogsparrow-v1';
const PAGE = ['./', './index.html'];
const IMAGES = [
  "https://images.unsplash.com/photo-1671040690726-b78261eff126?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8YmljeWNsZSUyMHRvb2xzfGVufDB8MHx8fDE3OTA5MDkyMTB8MA&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1523357585206-175e971f2ad9?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8YmlrZSUyMHdoZWVsJTIwc3Bva2VzfGVufDB8MHx8fDE3OTA5MDkyMDl8MA&ixlib=rb-4.1.0&w=2000&q=80",
  "https://images.unsplash.com/photo-1675798227643-da319f8ee8f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8YmljeWNsZSUyMHJlcGFpciUyMHdvcmtzaG9wfGVufDB8MHx8fDE3OTA5MDkyMDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1676531443468-0e2b5a57e48f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OHx8YmljeWNsZSUyMHRvb2xzfGVufDB8MHx8fDE3OTA5MDkyMTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1673870861521-626b40f9657e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8YmljeWNsZSUyMHRvb2xzfGVufDB8MHx8fDE3OTA5MDkyMTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1673870767999-20e9af6dc896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTJ8fGJpa2UlMjB3aGVlbCUyMHNwb2tlc3xlbnwwfDB8fHwxNzkwOTA5MjA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1669637842182-aa5656dd1492?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8YmljeWNsZSUyMG1lY2hhbmljfGVufDB8MHx8fDE3OTA5MDkyMDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1505705694340-019e1e335916?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8cm9hZCUyMGJpa2V8ZW58MHwwfHx8MTc5MDkwOTIwOXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1673870861138-3d7b92d8b619?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Nnx8YmljeWNsZSUyMHJlcGFpciUyMHdvcmtzaG9wfGVufDB8MHx8fDE3OTA5MDkyMDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1562615193-cbeef074a501?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8YmljeWNsZSUyMHRvb2xzfGVufDB8MHx8fDE3OTA5MDkyMTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1676531356064-0a527118baf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8YmljeWNsZSUyMHJlcGFpciUyMHdvcmtzaG9wfGVufDB8MHx8fDE3OTA5MDkyMDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
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
    await Promise.all(keys.filter((k) => k.startsWith('webdrip-2026-10-02-cogsparrow') && k !== CACHE).map((k) => caches.delete(k)));
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
