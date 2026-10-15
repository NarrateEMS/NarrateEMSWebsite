// Keeps the /dictate shell usable with no signal. Only static assets and the
// page HTML are cached; API calls always go to the network.
const CACHE = "dictate-v1"
const SHELL = "/dictate"

const cacheShell = async (res) => {
  const cache = await caches.open(CACHE)
  await cache.put(SHELL, res.clone())
  const html = await res.text()
  const assets = [...new Set(html.match(/\/_next\/static\/[^"'\\\s)]+/g) || [])]
  await Promise.all(assets.map((a) => cache.add(a).catch(() => undefined)))
}

self.addEventListener("install", (event) => {
  event.waitUntil(fetch(SHELL).then(cacheShell))
  self.skipWaiting()
})

self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()))

self.addEventListener("fetch", (event) => {
  const req = event.request
  const url = new URL(req.url)
  if (req.method !== "GET" || url.origin !== location.origin) return

  if (req.mode === "navigate" && url.pathname === SHELL) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) event.waitUntil(cacheShell(res.clone()))
          return res
        })
        .catch(() => caches.match(SHELL)),
    )
  } else if (url.pathname.startsWith("/_next/static/")) {
    // shortcut: hashed assets accumulate across deploys; prune if the cache ever matters.
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone()
              event.waitUntil(caches.open(CACHE).then((c) => c.put(req, copy)))
            }
            return res
          }),
      ),
    )
  }
})
