/**
 * Stream Utilities to convert between WhatWG and Node Streams
 * @author gabe@seedess.com
 */

 /**
 * Create a new WhatWG readable stream and get a writer for it
 * @param {function} Callback function that returns the stream controller
 * @example
 * const readableStream = createReadableStream(writer => {
 *   writer.write('def')
 *   writer.close()
 * })
 * const reader = readableStream.getReader()
 * const data = await reader.read() // {value: "def", done: false}
 */
export function createReadableStream(cb) {
  return new ReadableStream({
    start(controller) {
      controller.write = controller.enqueue
      cb(controller)
    }
  })
}

/**
 * Read from a Node Stream
 * @param {Stream} Node stream 
 * @param {function} onData 
 * @param {function} onEnd 
 */
export function readFromNodeStream(stream, onData, onEnd) {
  function read() {
    stream.on('data', data => {
      onData(data);
    })
    stream.on('end', () => {
      onEnd && onEnd()
    })
  }
  read()
}

/**
 * Convert Node Readable Stream to WhatWG Stream
 * @todo support WritableStream
 * @param {Stream} Node stream 
 */
export function nodeStreamToReadStream(stream) {
  return new ReadableStream({
    start(controller) {
      push()
      function push() {
        stream.on('data', data => {
          controller.enqueue(data);
        })
        stream.on('end', () => {
          controller.close();
        })
      }
    },
    // Firefox excutes this on page stop, Chrome does not
    cancel(reason) {
      console.log('cancel()', reason);
      stream.destroy();
    }
  })
}

/**
 * Read from a WhatWG Stream
 * @param {Stream} WhatWG stream 
 * @param {function} onData 
 * @param {function} onEnd 
 * @param {function} onErr 
 */
export function readFromStream(stream, onData, onEnd, onErr) {
  return stream.getReader().read()
    .then(({done, value}) => {
      if (done) {
        onEnd && onEnd()
      }
      onData(value)
    })
    .catch(err => {
      onErr && onErr(err)
    })
}

