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
                  console.log('New or updated content is available.')
                } else {
                  console.log('Content is now available offline!')
                }
                break
              case 'redundant':
                console.info('The installing service worker became redundant.')
                break
            }
          }
        }
      })
      .catch(error => {
        console.error('Failed to install service worker', error)
      })
  } else {
    console.error('Service Worker, Fetch, or ReadableStream API is not supported.')
  }
}

export default installServiceWorker
