import WebTorrentServiceWorker from './WebTorrentServiceWorker'
import registerServiceWorker from './registerServiceWorker'
import { nodeStreamToReadStream } from './river'
import { createMagnetUri } from './torrent'
import { toNodeBuffer } from './buffer'

const debug = console.log.bind(console, 'worker: ')

const magnetMatch = /(magnet:\?.*btih:.+)/i
const videoMatch = /\.mp4$/i
const allowRangeRequests = true

export default class ServiceWorker {

  webTorrentServiceWorkers = {}

  constructor() {
    registerServiceWorker(event => {
      const url = new URL(event.request.url).href
      const scope = self.registration.scope
      const rangeHeader = event.request.headers.get('range')
      const range = this.parseRange(rangeHeader)
      const clientId = event.clientId
      
      if (this.isVideoUrl(url)) {
        debug('Video request', { clientId, url, scope, range, rangeHeader })
        const resp = this.onFetchVideo(clientId, url, range, rangeHeader)
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

  getRangeResponse(video, range) {
    const stream = video.createReadStream()
    const fileLength = video.length
    const contentLength = fileLength - (range[0] || 0)
    const contentRange = (range[0] || '0') + '-' + (range[1] || fileLength - 1) + '/' + fileLength
    const headers = {
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=0',
      'Connection': 'keep-alive',
      'Content-Length': contentLength,
      'Content-Range': `bytes ${contentRange}`,
      'Content-Type': 'video/mp4',
      'X-Powered-By': 'Seedess',
    }
    const resp = new Response(stream, {
      headers
    })
    debug('range response', resp, headers)
    return resp
  }

  getFullResponse(video) {
    return  new Response(nodeStreamToReadStream(video.createReadStream()))
  }

  /**
   * Retrieves the largest file assuming it's the main video file
   * @param {array} files 
   */
  getVideofile(files) {
    return [ ...files.sort( (a, b) => a.length <= b.length) ].shift()
  }
  
  onFetchVideo(clientId, url, range, rangeHeader) {
    debug('onFetchVideo', { clientId, url, range })

    const isRangeRequest = rangeHeader
  
    return clients.get(clientId)
      .then(client => {
        return new Promise(async (resolve, reject) => {
          if (!this.webTorrentServiceWorkers[clientId]) {
            debug('Does not have service worker', { clientId, client })
            this.webTorrentServiceWorkers[clientId] = new WebTorrentServiceWorker(client)
          }
          const webTorrent =  this.webTorrentServiceWorkers[clientId]
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
        debug('get stream range', range)
        const resp = isRangeRequest && allowRangeRequests
          ? this.getRangeResponse(video, range) 
          : this.getFullResponse(video)
        debug('response', resp)
        return resp
      })
  }
  
}
