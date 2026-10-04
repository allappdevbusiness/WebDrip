// Bobblefin Swim School concept — service worker
const CACHE = 'webdrip-bobblefinswim-demo-v1';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1690125408806-bb88519d83c7?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8c3dpbW1pbmclMjBwb29sJTIwbGFuZXMlMjBhZXJpYWx8ZW58MHwwfHx8MTc5MTA4MTYwNHww&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1521851562770-de70f34424b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8c3dpbSUyMGxlc3NvbiUyMGNoaWxkfGVufDB8MHx8fDE3OTEwODE2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1726800820564-2eaecaa66b37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8c3dpbSUyMGxlc3NvbiUyMGNoaWxkfGVufDB8MHx8fDE3OTEwODE2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1648090272983-440e86555e8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8dG9kZGxlciUyMHN3aW1taW5nfGVufDB8MHx8fDE3OTEwODE2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1761839447370-8873d86f5b1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8a2lkcyUyMHN3aW1taW5nJTIwcG9vbHxlbnwwfDB8fHwxNzkxMDgxNjAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1651614158095-b98b6c1da74b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8c3dpbSUyMGxlc3NvbiUyMGNoaWxkfGVufDB8MHx8fDE3OTEwODE2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-bobblefinswim-demo') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/bobblefinswim-demo/') || url.pathname.endsWith('/bobblefinswim-demo/index.html'));
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
