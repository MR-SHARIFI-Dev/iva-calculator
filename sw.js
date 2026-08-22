const VERSION = '3.3.0';
const CACHE = `iva-calculator-v${VERSION}`;
const VERSION_QUERY = `app-version=${VERSION}`;
const OFFLINE_PAGE = `./index.html?${VERSION_QUERY}`;
const ASSETS = [
  `./?${VERSION_QUERY}`, OFFLINE_PAGE,
  `./src/style.css?v=${VERSION}`, `./src/app.js?v=${VERSION}`,
  `./src/parser.js?v=${VERSION}`, `./src/input.js?v=${VERSION}`,
  `./src/format.js?v=${VERSION}`,
  `./manifest.webmanifest?v=${VERSION}`, './assets/logo.svg', './assets/logo-dark.svg', './assets/favicon.svg'
];

self.addEventListener('install', (event) => {
  // Versioned URLs prevent an older worker from feeding stale files into this cache.
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();

    // Reload older open tabs once, making the running version visible in the URL and UI.
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await Promise.allSettled(windows.map((client) => {
      const url = new URL(client.url);
      if (url.origin !== self.location.origin || url.searchParams.get('app-version') === VERSION) return null;
      url.searchParams.set('app-version', VERSION);
      return client.navigate(url.href);
    }));
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;

  // Network-first prevents a deployed bug fix from being hidden by an old cache.
  event.respondWith(fetch(event.request).then((response) => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then((cache) => cache.put(event.request, copy)));
    }
    return response;
  }).catch(async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    if (event.request.mode === 'navigate') return caches.match(OFFLINE_PAGE);
    return Response.error();
  }));
});
