// From developers.google.com
var CACHE_NAME = 'beerdex-cache-v1';
var urlsToCache = [
  '/styles/main.css',
  '/styles/bulma.css',
  '/js/main.js',
  '/js/config.js',
  '/js/image.js'
];
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache)
            {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(res) {
        // Cache hit - return response
        if (res) {
          return res;
        }

        var fetchReq= event.request.clone();

        return fetch(fetchReq).then(
          function(res) {
            // Check if we received a valid response
            if(!res|| res.status !== 200 || res.type !== 'basic') {
              return res;
            }

            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});