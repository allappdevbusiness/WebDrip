/* Crimpwell concept site: cache-first for the page and its Unsplash images */
const CACHE = 'webdrip-2026-10-02-crimpwell-v2';
const PAGE = ['./', './index.html'];
const IMAGES = [
  "https://images.unsplash.com/photo-1775655111243-9382dc0cc089?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8Ym91bGRlcmluZyUyMGZyaWVuZHN8ZW58MHwwfHx8MTc5MDkyNzA3N3ww&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1619995621826-94cafa15fc9f?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Nnx8Y2xpbWJpbmclMjBjaGFsayUyMGhhbmRzfGVufDB8MHx8fDE3OTA5MjY2NTF8MA&ixlib=rb-4.1.0&w=2000&q=80",
  "https://images.unsplash.com/photo-1696105538782-7815474f28e0?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8Y2xpbWJlciUyMG92ZXJoYW5nJTIwYm91bGRlcmluZ3xlbnwwfDB8fHwxNzkwOTI2NjUxfDA&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80",
  "https://images.unsplash.com/photo-1696105538708-6be6c90707a1?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8Ym91bGRlcmluZyUyMGd5bSUyMHdhbGx8ZW58MHwwfHx8MTc5MDkyNjY1MHww&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80",
  "https://images.unsplash.com/photo-1689775884478-9ed19b79d659?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OHx8aW5kb29yJTIwY2xpbWJpbmclMjBraWRzfGVufDB8MHx8fDE3OTA5MjY2NTF8MA&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80",
  "https://images.unsplash.com/photo-1703949174168-dc487811ab05?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTB8fGNsaW1iZXIlMjBvdmVyaGFuZyUyMGJvdWxkZXJpbmd8ZW58MHwwfHx8MTc5MDkyNjY1MXww&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80",
  "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8Y2xpbWJlciUyMG92ZXJoYW5nJTIwYm91bGRlcmluZ3xlbnwwfDB8fHwxNzkwOTI2NjUxfDA&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80",
  "https://images.unsplash.com/photo-1608027179000-3a1d254a0f46?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OHx8Ym91bGRlcmluZyUyMGZyaWVuZHN8ZW58MHwwfHx8MTc5MDkyNzA3N3ww&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516641380162-35b44adf4697?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8Y2xpbWJpbmclMjBjaGFsayUyMGhhbmRzfGVufDB8MHx8fDE3OTA5MjY2NTF8MA&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80",
  "https://images.unsplash.com/photo-1509398484917-2a5b6439feef?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8aW5kb29yJTIwY2xpbWJpbmclMjBraWRzfGVufDB8MHx8fDE3OTA5MjY2NTF8MA&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80",
  "https://images.unsplash.com/photo-1775655111279-748c2dccd065?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTB8fGJvdWxkZXJpbmclMjBneW0lMjB3YWxsfGVufDB8MHx8fDE3OTA5MjY2NTB8MA&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80",
  "https://images.unsplash.com/photo-1775654792415-fa6c6760b886?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OXx8Ym91bGRlcmluZyUyMGd5bSUyMHdhbGx8ZW58MHwwfHx8MTc5MDkyNjY1MHww&ixlib=rb-4.1.0&w=1000&h=750&fit=crop&q=80"
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(PAGE);
    await Promise.all(IMAGES.map(async (url) => {
      try {
        const res = await fetch(new Request(url, { mode: 'no-cors' }));
        await cache.put(url, res);
      } catch (e) { /* offline at install: skip this image */ }
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('webdrip-2026-10-02-crimpwell') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

const PRECACHED = new Set(IMAGES);

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = url.origin === self.location.origin && (url.pathname.endsWith('/index.html') || url.pathname === new URL('./', self.location).pathname);
  if (!isPage && !PRECACHED.has(req.url)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: false });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    } catch (e) {
      return hit || Response.error();
    }
  })());
});
