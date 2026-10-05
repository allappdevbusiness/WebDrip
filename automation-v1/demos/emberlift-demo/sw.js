// Emberlift Balloon Flights concept — service worker
const CACHE = 'webdrip-emberlift-demo-v1';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1761496921386-81d399db4df9?ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkxMDAyODI4fA&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1771654951484-6f711dda28c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkxMDAyODI5fA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/41/bXoAlw8gT66vBo1wcFoO_IMG_9181.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkxMDAyODMwfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1786151814950-8c2de1e13287?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkxMDAyODMxfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1790426540063-c51af52f12b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkxMDAyODMxfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1781340389634-2bebfba2a51c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkxMDAyODMwfA&ixlib=rb-4.1.0&q=80&w=1080",
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-emberlift-demo') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/automation-v1/demos/emberlift-demo/') || url.pathname.endsWith('/automation-v1/demos/emberlift-demo/index.html'));
  if (isPage) {
    // network-first for the page so updates always show; cached copy only when offline
    event.respondWith(
      fetch(req).then((res) => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }
  if (IMAGE_URLS.has(req.url)) {
    // cache-first for the Unsplash photos
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
