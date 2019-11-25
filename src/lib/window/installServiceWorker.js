const debug = console.log.bind(console, 'sw:install: ')

const installServiceWorker = path => {
  if (navigator.serviceWorker && window.fetch && window.ReadableStream) {
    return navigator.serviceWorker.register(path, {
      useCache: false
    })
      .then(reg => {
        // updatefound is fired if service-worker.js changes.
        reg.onupdatefound = function() {
          var installingWorker = reg.installing
          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  debug('New or updated content is available.')
                } else {
                  debug('Content is now available offline!')
                }
                break
              case 'redundant':
                debug('The installing service worker became redundant.')
                break
            }
          }
        }
      })
      .catch(error => {
        debug('Failed to install service worker', error)
      })
  } else {
    debug('Service Worker, Fetch, or ReadableStream API is not supported.')
  }
}

export default installServiceWorker
