import WebTorrentRemoteServer from './lib/window/WTRemoteServerInWindow'

// @todo allow send stream when Request.prototype.stream is defined
const serverOpts = { canSendStream: false }

export default class Client {

  server = null

  constructor() {
    this.server = new WebTorrentRemoteServer(serverOpts)
  }

}
