// Nightquarry Planetarium concept — service worker
const CACHE = 'webdrip-nightquarry-demo-v1';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1778401133087-475ee2caaba6?ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTU1NDMxfA&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTU1NDMxfA&ixlib=rb-4.1.0&w=1800&q=80",
  "https://images.unsplash.com/photo-1717705422478-0b42e89e06b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTU1NDMxfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1504333638930-c8787321eee0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTU1NDMxfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1468186402854-9a641fd7a7c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTU1NDMyfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1548124771-9f2040b66df8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTU1NDMyfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1628818144466-856f7d477125?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTU1NDMyfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1604728890708-631078e3eab7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTU1NDMyfA&ixlib=rb-4.1.0&q=80&w=1080",
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-nightquarry-demo') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/sites/demos/nightquarry-demo/') || url.pathname.endsWith('/sites/demos/nightquarry-demo/index.html'));
  if (IMAGE_URLS.has(req.url) || isPage) {
    event.respondWith(
      caches.match(req, { ignoreSearch: false }).then((hit) => hit || fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
