// Voltquill concept — service worker
const CACHE = 'webdrip-voltquill-demo-v1';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1783413154353-50531d4244e5?ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTc3NDU3fA&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTc3NDU4fA&ixlib=rb-4.1.0&w=1800&q=80",
  "https://images.unsplash.com/photo-1635704764831-082c47202c6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTc3NDU5fA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1719671310919-9cd78524491b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTc3NDYwfA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1773738214145-60c47b5f317d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxhbGx8fHx8fHx8fHwxNzkwOTc3NDYxfA&ixlib=rb-4.1.0&q=80&w=1080",
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-voltquill-demo') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/sites/demos/voltquill-demo/') || url.pathname.endsWith('/sites/demos/voltquill-demo/index.html'));
  if (IMAGE_URLS.has(req.url) || isPage) {
    event.respondWith(
      caches.match(req, { ignoreSearch: false }).then((hit) => hit || fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
