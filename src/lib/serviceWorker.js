import WebTorrentServiceWorker from './WebTorrentServiceWorker'
import registerServiceWorker from './registerServiceWorker'
import { nodeStreamToReadStream } from './river'
import { createMagnetUri } from './torrent'
import { toNodeBuffer } from './buffer'

const debug = console.log.bind(console, 'worker: ')

const magnetMatch = /(magnet:\?.*btih:.+)/i
const videoMatch = /\.mp4$/i

export default class ServiceWorker {

  constructor() {
    registerServiceWorker(event => {
      const url = new URL(event.request.url).href
      const scope = self.registration.scope
      const range = this.parseRange(event.request.headers.get('range'))
      const clientId = event.clientId
      
      if (this.isVideoUrl(url)) {
        debug('Video request', { clientId, url, scope, range })
        const resp = this.onFetchVideo(clientId, url)
        event.respondWith(resp)
      } else {
        //debug('Not video request', { url })
      }
    })
  }

  isVideoUrl(url) {
    return url.match(videoMatch)
  }

  async getMagnet(url) {
    const torrentUrl = 'http://localhost:8080/torrent/small.mp4.torrent'
    const torrentAb = await fetch(torrentUrl).then(resp => resp.arrayBuffer())
    return createMagnetUri(toNodeBuffer(torrentAb), torrentUrl) + '&ws=' + url + '?no-p2p' // magnet
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
    return [ ...files.sort( (a, b) => a.length <= b.length) ].shift()
  }
  
  onFetchVideo(clientId, url) {
    debug('onFetchVideo', { clientId, url })
  
    return clients.get(clientId)
      .then(client => {
        return new Promise(async (resolve, reject) => {
          const webTorrent = new WebTorrentServiceWorker(client)
          const torrentId = await this.getMagnet(url)
          debug('onFetchVideo add torrent', { torrentId })
          webTorrent.webTorrentRemoteClient.add(torrentId, (error, torrent) => {
            if (error) {
              return reject(error)
            }
            const webseedURL = url + '?no-p2p'
            debug('adding web seed', webseedURL)
            torrent.addWebSeed(url)
            torrent.on('metadata', () => {
              const video = this.getVideofile(torrent.files)
              debug('torrent metadata', { infoHash: torrent.infoHash, video })
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
