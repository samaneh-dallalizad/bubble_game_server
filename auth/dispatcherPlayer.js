module.exports = function dispatcherPlayer (io) {
  return function dispatch (payload) {
    const action = {
      type: 'ADD_PLAYER',
      payload
    }

    io.emit('action', action)
  }
}