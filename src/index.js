import installServiceWorker from './lib/window/installServiceWorker'
import Client from './client'

installServiceWorker('sw.bundle.js')
new Client()
