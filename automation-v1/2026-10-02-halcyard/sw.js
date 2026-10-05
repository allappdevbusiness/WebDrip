/* Halcyard concept site: cache-first for the page and its Unsplash images */
const CACHE = 'webdrip-2026-10-02-halcyard-v1';
const PAGE = ['./', './index.html'];
const IMAGES = [
  "https://images.unsplash.com/photo-1790420832645-85e6b3e6edea?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8c3VubGl0JTIwY293b3JraW5nJTIwc3BhY2V8ZW58MXwwfHx8MTc5MDkxNTA3Mnww&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1493246318656-5bfd4cfb29b8?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8cm9vZnRvcCUyMHRlcnJhY2UlMjBjaXR5JTIwbW9ybmluZ3xlbnwxfDB8fHwxNzkwOTE1MDc0fDA&ixlib=rb-4.1.0&w=2000&q=80",
  "https://images.unsplash.com/photo-1654686474914-bb98f6280d10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8cGVvcGxlJTIwd29ya2luZyUyMGxhcHRvcCUyMHdpbmRvd3xlbnwxfDB8fHwxNzkwOTE1MDc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1648737963059-59ec8e2d50c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8cGVvcGxlJTIwd29ya2luZyUyMGxhcHRvcCUyMHdpbmRvd3xlbnwxfDB8fHwxNzkwOTE1MDc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1774853107769-c80031c15220?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OHx8YnJpZ2h0JTIwb2ZmaWNlJTIwcGxhbnRzJTIwaW50ZXJpb3J8ZW58MXwwfHx8MTc5MDkxNTA3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1763412050485-d7e1688f8858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OXx8YnJpZ2h0JTIwb2ZmaWNlJTIwcGxhbnRzJTIwaW50ZXJpb3J8ZW58MXwwfHx8MTc5MDkxNTA3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1756368881750-e9e065a1d1ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OXx8cGhvbmUlMjBib290aCUyMG9mZmljZXxlbnwxfDB8fHwxNzkwOTE1MDc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1637665662134-db459c1bbb46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8bWVldGluZyUyMHJvb20lMjBtaW5pbWFsfGVufDF8MHx8fDE3OTA5MTUwNzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1762928289633-c1565bc92931?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8YnJpZ2h0JTIwb2ZmaWNlJTIwcGxhbnRzJTIwaW50ZXJpb3J8ZW58MXwwfHx8MTc5MDkxNTA3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1562664377-709f2c337eb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8YnJpZ2h0JTIwb2ZmaWNlJTIwcGxhbnRzJTIwaW50ZXJpb3J8ZW58MXwwfHx8MTc5MDkxNTA3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1759903553690-e29fdc8b1c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8cGVvcGxlJTIwd29ya2luZyUyMGxhcHRvcCUyMHdpbmRvd3xlbnwxfDB8fHwxNzkwOTE1MDc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
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
    await Promise.all(keys.filter((k) => k.startsWith('webdrip-2026-10-02-halcyard') && k !== CACHE).map((k) => caches.delete(k)));
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
