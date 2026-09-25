// Офлайн-кэш: после первого открытия игра работает без сети.
const CACHE = 'drift-v35';

// Установка кэширует только то, без чего игра не откроется. Модели машин сюда
// не входят: addAll срывается целиком, если хоть один файл не докачался, а
// rx7fc.glb весит 3,6 МБ — на мобильной сети это обрывается сплошь и рядом, и тогда
// новый обработчик не вставал вовсе, оставляя страницу со старыми обломками
// (25.09.2026). Модели попадают в кэш обычным путём, когда игра их запросит.
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png',
              './three.min.js', './GLTFLoader.js', './tracks.js'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      // по одному файлу: неудача с любым не должна отменять установку
      .then(c => Promise.all(CORE.map(u => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(r => {
        // в кэш кладём только удачные ответы: иначе сохранится страница ошибки
        if (r && r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
        return r;
      })
      .catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html')))
  );
});
