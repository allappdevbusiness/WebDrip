// Gizmoberry concept — service worker
const CACHE = 'webdrip-gizmoberry-demo-v2';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1678225867994-e7a5b071ebfd?ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTg0NjUwfA&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1518792528501-352f829886dc?ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTg0NjQ5fA&ixlib=rb-4.1.0&w=1800&q=80",
  "https://images.unsplash.com/photo-1742047654060-fcd0b0d06b7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTg0NjQ5fA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1780006393664-142ed57a1593?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTg0NjQ4fA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1568585262983-9b54814595a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTg0NjUzfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1788366852101-fe1277240147?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTg0NjUzfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1527430253228-e93688616381?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTg0NjUyfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1616857002717-d337600d15ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTg0NjUyfA&ixlib=rb-4.1.0&q=80&w=1080",
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-gizmoberry-demo') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/sites/demos/gizmoberry-demo/') || url.pathname.endsWith('/sites/demos/gizmoberry-demo/index.html'));
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
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
});

