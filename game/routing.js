const { Router } = require('express')
const gameRouter = new Router()

// gameRouter.post('/shoot', function(req, res){
// })

module.exports = function routing (dispatch, bubbles) {
  return gameRouter.post('/shoot', (request, response) => {
    const { angle } = request.body
    console.log('angle log:', bubbles)
    dispatch(angle)
    response.status(201).send(bubbles)
  })
}