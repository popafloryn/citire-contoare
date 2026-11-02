/* Service worker: păstrează aplicația în cache ca să meargă și fără internet.
   La fiecare modificare a fișierelor, crește VERSION ca dispozitivele să ia versiunea nouă. */
const VERSION = 'contoare-v1';
const FILES = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './js/defaults.js',
  './js/calc.js',
  './js/store.js',
  './js/ui.js',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(FILES.map((f) => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Din cache imediat, apoi actualizează cache-ul din rețea pentru următoarea deschidere.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const cached = await cache.match(request, { ignoreSearch: true });
      // no-cache: revalidează cu serverul, ca actualizările să nu rămână blocate în cache-ul HTTP.
      // (o cerere de navigare nu poate fi refolosită cu opțiuni noi, de aceea URL-ul)
      const network = fetch(request.mode === 'navigate' ? request.url : request, { cache: 'no-cache' })
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => null);
      if (cached) {
        event.waitUntil(network);
        return cached;
      }
      const fresh = await network;
      return fresh || (request.mode === 'navigate' ? cache.match('./index.html') : Response.error());
    }),
  );
});
