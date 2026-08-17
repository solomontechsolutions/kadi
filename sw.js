const CACHE = 'wedding-checkin-v3';
const ASSETS = ['index.html', 'invite.html', 'scanner.html', 'guestbook.html', 'manifest.json', 'icon.svg', 'vendor/jsQR.js', 'vendor/qrcode.min.js', 'vendor/supabase.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  // Only cache same-origin requests. Cross-origin GETs (Supabase's REST API,
  // Google Fonts) must always hit the network -- caching the guestbook's
  // message list here would mean visitors keep seeing a stale snapshot of
  // messages forever instead of the current ones.
  if(new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const resClone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, resClone));
      return res;
    }).catch(() => cached))
  );
});
