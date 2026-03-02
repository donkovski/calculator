const CACHE_NAME = "allianz-fx-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./allianz_logo.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Network-first за API, за да взимаме live rates ако може
  if (req.url.includes("api.frankfurter.app")) {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Cache-first за статичните файлове
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});