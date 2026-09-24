// Офлайн-кэш: после первого открытия игра работает без сети.
const CACHE = 'drift-v17';
const FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './three.min.js', './GLTFLoader.js', './tracks.js', './ae86.glb', './rx7.glb', './passat.glb'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request)));
});
