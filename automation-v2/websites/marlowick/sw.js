// Cache-first service worker, versioned by slug. The post-build script fills PRECACHE.
const VERSION = 'marlowick-v1';
const PRECACHE = [
  "./",
  "./index.html",
  "./assets/index-C3pQSRPA.css",
  "./assets/index-P8fO1R6r.js",
  "./assets/inter-latin-wght-normal-Dx4kXJAl.woff2",
  "./assets/jetbrains-mono-latin-500-normal-BWZEU5yA.woff2",
  "https://images.unsplash.com/photo-1743792931983-569266bb55d3?ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Nnx8bWVuc3dlYXIlMjBzdG9yZSUyMHN1aXRzJTIwcmFja3xlbnwwfDB8fHwxNzkxMjIzODgyfDA&ixlib=rb-4.1.0&w=2400&q=80",
  "https://images.unsplash.com/photo-1553975994-02450ef0dfaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8c3VpdCUyMGZpdHRpbmclMjB0YWlsb3IlMjBtZWFzdXJpbmd8ZW58MHwwfHx8MTc5MTIyMzg4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1617332518455-bfd5a39476f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8bWFuJTIwbmF2eSUyMHN1aXQlMjBwb3J0cmFpdHxlbnwwfDB8fHwxNzkxMjIzODgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1459204137123-238c569e22bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8dHV4ZWRvJTIwZ3Jvb20lMjB3ZWRkaW5nfGVufDB8MHx8fDE3OTEyMjM4ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1637264896197-868428967e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8OXx8c3VpdCUyMGZpdHRpbmclMjB0YWlsb3IlMjBtZWFzdXJpbmd8ZW58MHwwfHx8MTc5MTIyMzg4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1745270008562-318fb7dbfe1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8Nnx8dHV4ZWRvJTIwZ3Jvb20lMjB3ZWRkaW5nfGVufDB8MHx8fDE3OTEyMjM4ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1519743670471-034311358429?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8bWVuJTIwZHJlc3MlMjBzaGlydCUyMHRpZXxlbnwwfDB8fHwxNzkxMjIzODgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1633655442432-620aa55d7ac1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8bWVuc3dlYXIlMjBzdG9yZSUyMHN1aXRzJTIwcmFja3xlbnwwfDB8fHwxNzkxMjIzODgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/flagged/photo-1571582159131-b6fcd22646c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8dHV4ZWRvJTIwZ3Jvb20lMjB3ZWRkaW5nfGVufDB8MHx8fDE3OTEyMjM4ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1445117627052-274425469152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8MXx8dHV4ZWRvJTIwZ3Jvb20lMjB3ZWRkaW5nfGVufDB8MHx8fDE3OTEyMjM4ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1755552370726-e8a4ce0250ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NHx8c3VpdCUyMGZpdHRpbmclMjB0YWlsb3IlMjBtZWFzdXJpbmd8ZW58MHwwfHx8MTc5MTIyMzg4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1625038031233-17ff131a4995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8M3x8bWFuJTIwbmF2eSUyMHN1aXQlMjBwb3J0cmFpdHxlbnwwfDB8fHwxNzkxMjIzODgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1785645536113-b39af7c1835c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDYxOTEwfDB8MXxzZWFyY2h8NXx8bWVuJTIwZHJlc3MlMjBzaGlydCUyMHRpZXxlbnwwfDB8fHwxNzkxMjIzODgzfDA&ixlib=rb-4.1.0&q=80&w=1080"
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
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('marlowick-') && k !== VERSION).map((k) => caches.delete(k))))
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
