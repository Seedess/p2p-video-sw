export default function registerServiceWorker(cb) {
  self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting())
    console.log('SW installed', event)
  })

  self.addEventListener('activate', event => {
    console.log('SW activating')
    event.waitUntil(self.clients.claim())
    console.log('SW active', event)
  })

  self.addEventListener('fetch', event => {
    cb(event)
  })
}