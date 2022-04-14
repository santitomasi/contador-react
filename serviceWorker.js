const CACHE_ELEMENTS = [
    "./",
    "https://unpkg.com/react@18/umd/react.production.min.js",
    "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
    "https://unpkg.com/@babel/standalone/babel.min.js",
    "./style.css",
    "./components/Contador.js"
];

const CACHE_NAME = "v3_cache_contador";

self.addEventListener(
    "install", 
    (e) => {
        e.waitUntil(
            caches.open(CACHE_NAME).then(cache => {
                cache.addAll(CACHE_ELEMENTS).then(() => {
                    self.skipWaiting()
                }).catch(console.log);
            })
        )
    });

self.addEventListener(
    "activate", 
    (e) => {
        const cacheWaitList = [CACHE_NAME];
        e.waitUntil(
            caches
                .keys()
                .then((cacheNames) => {
                    return Promise.all(cacheNames.map(cacheName => {
                        return (cacheWaitList.indexOf(cacheName) === -1 && caches.delete(cacheName))
                }))
                })
                .then(() => self.clients.claim())
        )
    });


self.addEventListener(
    "fetch", 
    (e) => {
        e.respondWith(
            caches.match(e.request).then( (res) => {
                if(res) {
                    return res;
                }
                return fetch(e.request);
            })
        )
    });