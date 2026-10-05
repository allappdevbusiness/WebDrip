// Tallowmere Law concept — service worker
const CACHE = 'webdrip-tallowmere-demo-v1';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1660496247667-3fb697c396af?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8bW9kZXJuJTIwb2ZmaWNlJTIwYnVpbGRpbmclMjBkdXNrfGVufDB8MHx8fDE3OTEwNjUzNjF8MA&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8c2lnbmluZyUyMGNvbnRyYWN0JTIwZGVza3xlbnwwfDB8fHwxNzkxMDY1MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1622675363311-3e1904dc1885?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Nnx8c3RhcnR1cCUyMHRlYW0lMjBtZWV0aW5nfGVufDB8MHx8fDE3OTEwNjUzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1664463760781-f159dfe3af30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8c2lnbmluZyUyMGNvbnRyYWN0JTIwZGVza3xlbnwwfDB8fHwxNzkxMDY1MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1687422808191-93810cd07ab0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8c21hbGwlMjBidXNpbmVzcyUyMG93bmVyJTIwc2hvcHxlbnwwfDB8fHwxNzkxMDY1MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1753351052617-62818ffc9173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8c21hbGwlMjBidXNpbmVzcyUyMG93bmVyJTIwc2hvcHxlbnwwfDB8fHwxNzkxMDY1MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1676989880361-091e12efc056?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8cHJvZmVzc2lvbmFsJTIwcG9ydHJhaXQlMjBvZmZpY2V8ZW58MHwwfHx8MTc5MTA2NTM2NHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8cHJvZmVzc2lvbmFsJTIwcG9ydHJhaXQlMjBvZmZpY2V8ZW58MHwwfHx8MTc5MTA2NTM2NHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1758691737605-69a0e78bd193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8cHJvZmVzc2lvbmFsJTIwcG9ydHJhaXQlMjBvZmZpY2V8ZW58MHwwfHx8MTc5MTA2NTM2NHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1758518727592-706e80ebc354?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTF8fHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwb2ZmaWNlfGVufDB8MHx8fDE3OTEwNjUzNjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-tallowmere-demo') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/automation-v1/demos/tallowmere-demo/') || url.pathname.endsWith('/automation-v1/demos/tallowmere-demo/index.html'));
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
