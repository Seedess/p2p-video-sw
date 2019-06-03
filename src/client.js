import WebTorrentRemoteServer from './lib/WTRemoteServerInWindow'

export default class Client {

  server = null

  constructor() {
    this.server = new WebTorrentRemoteServer()
  }

}
