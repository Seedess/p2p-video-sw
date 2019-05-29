export default function registerServiceWorker(cb) {
  self.addEventListener('install', event => {
    self.skipWaiting()
    console.log('SW installed', event)
  })

  self.addEventListener('activate', event => {
    console.log('SW activating')
    self.clients.claim()
    console.log('SW active', event)
  })

  self.addEventListener('fetch', event => {
    cb(event)
  })
}