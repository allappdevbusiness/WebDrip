/* Hollowfern concept site: cache-first for the page and its Unsplash images */
const CACHE = 'webdrip-2026-10-01-hollowfern-v1';
const PAGE = ['./', './index.html'];
const IMAGES = [
  "https://images.unsplash.com/photo-1595351298020-038700609878?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8cG90dGVyeSUyMHdoZWVsJTIwaGFuZHMlMjBjbGF5fGVufDB8MHx8fDE3OTA4OTY4MDR8MA&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8Y2VyYW1pY3MlMjBzaGVsZiUyMGdsYXplZCUyMHBvdHN8ZW58MHwwfHx8MTc5MDg5NjgwNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1777315168429-b4cbf3280493?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Nnx8cG90dGVyeSUyMGNsYXNzJTIwc3R1ZGlvfGVufDB8MHx8fDE3OTA4OTY4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1783432785318-45eafc432eb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8cG90dGVyeSUyMGNsYXNzJTIwc3R1ZGlvfGVufDB8MHx8fDE3OTA4OTY4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1785482460321-7dcc29cfc54c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8cG90dGVyeSUyMGNsYXNzJTIwc3R1ZGlvfGVufDB8MHx8fDE3OTA4OTY4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1778698993355-2c5f29edbfb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8cG90dGVyeSUyMGNsYXNzJTIwc3R1ZGlvfGVufDB8MHx8fDE3OTA4OTY4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1784370596357-55fe82de6354?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8cG90dGVyeSUyMGNsYXNzJTIwc3R1ZGlvfGVufDB8MHx8fDE3OTA4OTY4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1782176322568-e922f7c45c52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTB8fGNlcmFtaWNzJTIwc2hlbGYlMjBnbGF6ZWQlMjBwb3RzfGVufDB8MHx8fDE3OTA4OTY4MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1762922425155-d03e6997e33e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTF8fGNlcmFtaWMlMjBib3dscyUyMGhhbmRtYWRlfGVufDB8MHx8fDE3OTA4OTY4MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1597696929644-a2157a251a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8Y2VyYW1pY3MlMjBzaGVsZiUyMGdsYXplZCUyMHBvdHN8ZW58MHwwfHx8MTc5MDg5NjgwNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1525973779373-015bdf68e579?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8Y2VyYW1pYyUyMGJvd2xzJTIwaGFuZG1hZGV8ZW58MHwwfHx8MTc5MDg5NjgwNHww&ixlib=rb-4.1.0&q=80&w=1080"
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
    await Promise.all(keys.filter((k) => k.startsWith('webdrip-2026-10-01-hollowfern') && k !== CACHE).map((k) => caches.delete(k)));
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
