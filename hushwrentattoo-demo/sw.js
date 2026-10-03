// Hushwren Tattoo concept — service worker
const CACHE = 'webdrip-hushwrentattoo-demo-v1';
const PRECACHE = [
  './',
  './index.html',
  "https://images.unsplash.com/photo-1712432321375-226f466fff85?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTB8fGZpbmUlMjBsaW5lJTIwdGF0dG9vfGVufDB8fHx8MTc5MTA0ODIxMnww&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1769485016772-c5a4234a6be3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTV8fHRhdHRvbyUyMGZsYXNoJTIwc2hlZXR8ZW58MHx8fHwxNzkxMDQ4MjEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1570168983832-8989dae1522e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8ZmluZSUyMGxpbmUlMjB0YXR0b298ZW58MHx8fHwxNzkxMDQ4MjEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1787308094157-73e9eb65e2e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8Ym90YW5pY2FsJTIwdGF0dG9vJTIwYXJtfGVufDB8fHx8MTc5MTA0ODIxNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1736628283631-8d9c8167fa88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTd8fGZpbmUlMjBsaW5lJTIwdGF0dG9vfGVufDB8fHx8MTc5MTA0ODIxMnww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1547754145-ef9ff306e3f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8ZmluZSUyMGxpbmUlMjB0YXR0b298ZW58MHx8fHwxNzkxMDQ4MjEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1588417490421-63d4e4175f95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8Ym90YW5pY2FsJTIwdGF0dG9vJTIwYXJtfGVufDB8fHx8MTc5MTA0ODIxNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1758404255679-9afd847ede1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTV8fHRhdHRvbyUyMG1hY2hpbmUlMjBpbmt8ZW58MHx8fHwxNzkxMDQ4MjEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1767887874488-5f715c7db794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MjB8fHRhdHRvbyUyMGFydGlzdCUyMHN0dWRpbyUyMGRhcmt8ZW58MHx8fHwxNzkxMDQ4MjExfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1759247943101-f1b32bcc6a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8dGF0dG9vJTIwYXJ0aXN0JTIwc3R1ZGlvJTIwZGFya3xlbnwwfHx8fDE3OTEwNDgyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1542744383-8c330d91f4b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8ZmluZSUyMGxpbmUlMjB0YXR0b298ZW58MHx8fHwxNzkxMDQ4MjEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1482375702222-03a768d5ea3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTJ8fHRhdHRvbyUyMG1hY2hpbmUlMjBpbmt8ZW58MHx8fHwxNzkxMDQ4MjEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1711112109420-ecf9be11abb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTl8fHRhdHRvbyUyMGZsYXNoJTIwc2hlZXR8ZW58MHx8fHwxNzkxMDQ4MjEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1753260814170-9f77d48c016e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OHx8dGF0dG9vJTIwZmxhc2glMjBzaGVldHxlbnwwfHx8fDE3OTEwNDgyMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8dGF0dG9vJTIwbWFjaGluZSUyMGlua3xlbnwwfHx8fDE3OTEwNDgyMTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
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
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('webdrip-hushwrentattoo-demo') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/hushwrentattoo-demo/') || url.pathname.endsWith('/hushwrentattoo-demo/index.html'));
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
