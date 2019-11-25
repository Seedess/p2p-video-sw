import WTRemoteClientInServiceWorker from './WTRemoteClientInServiceWorker'
import registerServiceWorker from '../window/registerServiceWorker'
import { nodeStreamToReadStream } from '../river'
import { createMagnetUri } from '../torrent'
import { toNodeBuffer } from '../buffer'

const debug = console.log.bind(console, 'worker: ')

const magnetMatch = /^(magnet\:\?.*btih:.+)$/i
const seedessUrlMatch = /^https\:\/\/stream\.seedess\.com\//
const videoMatch = /\.mp4$/i
const allowRangeRequests = 1
const WTRemoteClientInServiceWorkerOpts = {
  updateInterval: 60000, 
  canSendStream: false 
}

export default class ServiceWorker {

  WTRemoteClientList = {}

  getWTRemoteClient(client) {
    const clientId = client.id
    if (!this.WTRemoteClientList[clientId]) {
      debug('Does not have service worker', { clientId, client })
      const opts = { ...WTRemoteClientInServiceWorkerOpts, clientKey: clientId }
      this.WTRemoteClientList[clientId] = new WTRemoteClientInServiceWorker(client, opts)
    }
    return this.WTRemoteClientList[clientId]
  }

  constructor() {
    registerServiceWorker(event => {
      const url = new URL(event.request.url).href
      const scope = self.registration.scope
      const rangeHeader = event.request.headers.get('range')
      const range = this.parseRange(rangeHeader)
      const clientId = event.clientId
      debug('body', event.request.body)
      
      if (this.isVideoUrl(url)) {
        debug('Video request', { clientId, url, scope, range, rangeHeader })
        const resp = this.onFetchVideo(clientId, url, range, rangeHeader)
        event.respondWith(resp)
      } else {
        //debug('Not video request', { url })
      }

      if (this.isSeedessVideoStreamUrl(url)) {
        this.onFetchSeedessVideoStream(event)
      }
    })
  }

  isMagnet(identifer) {
    return magnetMatch.test(identifer)
  }

  isSeedessVideoStreamUrl(url) {
    return seedessUrlMatch.test(url)
  }

  async onFetchSeedessVideoStream(event) {
    const { headers } = event.request
    const clientKey = headers.get('x-seedess-clientKey')
    const message = {
      clientKey,
      torrentKey: headers.get('x-seedess-torrentKey'),
      fileKey: headers.get('x-seedess-fileKey'),
      type: headers.get('x-seedess-type'),
      streamKey: headers.get('x-seedess-streamKey'),
      stream: event.request.body,
    }

    // @todo Request.prototype.stream does not implement ReadableStream yet
    // currently only available with experimental flag in chrome
    // safari has a a Request.prototype.body but cannot use a ReadableStream in new Request()
    if (!event.request.body || !(event.request.body instanceof ReadableStream)) {
      throw new Error('Request.prototype.body is unsupported in this browser')
    }
    debug('seedess stream url', event, { message, clientKey })
    this.WTRemoteClientList[clientKey].receiveStream(message)
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
    const start = parseInt(range.start || 0, 10)
    const end = parseInt(range.end || video.length - 1, 10)
    const nodeStream = video.createReadStream({ start, end })
    const stream = nodeStreamToReadStream(nodeStream)
    const fileLength = video.length
    const contentLength = stream.length
    const contentRange = start + '-' + end + '/' + fileLength
    const headers = {
      'Accept-Ranges': 'bytes',
      //'Content-Length': contentLength,
      //'Content-Range': `bytes ${contentRange}`,
      'Content-Type': 'video/mp4',
      'X-Powered-By': 'Seedess',
    }
    const streams = stream.tee()
    const resp = new Response(streams.pop(), { headers })
    debug('range response', { resp, headers, range, stream, nodeStream })
    global.readableStreams = [ ...(global.readableStreams || []),  streams.pop()]
    return resp
  }

  getFullResponse(video) {
    const nodeStream = video.createReadStream()
    const stream = nodeStreamToReadStream(nodeStream)
    const headers = {
      'Accept-Ranges': 'bytes',
      'Content-Length': video.length,
      'Content-Type': 'video/mp4',
      'X-Powered-By': 'Seedess',
    }
    const resp =  new Response(stream, { headers })
    debug('full response', { resp, headers, stream, nodeStream })
    return resp
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
          const webTorrent =  this.getWTRemoteClient(client)
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
