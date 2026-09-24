/* maunonton app-shell worker: private data is deliberately never cached. */
const CACHE_NAME = "maunonton-shell-v1";
const APP_SHELL = ["/offline.html", "/manifest.webmanifest", "/pwa/icon-180", "/pwa/icon-192", "/pwa/icon-512"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Never intercept API calls, Storage, user media, or journal pages.
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/journals/") || url.pathname.startsWith("/storage/")) return;
  if (!APP_SHELL.includes(url.pathname)) return;
  event.respondWith(caches.match(request).then((cached) => cached ?? fetch(request)));
});
