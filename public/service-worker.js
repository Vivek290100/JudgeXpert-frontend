const CACHE_NAME = "judgexpert-pwa-cache-v2"; // Increment for new deployments
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

// Install: Cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching core assets...");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate: Delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

// Fetch: API = network-first, Static = stale-while-revalidate
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
    // Network-first for API
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
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
    // Stale-while-revalidate for static assets
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
            return networkResponse;
          })
          .catch(() => null); // suppress fetch errors
        return cachedResponse || fetchPromise;
      })
    );
  }
});

// Background Sync placeholder
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-user-actions") {
    event.waitUntil(
      console.log("Service Worker: Background sync triggered for user actions")
    );
  }
});

// Manual cache clear via postMessage
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLEAR_CACHE") {
    caches.delete(CACHE_NAME).then(() => {
      console.log("Service Worker: Cache cleared on request");
    });
  }
});
