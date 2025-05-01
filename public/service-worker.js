const CACHE_NAME = "judgexpert-pwa-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/assets/code.svg",
  "/assets/icons/icon-192x192.png",
  "/assets/icons/icon-512x512.png",
  "/assets/screenshots/desktop-screenshot.png",
  "/assets/screenshots/mobile-screenshot.png",
  "/user/problems",
  "/user/contests",
  "/user/leaderboard",
];

// Install: Pre-cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch: Network-first for API, Cache-first for static
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  const isApiRequest = [
    "/problems",
    "/contests",
    "/leaderboard",
    "/subscriptions",
    "/discussions",
  ].some((path) => requestUrl.pathname.startsWith(path));

  if (isApiRequest) {
    // Network-first strategy for dynamic API
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Clone the response immediately
          const responseToCache = networkResponse.clone();
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() =>
          caches.match(event.request).then((cached) => {
            return (
              cached ||
              new Response(
                JSON.stringify({ message: "Offline - Please reconnect to load data" }),
                {
                  status: 503,
                  headers: { "Content-Type": "application/json" },
                }
              )
            );
          })
        )
    );
  } else {
    // Cache-first strategy for static files
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request)
            .then((networkResponse) => {
              // Clone the response immediately
              const responseToCache = networkResponse.clone();
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              }
              return networkResponse;
            })
            .catch(() => caches.match("/index.html"))
        );
      })
    );
  }
});

// Activate: Clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

// Background Sync (for write operations like /execute)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-user-actions") {
    event.waitUntil(
      console.log("Background sync triggered for user actions")
    );
  }
});