/* Larkmere concept site: cache-first for the page and its Unsplash images */
const CACHE = 'webdrip-2026-10-02-larkmere-v1';
const PAGE = ['./', './index.html'];
const IMAGES = [
  "https://images.unsplash.com/photo-1687831958087-30a2130c968f?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Nnx8Zmxvd2VyJTIwYXJyYW5naW5nJTIwd29ya3Nob3B8ZW58MXwwfHx8MTc5MDkyMTUyNHww&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1629031662322-486399584436?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8Zmxvd2VyJTIwZmllbGQlMjBtb3JuaW5nfGVufDF8MHx8fDE3OTA5MjE1MjJ8MA&ixlib=rb-4.1.0&w=2000&q=80",
  "https://images.unsplash.com/photo-1667555150959-3e881131b9e4?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8Ym91cXVldCUyMGZsb3dlcnN8ZW58MXwwfHx8MTc5MDkyMTUyM3ww&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80",
  "https://images.unsplash.com/photo-1680563899402-26c3a712831f?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OXx8Ym91cXVldCUyMGZsb3dlcnN8ZW58MXwwfHx8MTc5MDkyMTUyM3ww&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80",
  "https://images.unsplash.com/photo-1704177094380-ab854ad5a93b?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OHx8Ym91cXVldCUyMGZsb3dlcnN8ZW58MXwwfHx8MTc5MDkyMTUyM3ww&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80",
  "https://images.unsplash.com/photo-1665607437981-973dcd6a22bb?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8d2VkZGluZyUyMGZsb3dlcnMlMjB0YWJsZXxlbnwxfDB8fHwxNzkwOTIxNTI0fDA&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80",
  "https://images.unsplash.com/photo-1563292749-0e070ca58b29?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8d2VkZGluZyUyMGZsb3dlcnMlMjB0YWJsZXxlbnwxfDB8fHwxNzkwOTIxNTI0fDA&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80",
  "https://images.unsplash.com/photo-1602468690798-0820b3ec6ee7?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8d2VkZGluZyUyMGZsb3dlcnMlMjB0YWJsZXxlbnwxfDB8fHwxNzkwOTIxNTI0fDA&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80",
  "https://images.unsplash.com/photo-1685990063912-7f7bb46d39bf?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTF8fGZsb3dlciUyMGFycmFuZ2luZyUyMHdvcmtzaG9wfGVufDF8MHx8fDE3OTA5MjE1MjR8MA&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80",
  "https://images.unsplash.com/photo-1642751652611-bb9a7cad58a3?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8Zmxvd2VyJTIwYXJyYW5naW5nJTIwd29ya3Nob3B8ZW58MXwwfHx8MTc5MDkyMTUyNHww&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80",
  "https://images.unsplash.com/photo-1718568698631-c8e53cc1b18b?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8Zmxvd2VyJTIwYXJyYW5naW5nJTIwd29ya3Nob3B8ZW58MXwwfHx8MTc5MDkyMTUyNHww&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80"
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
    await Promise.all(keys.filter((k) => k.startsWith('webdrip-2026-10-02-larkmere') && k !== CACHE).map((k) => caches.delete(k)));
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
