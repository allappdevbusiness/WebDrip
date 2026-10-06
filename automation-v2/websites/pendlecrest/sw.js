// Cache-first service worker, versioned by slug. The post-build script fills PRECACHE.
const VERSION = 'pendlecrest-v1';
const PRECACHE = [
  "./",
  "./index.html",
  "./services.html",
  "./book.html",
  "./assets/HomeWidgets-BVWuwpO_.js",
  "./assets/PageHeader-WkmkzZnp.js",
  "./assets/archivo-latin-wdth-normal-DY7AcnAa.woff2",
  "./assets/book-BUQ_SE0x.js",
  "./assets/effects-BOqoxp3B.css",
  "./assets/effects-Cji_7Xf4.js",
  "./assets/index-CXhLXR7I.js",
  "./assets/services-BZMT4El-.js",
  "https://images.unsplash.com/photo-1649803091689-0e65c4e9581f?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8d2F0Y2glMjByZXBhaXIlMjB0b29sc3xlbnwxfDB8fHwxNzkxMzE3NTg4fDA&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1700649631376-2cd9218705e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8d2F0Y2glMjByZXBhaXIlMjB0b29sc3xlbnwxfDB8fHwxNzkxMzE3NTg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1633451238208-11c8e6c1fed4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MjB8fHdhdGNoJTIwbW92ZW1lbnQlMjBtYWNyb3xlbnwxfDB8fHwxNzkxMzE3NTg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1633451238042-85d93d267866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8cG9ja2V0JTIwd2F0Y2h8ZW58MXwwfHx8MTc5MTMxNzU4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1764429601437-85ad5745f0b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8d2F0Y2glMjBtb3ZlbWVudCUyMG1hY3JvfGVufDF8MHx8fDE3OTEzMTc1ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1731446451263-fc3881d4973d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8d2F0Y2glMjByZXBhaXIlMjB0b29sc3xlbnwxfDB8fHwxNzkxMzE3NTg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1508962914676-134849a727f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8d2F0Y2glMjBtb3ZlbWVudCUyMG1hY3JvfGVufDF8MHx8fDE3OTEzMTc1ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1677445166019-4fa91a090e49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8dmludGFnZSUyMHdyaXN0d2F0Y2h8ZW58MXwwfHx8MTc5MTMxNzU4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1633710247224-a785c6599568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OXx8cG9ja2V0JTIwd2F0Y2h8ZW58MXwwfHx8MTc5MTMxNzU4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1690343430066-d4634276895d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTB8fG1lY2hhbmljYWwlMjB3YXRjaCUyMGRpYWx8ZW58MXwwfHx8MTc5MTMxNzU4OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1589906190175-2b867c751f50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTJ8fHZpbnRhZ2UlMjB3cmlzdHdhdGNofGVufDF8MHx8fDE3OTEzMTc1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1789238959604-908d95334e96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8d2F0Y2glMjByZXBhaXIlMjB0b29sc3xlbnwxfDB8fHwxNzkxMzE3NTg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1786501135828-6927a8612593?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8d2F0Y2glMjByZXBhaXIlMjB0b29sc3xlbnwxfDB8fHwxNzkxMzE3NTg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1700649691091-81ef194ce346?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTF8fHdhdGNoJTIwcmVwYWlyJTIwdG9vbHN8ZW58MXwwfHx8MTc5MTMxNzU4OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1529655608570-ca66f0aae5e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8d2F0Y2glMjBzdHJhcCUyMGxlYXRoZXJ8ZW58MXwwfHx8MTc5MTMxNzU4OXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1612817159623-0399784fd0ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Mnx8d2F0Y2glMjBzdHJhcCUyMGxlYXRoZXJ8ZW58MXwwfHx8MTc5MTMxNzU4OXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1431499012454-31a9601150c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8N3x8cG9ja2V0JTIwd2F0Y2h8ZW58MXwwfHx8MTc5MTMxNzU4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1535449425-adc6f5faa71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTB8fHdhdGNoJTIwc3RyYXAlMjBsZWF0aGVyfGVufDF8MHx8fDE3OTEzMTc1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1710819746621-fd5360be11c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OXx8dmludGFnZSUyMHdyaXN0d2F0Y2h8ZW58MXwwfHx8MTc5MTMxNzU4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1516456277948-c81597a8d1be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTF8fHBvY2tldCUyMHdhdGNofGVufDF8MHx8fDE3OTEzMTc1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1523645648799-d4fdcf6b5d4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OHx8cG9ja2V0JTIwd2F0Y2h8ZW58MXwwfHx8MTc5MTMxNzU4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1604118725369-f989830f8d69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8cG9ja2V0JTIwd2F0Y2h8ZW58MXwwfHx8MTc5MTMxNzU4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1710819762106-ef4bca6f40d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MTB8fHZpbnRhZ2UlMjB3cmlzdHdhdGNofGVufDF8MHx8fDE3OTEzMTc1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) =>
      Promise.all(PRECACHE.map((url) =>
        cache.add(new Request(url, { mode: url.startsWith('http') ? 'no-cors' : 'same-origin' })).catch(() => {})
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('pendlecrest-') && k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((hit) => hit || fetch(event.request).then((res) => {
      if (res && (res.ok || res.type === 'opaque')) {
        const copy = res.clone();
        caches.open(VERSION).then((cache) => cache.put(event.request, copy));
      }
      return res;
    }))
  );
});
