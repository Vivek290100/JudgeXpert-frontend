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
  "/user/leaderboard"
];

// Install event: Precache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: Handle API and static requests
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Handle API requests
  if (
    requestUrl.pathname.startsWith("/problems") ||
    requestUrl.pathname.startsWith("/contests") ||
    requestUrl.pathname.startsWith("/leaderboard") ||
    requestUrl.pathname.startsWith("/subscriptions") ||
    requestUrl.pathname.startsWith("/discussions")
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          return new Response(JSON.stringify({ message: "Offline - Please reconnect to load data" }), {
            status: 503,
            headers: { "Content-Type": "application/json" }
          });
        });
      })
    );
  } else {
    // Handle non-API requests
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        }).catch(() => {
          return caches.match("/index.html");
        });
      })
    );
  }
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background Sync (for write operations like /execute)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-user-actions") {
    event.waitUntil(
      // Placeholder: Implement logic to retry queued actions
      console.log("Background sync triggered for user actions")
    );
  }
});