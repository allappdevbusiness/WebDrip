// Chainwren Cycles concept — service worker
const CACHE = 'webdrip-chainwrencycles-demo-v1';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1673870861521-626b40f9657e?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8YmlrZSUyMHJlcGFpciUyMGhhbmRzfGVufDB8MHx8fDE3OTEwODYzNjh8MA&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1760310936486-4dd450aab2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8YmljeWNsZSUyMG1lY2hhbmljJTIwd29ya3Nob3B8ZW58MHwwfHx8MTc5MTA4NjM2OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1671790639553-43973054c51e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Nnx8YmlrZSUyMHJlcGFpciUyMGhhbmRzfGVufDB8MHx8fDE3OTEwODYzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1779043750168-ef291893cd9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8YmljeWNsZSUyMGNoYWluJTIwY2Fzc2V0dGV8ZW58MHwwfHx8MTc5MTA4NjM2OXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1592222166121-93437e78d8d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8YmlrZSUyMHJlcGFpciUyMGhhbmRzfGVufDB8MHx8fDE3OTEwODYzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1675798227643-da319f8ee8f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8YmlrZSUyMHJlcGFpciUyMGhhbmRzfGVufDB8MHx8fDE3OTEwODYzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1696153658764-80e6bf4e87de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8Y3ljbGlzdCUyMGNpdHklMjBzdHJlZXR8ZW58MHwwfHx8MTc5MTA4NjM3MHww&ixlib=rb-4.1.0&q=80&w=1080",
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-chainwrencycles-demo') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/chainwrencycles-demo/') || url.pathname.endsWith('/chainwrencycles-demo/index.html'));
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
