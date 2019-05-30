import WebTorrentServiceWorker from './WebTorrentServiceWorker'
import registerServiceWorker from './registerServiceWorker'
import { nodeStreamToReadStream } from './river'
import { createMagnetUri } from './torrent'
import { toNodeBuffer } from './buffer'

const debug = console.log.bind(console, 'worker: ')

const magnetMatch = /(magnet:\?.*btih:.+)/i

export default class ServiceWorker {

  constructor() {
    registerServiceWorker(async event => {
      const url = new URL(event.request.url).href
      const scope = self.registration.scope
      const range = this.parseRange(event.request.headers.get('range'))
      const magnet = await this.getMagnet(url)
      const clientId = event.clientId
      
      if (magnet) {
        debug('Magnetic request', { clientId, url, magnet, scope, range })
        const resp = this.onFetchTorrent(clientId, url, magnet)
        event.respondWith(resp)
      } else {
        //debug('Not magnetic request', { url })
      }
    })
  }

  async getMagnet(url) {
    const match = url.match(magnetMatch)
    if (match) {
      //const magnet = match[0]
      const torrentUrl = 'http://localhost:8080/torrent/small.mp4.torrent'
      const torrentAb = await fetch(torrentUrl).then(resp => resp.arrayBuffer())
      debug('torrentAb', torrentAb)
      return createMagnetUri(toNodeBuffer(torrentAb), torrentUrl) // magnet
    }
  }

  parseRange(header) {
    if (!header) return null
    const [, start, end] = header.match(/bytes=([\d]+)-([\d]+)?/i)
    if (!start) return null
    return {
      start,
      end,
    }
  }

  /**
   * Retrieves the largest file assuming it's the main video file
   * @param {array} files 
   */
  getVideofile(files) {
    return files.sort( (a, b) => a.length <= b.length).shift()
  }
  
  onFetchTorrent(clientId, url, torrentId) {

    debug('onFetchTorrent', { clientId, url, torrentId })
  
    return clients.get(clientId)
      .then(client => {
        return new Promise((resolve, reject) => {
          const webTorrent = new WebTorrentServiceWorker(client)
          webTorrent.webTorrentRemoteClient.add(torrentId, (error, torrent) => {
            if (error) {
              return reject(error)
            }
            debug('adding web seed', url)
            //torrent.addWebSeed(url)
            torrent.on('metadata', () => {
              const video = this.getVideofile(torrent.files)
              resolve(video)
            })
          })
        })
      })
      .then(video => {
        const stream = nodeStreamToReadStream(video.createReadStream())
        debug('stream', stream)
        return stream
      })
      .then(stream => {
        const resp = new Response(stream)
        debug('response', resp)
        return resp
      })
  }
  
}
