import WebTorrentRemoteServer from './lib/WebTorrentServiceWorkerServer'

export default class Client {

  server = null

  constructor() {
    this.server = new WebTorrentRemoteServer()
  }

}
