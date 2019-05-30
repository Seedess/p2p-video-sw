/**
 * Torrent utilities
 */
import parseTorrent from 'parse-torrent'
 /**
  * @param {string} Torrent Magnet, infoHash or .torrent file
  */
export function createMagnetUri(torrentId, torrentFileUrl, torrentHostUrl) {
  const torrent = parseTorrent(torrentId)

  // webseed needs at least one peer or .torrent file https://github.com/webtorrent/webtorrent/issues/875
  // ensure xs (.torrent file)
  torrent.xs = torrent.xs || torrentFileUrl || torrentHostUrl + 'torrent/' + torrent.infoHash + '.torrent'
  const magnetUriWithXS = parseTorrent.toMagnetURI( torrent )
  return magnetUriWithXS
}