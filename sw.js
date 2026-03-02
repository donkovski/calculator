const CACHE_NAME="allianz-fx-v3";
const ASSETS=["./","./index.html","./manifest.json","./allianz_logo.png"];

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
});

self.addEventListener("fetch",e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request))
  );
});