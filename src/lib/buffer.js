/**
 * Node Buffer, Browser ArrayBuffer utils
 */

export function toNodeBuffer(arrayBuffer) {
  return Buffer.from(arrayBuffer)
}