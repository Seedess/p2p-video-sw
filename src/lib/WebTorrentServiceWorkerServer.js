import WebTorrentRemoteServer from '../../modules/webtorrent-remote/server'

const debug = console.info.bind(console, 'server: ')

export default class WebTorrentServiceWorkerServer {

  port = null

  constructor(opts = {}) {
    navigator.serviceWorker.addEventListener('message', this.receiveMessageEvent)
    this.server = new WebTorrentRemoteServer(this.sendMessage, opts)
  }

  sendMessage = message => {
    debug('send message', message)
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