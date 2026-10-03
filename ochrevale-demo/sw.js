// Ochrevale Desert House concept — service worker
const CACHE = 'webdrip-ochrevale-demo-v1';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1528351040353-814ae7cb214f?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Nnx8ZGVzZXJ0JTIwdmlsbGElMjB0ZXJyYWNlfGVufDB8MHx8fDE3OTEwMDY0NDJ8MA&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/20/dusty-sky.JPG?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8ZGVzZXJ0JTIwbmlnaHQlMjBzdGFyc3xlbnwwfDB8fHwxNzkxMDA2NDMyfDA&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1760261799672-2469a6c4c6f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Nnx8ZGVzZXJ0JTIwaG90ZWwlMjBwb29sJTIwZHVza3xlbnwwfDB8fHwxNzkxMDA2NDMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1505575064689-c5f0586c4a78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8ZGVzZXJ0JTIwdmlsbGElMjB0ZXJyYWNlfGVufDB8MHx8fDE3OTEwMDY0NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1785057707880-777f72acea8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8YmF0aHR1YiUyMHZpZXclMjBtb3VudGFpbnN8ZW58MHwwfHx8MTc5MTAwNjQ0MXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1645378704753-6fce1ae98080?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8eW9nYSUyMGRlc2VydHxlbnwwfDB8fHwxNzkxMDA2NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1682695795255-b236b1f1267d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8ZGVzZXJ0JTIwaGlraW5nJTIwY2FueW9ufGVufDB8MHx8fDE3OTEwMDY0MzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1457264635001-828d0cbd483e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8aG90JTIwYWlyJTIwZGVzZXJ0JTIwc3VucmlzZXxlbnwwfDB8fHwxNzkxMDA2NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1737064700128-c0769e13e211?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8c3BhJTIwc3RvbmVzJTIwY2FuZGxlc3xlbnwwfDB8fHwxNzkxMDA2NDM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1589046207215-b5ee3097bafc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8aG90JTIwYWlyJTIwZGVzZXJ0JTIwc3VucmlzZXxlbnwwfDB8fHwxNzkxMDA2NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-ochrevale-demo') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/ochrevale-demo/') || url.pathname.endsWith('/ochrevale-demo/index.html'));
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
