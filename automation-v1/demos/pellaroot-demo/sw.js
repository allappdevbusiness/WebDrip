// Pellaroot Botanics concept — service worker
const CACHE = 'webdrip-pellaroot-demo-v1';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1608571702600-5a5419d31475?ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTcwMjY0fA&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1773357832731-dbd31b23cd5e?ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTcwMjYyfA&ixlib=rb-4.1.0&w=1800&q=80",
  "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTcwMjYzfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1781346325200-61cef7b29d76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTcwMjYzfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1585945037805-5fd82c2e60b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTcwMzExfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1623150502742-6a849aa94be4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTcwMzExfA&ixlib=rb-4.1.0&q=80&w=1080",
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-pellaroot-demo') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/automation-v1/demos/pellaroot-demo/') || url.pathname.endsWith('/automation-v1/demos/pellaroot-demo/index.html'));
  if (IMAGE_URLS.has(req.url) || isPage) {
    event.respondWith(
      caches.match(req, { ignoreSearch: false }).then((hit) => hit || fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
