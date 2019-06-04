module.exports = function dispatcher (io) {
  return function dispatch (payload) {
    const action = {
      type: 'SHOOT',
      payload
    }

    io.emit('action', action)
  }
}