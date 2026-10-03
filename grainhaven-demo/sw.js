// Grainhaven Film Lab concept — service worker
const CACHE = 'webdrip-grainhaven-demo-v1';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1527606078995-42486f991014?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OHx8MzVtbSUyMGZpbG0lMjBjYW1lcmF8ZW58MHwwfHx8MTc5MDk5MDc1OXww&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1698899114691-3e4a5d9be3dc?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8ZGFya3Jvb20lMjByZWQlMjBsaWdodHxlbnwwfDB8fHwxNzkwOTkwNzYwfDA&ixlib=rb-4.1.0&w=1800&q=80",
  "https://images.unsplash.com/photo-1635868797256-e4817c6ecb73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8ZmlsbSUyMHJvbGxzfGVufDB8MHx8fDE3OTA5OTA3NjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1570385404967-fe4e1b48454b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Nnx8ZmlsbSUyMG5lZ2F0aXZlc3xlbnwwfDB8fHwxNzkwOTkwNzYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1561950492-527f225be206?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Nnx8bWVkaXVtJTIwZm9ybWF0JTIwY2FtZXJhfGVufDB8MHx8fDE3OTA5OTA3NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1736710744593-9995ac2ba227?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8c2xpZGUlMjBmaWxtJTIwbGlnaHRib3h8ZW58MHwwfHx8MTc5MDk5MDc2Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1698899114689-1d150e8cfa7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8ZGFya3Jvb20lMjByZWQlMjBsaWdodHxlbnwwfDB8fHwxNzkwOTkwNzYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1479064118661-04dd16543243?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8MzVtbSUyMGZpbG0lMjBjYW1lcmF8ZW58MHwwfHx8MTc5MDk5MDc1OXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1452875015199-95154554d9ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OXx8bWVkaXVtJTIwZm9ybWF0JTIwY2FtZXJhfGVufDB8MHx8fDE3OTA5OTA3NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1644997331922-6f8bc0f7618e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OXx8ZmlsbSUyMHJvbGxzfGVufDB8MHx8fDE3OTA5OTA3NjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1646323585896-6feedc2526af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8bWVkaXVtJTIwZm9ybWF0JTIwY2FtZXJhfGVufDB8MHx8fDE3OTA5OTA3NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-grainhaven-demo') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/grainhaven-demo/') || url.pathname.endsWith('/grainhaven-demo/index.html'));
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
