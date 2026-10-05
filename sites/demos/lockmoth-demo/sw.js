// Lockmoth Escape Rooms concept — service worker
const CACHE = 'webdrip-lockmoth-demo-v1';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1763910288767-f0c5c46b6841?ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTk5OTY4fA&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1588475950972-c872dd2e730e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTk5OTcyfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1758730010177-1711515b7552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTk5OTY5fA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1759338069275-333580793462?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTk5OTcwfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1616163527093-41acfce459ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTk5OTcxfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1550527882-b71dea5f8089?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTk5OTY5fA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1681641092941-b1acee507ee0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTk5OTczfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1773614207981-19bce2baa7e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTk5OTc0fA&ixlib=rb-4.1.0&q=80&w=1080",
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-lockmoth-demo') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/sites/demos/lockmoth-demo/') || url.pathname.endsWith('/sites/demos/lockmoth-demo/index.html'));
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
