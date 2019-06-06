module.exports = function dispatcherPlayers (io) {
  return function dispatch (payload) {
    const action = {
      type: 'ADD_PLAYERS',
      payload
    }

    io.emit('action', action)
  }
}