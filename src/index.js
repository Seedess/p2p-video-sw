import installServiceWorker from './lib/installServiceWorker'
import Client from './client'

installServiceWorker('sw.bundle.js?' + Math.random())
new Client()
