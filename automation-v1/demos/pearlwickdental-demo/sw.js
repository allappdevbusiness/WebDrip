// Pearlwick Dental Studio concept — service worker
const CACHE = 'webdrip-pearlwickdental-demo-v1';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8c21pbGluZyUyMHdvbWFuJTIwdGVldGh8ZW58MHwwfHx8MTc5MTAxMTY5OXww&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1704455306251-b4634215d98f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8ZGVudGlzdCUyMGNoYWlyfGVufDB8MHx8fDE3OTEwMTE2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1758600588701-3aa5bb5d4e18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8c21pbGluZyUyMHdvbWFuJTIwdGVldGh8ZW58MHwwfHx8MTc5MTAxMTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8Y2xlYXIlMjBhbGlnbmVyc3xlbnwwfHx8fDE3OTEwMTE3MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1777331903190-341a3dd0441b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OXx8ZGVudGlzdCUyMGNoYWlyfGVufDB8MHx8fDE3OTEwMTE2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1629909614456-6b1c5c94cecc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8bW9kZXJuJTIwZGVudGFsJTIwY2xpbmljfGVufDB8MHx8fDE3OTEwMTE2OTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1643660526741-094639fbe53a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8bW9kZXJuJTIwZGVudGFsJTIwY2xpbmljfGVufDB8MHx8fDE3OTEwMTE2OTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1708687045000-9dbb586ad1e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OHx8Y2hpbGQlMjBkZW50aXN0fGVufDB8fHx8MTc5MTAxMTczNXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1617984161716-189c889bd474?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8dG9vdGhicnVzaCUyMG1pbmltYWx8ZW58MHx8fHwxNzkxMDExNzM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-pearlwickdental-demo') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/automation-v1/demos/pearlwickdental-demo/') || url.pathname.endsWith('/automation-v1/demos/pearlwickdental-demo/index.html'));
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
