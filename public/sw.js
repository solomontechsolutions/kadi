/* Mwaliko service worker.
 *
 * This version changes the caching strategy, not just the asset list. An
 * earlier version was cache-first
 * for every same-origin GET, which was fine when the whole site was four static
 * files -- but the app is now server-rendered, so cache-first would pin every
 * visitor to whatever HTML their browser happened to store first and they would
 * never see a deploy again. Door staff running the scanner as an installed PWA
 * would be stuck on the old build indefinitely.
 *
 * Strategy is now split by what the request actually is:
 *   - navigations  -> network-first, cache as offline fallback
 *   - static asset -> cache-first (hashed or versioned, safe to pin)
 *   - cross-origin -> never touched (Supabase REST)
 */
const CACHE = 'mwaliko-v1';

/* Only genuinely static things are precached. HTML is deliberately absent:
 * it is fetched fresh and merely *falls back* to cache when offline. */
const ASSETS = [
  '/manifest.json',
  '/icon.svg',
  '/vendor/jsQR.js',
  '/vendor/qrcode.min.js',
  '/vendor/supabase.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  // Navigations: always try the network so a deploy is visible immediately.
  // The cached copy exists purely so the scanner still opens at a venue with
  // no signal, which is the one place offline actually matters.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req).then(hit => hit || caches.match('/scanner.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(req, clone));
      return res;
    }).catch(() => cached))
  );
});
