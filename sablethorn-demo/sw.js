// Sablethorn Tailors concept — service worker
const CACHE = 'webdrip-sablethorn-demo-v1';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1667283831538-34bba5aeb094?ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTkzMDQyfA&ixlib=rb-4.1.0&rect=0,1150,6720,3330&w=2400&q=80",
  "https://images.unsplash.com/photo-1568288796918-03e7d93306bd?ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTkyOTg5fA&ixlib=rb-4.1.0&w=1800&q=80",
  "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTkyOTg5fA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1523211737006-e54a3c7299ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTkyOTg5fA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1489370603040-dc6c28a1d37a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTkyOTg5fA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1580065946391-0ef4a25ca389?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTkzMDQyfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1680835099030-9c7532f744f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTkyOTg4fA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1606501126768-b78d4569d3f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTkyOTg5fA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1705248383815-c6bc07898592?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTkyOTkwfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1705248382836-3618e25706d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTkyOTkwfA&ixlib=rb-4.1.0&q=80&w=1080",
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-sablethorn-demo') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/sablethorn-demo/') || url.pathname.endsWith('/sablethorn-demo/index.html'));
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
