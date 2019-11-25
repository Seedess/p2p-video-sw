import WebTorrentRemoteClient from '../../../modules/webtorrent-remote/client'

const debug = console.info.bind(console, 'client: ')

/**
 * Runs in the service worker scope and posts messages to webtorrent remote server in browser scope
 */
export default class WebTorrentRemoteClientInServiceWorker {

  webTorrentRemoteClient = null
  webWorkerClient = null
  messageChannel = null
  clientDisconnected = false

  constructor(webWorkerClient, opts = {}) {
    debug('creating new webtorrent service worker', webWorkerClient)
    const clientKey = webWorkerClient.id
    this.webWorkerClient = webWorkerClient
    this.webTorrentRemoteClient = new WebTorrentRemoteClient(this.sendMessage, { clientKey, ...opts })
  }

  createMessageChannel(cb) {
    this.messageChannel = new MessageChannel()
    this.messageChannel.port1.onmessage = function(event) {
        cb(event)
    }
  }

  receiveStream = message => {
    debug('received stream message', message)
    this.webTorrentRemoteClient.receiveStream(message)
  }

  sendMessage = message => {
    debug('sending message', message)
    this.createMessageChannel(this.receiveMessageEvent)
    if (this.webWorkerClient) {
      this.webWorkerClient.postMessage(this._serialize(message), [this.messageChannel.port2])
    } else {
      this.clientDisconnected = true
    }
  }
  
  receiveMessageEvent = event => {
    debug('received message', { ...event.data })
    this.webTorrentRemoteClient.receive(this._unserialize(event.data))
  }

  _serialize(data) {
    return Object.assign({}, data)
  }

  _unserialize(data) {
    return Object.assign({}, data)
  }

}