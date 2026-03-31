self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("mscorp-cache").then((cache) => {
            return cache.addAll([
                "https://mahavirsinhsodha.github.io/",
                "https://mahavirsinhsodha.github.io/index.html",
                "https://mahavirsinhsodha.github.io/manifest.json",
                "https://mahavirsinhsodha.github.io/192pxMS.png",
                "https://mahavirsinhsodha.github.io/512pxMS.png",
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
