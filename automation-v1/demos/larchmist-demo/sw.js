// Larchmist Bathhouse concept — service worker
const CACHE = 'webdrip-larchmist-demo-v1';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1701815017903-dd64dfc8ca80?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8bm9yZGljJTIwc2F1bmElMjBsYWtlfGVufDB8MHx8fDE3OTA5NjMwNjh8MA&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1568729937315-2ef5ee9cf4f2?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8c2F1bmElMjBmb3Jlc3QlMjBjYWJpbnxlbnwwfDB8fHwxNzkwOTYzMDY5fDA&ixlib=rb-4.1.0&w=1800&q=80",
  "https://images.unsplash.com/photo-1728404259075-209cfb5bb89c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8c2F1bmElMjBpbnRlcmlvciUyMHdvb2R8ZW58MHwwfHx8MTc5MDk2MzA2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1786799901347-e45b3e2d64ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8c3RlYW0lMjBiYXRoJTIwc3BhfGVufDB8MHx8fDE3OTA5NjMwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1713270176378-45fbf4a27099?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8bm9yZGljJTIwc2F1bmElMjBsYWtlfGVufDB8MHx8fDE3OTA5NjMwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1701895853566-bd08afa0c422?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Nnx8Y29sZCUyMHBsdW5nZXxlbnwwfDB8fHwxNzkwOTYzMDY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1778776073764-4d7e4b7f4151?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OHx8Y29sZCUyMHBsdW5nZXxlbnwwfDB8fHwxNzkwOTYzMDY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1786799966417-bead801334e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8c3RlYW0lMjBiYXRoJTIwc3BhfGVufDB8MHx8fDE3OTA5NjMwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
];
const IMAGE_URLS = new Set(PRECACHE.filter((u) => u.startsWith('https://')));

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => Promise.all(PRECACHE.map((url) =>
      cache.add(new Request(url, url.startsWith('https://') ? { mode: 'no-cors' } : {})).catch(() => {})
    ))).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-larchmist-demo') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/automation-v1/demos/larchmist-demo/') || url.pathname.endsWith('/automation-v1/demos/larchmist-demo/index.html'));
  if (IMAGE_URLS.has(req.url) || isPage) {
    event.respondWith(
      caches.match(req, { ignoreSearch: false }).then((hit) => hit || fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
