// service-worker.js

// Install event: Cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('static-assets-v1.0.1').then((cache) => {
            return cache.addAll([
                '/wordle-scores/index.html',
                '/wordle-scores/app.js',
                '/wordle-scores/style.css',
                // Add any other assets you want to cache
            ]);
        })
    );
});

// Fetch event: Serve cached assets or fetch from the network
self.addEventListener('fetch', (event) => {
    // Don't intercept Firebase API calls
    if (event.request.url.includes('firestore.googleapis.com')) { console.log("service tried fetching firstore"); return };

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Serve from cache if available, else fetch from network
            return cachedResponse || fetch(event.request);
        })
    );
});

// Activate event: Update cache on new service worker activation
self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['static-assets-v1.0.1']; // List of caches to keep
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName); // Clean up old caches
                    }
                })
            );
        })
    );
});
