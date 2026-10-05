// Ashcanter Riding School concept — service worker
const CACHE = 'webdrip-ashcanter-demo-v1';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1630431627244-493adc819107?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTV8fGhvcnNlYmFjayUyMHJpZGluZyUyMGdvbGRlbiUyMGhvdXJ8ZW58MHwwfHx8MTc5MTA1MjM3MHww&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1758380424915-2363fd5046d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Nnx8aG9yc2UlMjBmb3Jlc3QlMjB0cmFpbHxlbnwwfDB8fHwxNzkxMDUyMzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1611436920234-94ea2cad6e98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTN8fHBvbnl8ZW58MHwwfHx8MTc5MTA1MjM3MHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1763130063689-06fbdb789db8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OHx8aG9yc2UlMjByaWRpbmclMjBhcmVuYXxlbnwwfDB8fHwxNzkxMDUyMzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1763130063588-5608738a6f61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTJ8fGhvcnNlJTIwcmlkaW5nJTIwYXJlbmF8ZW58MHwwfHx8MTc5MTA1MjM0OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1789985478605-9485876472e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTF8fGhvcnNlJTIwcmlkaW5nJTIwYXJlbmF8ZW58MHwwfHx8MTc5MTA1MjM0OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1504020853563-338d87e28a89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8aG9yc2UlMjBwb3J0cmFpdHxlbnwwfDB8fHwxNzkxMDUyMzUwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1561361649-c86e8a408c95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8aG9yc2UlMjBwb3J0cmFpdHxlbnwwfDB8fHwxNzkxMDUyMzUwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1497781495506-ce58b286d8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Nnx8cG9ueXxlbnwwfDB8fHwxNzkxMDUyMzcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1718045330352-7b800f3bba80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8cG9ueXxlbnwwfDB8fHwxNzkxMDUyMzcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1576692192914-9abed71b3ef9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8aG9yc2UlMjBzdGFibGUlMjBiYXJufGVufDB8MHx8fDE3OTEwNTIzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-ashcanter-demo') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/sites/demos/ashcanter-demo/') || url.pathname.endsWith('/sites/demos/ashcanter-demo/index.html'));
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
