module.exports = function dispatcherEndgame (io) {
  return function dispatch (payload) {
    const action = {
      type: 'RESET-DATABASE',
      payload
    }

    io.emit('action', action)
  }
}