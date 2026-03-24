const CACHE_VERSION = "sms-repurposer-v1";
const CACHE_NAME = `sms-repurposer-${CACHE_VERSION}`;

// Pre-cache what Chrome may request immediately for installation/UI.
// Keeping this small prevents install failures due to missing assets.
const SHELL_ASSETS = ["/", "/manifest.webmanifest", "/next.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_NAME)
            .map((k) => caches.delete(k))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET requests.
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Stay same-origin (best-effort) to avoid caching third-party content.
  if (url.origin !== self.location.origin) return;

  const accept = req.headers.get("accept") || "";
  const isNavigation =
    req.mode === "navigate" ||
    accept.includes("text/html") ||
    req.headers.get("sec-fetch-dest") === "document";

  const isStaticAsset =
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/fonts/") ||
    url.pathname === "/favicon.ico" ||
    /\\.(css|js|mjs|cjs|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)$/.test(
      url.pathname
    );

  function cacheResponse(cache, request, res) {
    if (!res || !res.ok) return;
    // Avoid caching opaque responses.
    if (res.type === "opaque") return;
    cache.put(request, res);
  }

  // Offline-friendly strategy:
  // - HTML navigations: network-first, fallback to cached shell
  // - Static assets: cache-first
  event.respondWith(
    isNavigation
      ? fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cacheResponse(cache, req, copy);
              // Also store the shell for an offline fallback.
              if (url.pathname === "/") cacheResponse(cache, "/", res.clone());
            });
            return res;
          })
          .catch(() => caches.match(req).then((cached) => cached || caches.match("/")))
      : isStaticAsset
      ? caches.match(req).then((cached) => {
          if (cached) return cached;
          return fetch(req)
            .then((res) => {
              const copy = res.clone();
              caches.open(CACHE_NAME).then((cache) => cacheResponse(cache, req, copy));
              return res;
            })
            .catch(() => caches.match(req).then((cached2) => cached2 || caches.match("/")));
        })
      : caches.match(req).then((cached) => {
          if (cached) return cached;
          return fetch(req)
            .then((res) => {
              // For non-static resources, keep caching conservative.
              const contentType = res.headers.get("content-type") || "";
              if (res.ok && contentType.includes("text")) {
                const copy = res.clone();
                caches.open(CACHE_NAME).then((cache) => cacheResponse(cache, req, copy));
              }
              return res;
            })
            .catch(() => caches.match(req).then((cached2) => cached2 || caches.match("/")));
        })
  );
});

