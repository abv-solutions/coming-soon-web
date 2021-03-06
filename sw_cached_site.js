const cacheName = 'v2';
// Call Install Event
self.addEventListener('install', e => {
  console.log('Service Worker: Installed');
});
// Call Activate Event
self.addEventListener('activate', e => {
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(cacheNames.map(cache => {
        if (cache !== cacheName) {
          return caches.delete(cache);
        }
      }));
    })
  );
});
// Call Fetch Event
self.addEventListener('fetch', e => {
  console.log('Service Worker: Fetching');
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Make copy/clone of response
        const resClone = res.clone();
        // Open cache
        caches
          .open(cacheName)
          // Add response to cache
          .then(cache => cache.put(e.request, resClone));
        return res;
      })
      .catch(() =>
        caches
          .match(e.request)
          .then(res => res))
  );
});
