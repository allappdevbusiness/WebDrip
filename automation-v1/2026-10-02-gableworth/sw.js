// Gableworth Studio concept — service worker
const CACHE = 'webdrip-2026-10-02-gableworth-v1';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1778166166446-4ecccd525922?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTB8fG1vZGVybiUyMGhvdXNlJTIwYXJjaGl0ZWN0dXJlJTIwZGF5bGlnaHR8ZW58MHwwfHx8MTc5MDk0MTUzMnww&ixlib=rb-4.1.0&auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1695712551846-4dc15433fbd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OHx8YXJjaGl0ZWN0JTIwbW9kZWwlMjBzdHVkaW98ZW58MHwwfHx8MTc5MDk0MTUzMnww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1704457031803-2c39a23e9faa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OXx8bW9kZXJuJTIwaG91c2UlMjBhcmNoaXRlY3R1cmUlMjBkYXlsaWdodHxlbnwwfDB8fHwxNzkwOTQxNTMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1754063257992-bb9eabdbdd86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8aG91c2UlMjBleHRlbnNpb24lMjB0aW1iZXJ8ZW58MHwwfHx8MTc5MDk0MTUzM3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1772223480849-11c5ec6d78ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8bWluaW1hbCUyMGludGVyaW9yJTIwY29uY3JldGUlMjBsaWdodHxlbnwwfDB8fHwxNzkwOTQxNTMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1787839971382-57ba26113882?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8bWluaW1hbCUyMGludGVyaW9yJTIwY29uY3JldGUlMjBsaWdodHxlbnwwfDB8fHwxNzkwOTQxNTMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1760067537293-6b30141d6a52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTJ8fG1vZGVybiUyMGhvdXNlJTIwYXJjaGl0ZWN0dXJlJTIwZGF5bGlnaHR8ZW58MHwwfHx8MTc5MDk0MTUzMnww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1653164494885-a8526f62678c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8YXJjaGl0ZWN0JTIwbW9kZWwlMjBzdHVkaW98ZW58MHwwfHx8MTc5MDk0MTUzMnww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1653164488636-7407bec89281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OXx8YXJjaGl0ZWN0JTIwbW9kZWwlMjBzdHVkaW98ZW58MHwwfHx8MTc5MDk0MTUzMnww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1782290547018-8bb89b8edf07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTF8fGFyY2hpdGVjdCUyMG1vZGVsJTIwc3R1ZGlvfGVufDB8MHx8fDE3OTA5NDE1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1753893558279-8beaad18dd96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OHx8aG91c2UlMjBleHRlbnNpb24lMjB0aW1iZXJ8ZW58MHwwfHx8MTc5MDk0MTUzM3ww&ixlib=rb-4.1.0&q=80&w=1080",
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-2026-10-02-gableworth') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/2026-10-02-gableworth/') || url.pathname.endsWith('/2026-10-02-gableworth/index.html'));
  if (IMAGE_URLS.has(req.url) || isPage) {
    event.respondWith(
      caches.match(req, { ignoreSearch: false }).then((hit) => hit || fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
