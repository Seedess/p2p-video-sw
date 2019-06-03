import WebTorrentRemoteServer from '../../modules/webtorrent-remote/server'
import { nodeStreamToReadStream } from './river'

const debug = console.info.bind(console, 'server: ')

/**
 * Runs in the browser window scope and posts messages to the service worker scope
 */
export default class WebTorrentServiceWorkerServer {

  port = null

  constructor(opts = { canSendStream: true }) {
    navigator.serviceWorker.addEventListener('message', this.receiveMessageEvent)
    this.server = new WebTorrentRemoteServer(this.sendMessage, opts)
  }

  /**
   * Receives a readable stream and sends to service worker
   * @todo explore support further
   */
  sendStream = message => {
    debug('send stream', message)
    fetch('https://stream.seedess.com/' + message.streamKey, {
      method: "POST",
      body: nodeStreamToReadStream(message.stream),
      headers: {
        'x-seedess-clientKey': message.clientKey,
        'x-seedess-torrentKey': message.torrentKey,
        'x-seedess-fileKey': message.fileKey,
        'x-seedess-type': 'file-stream-stream',
        'x-seedess-streamKey': message.streamKey,
      }
    })
  }

  /**
   * Receives messages and copies them to service worker
   */
  sendMessage = message => {
    debug('send message', message)
    if (message.type === 'file-stream-stream') {
      return this.sendStream(message)
    }
    this.port.postMessage(this._serialize(message))
  }

  receiveMessageEvent = event => {
    debug('receive message', { ...event.data })
    this.port = event.ports[0]
    this.server.receive(this._unserialize(event.data))
  }

  _serialize(data) {
    return Object.assign({}, data)
  }

  _unserialize(data) {
    return Object.assign({}, data)
  }

}