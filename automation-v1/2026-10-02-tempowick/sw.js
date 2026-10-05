// Tempowick Music School concept — service worker
const CACHE = 'webdrip-2026-10-02-tempowick-v2';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1684784176798-aae206e325e7?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8cGlhbm8lMjBsZXNzb258ZW58MHwwfHx8MTc5MDk0ODY2OXww&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1786291924256-a0684ea01142?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8YmFuZCUyMHJlaGVhcnNhbCUyMHN0dWRpb3xlbnwwfDB8fHwxNzkwOTQ4NjcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1519076976365-9c64dbd98317?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8a2lkcyUyMG11c2ljJTIwY2xhc3N8ZW58MHwwfHx8MTc5MDk0ODY3MHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1536594527669-2f555de54e95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8YWNvdXN0aWMlMjBndWl0YXIlMjBwbGF5aW5nfGVufDB8MHx8fDE3OTA5MzQyNTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8ZHJ1bW1lciUyMGRydW0lMjBraXR8ZW58MHwwfHx8MTc5MDk0ODY2OXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1581548708095-7158f2e63857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8c2luZ2VyJTIwbWljcm9waG9uZSUyMHN0dWRpb3xlbnwwfDB8fHwxNzkwOTM0MjUwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1696522732406-065ef560da8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8a2lkcyUyMG11c2ljJTIwY2xhc3N8ZW58MHwwfHx8MTc5MDk0ODY3MHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1776464487858-9bd497910008?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8YmFuZCUyMHJlaGVhcnNhbCUyMHN0dWRpb3xlbnwwfDB8fHwxNzkwOTQ4NjcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1552422535-c45813c61732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8cGlhbm8lMjBsZXNzb258ZW58MHwwfHx8MTc5MDk0ODY2OXww&ixlib=rb-4.1.0&q=80&w=1080",
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-2026-10-02-tempowick') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/2026-10-02-tempowick/') || url.pathname.endsWith('/2026-10-02-tempowick/index.html'));
  if (IMAGE_URLS.has(req.url) || isPage) {
    event.respondWith(
      caches.match(req, { ignoreSearch: false }).then((hit) => hit || fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
