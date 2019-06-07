const express=require("express")
const socketIo = require('socket.io')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const dispatcherPlayer = require('./auth/dispatcherPlayer')
const dispatcherPlayers = require('./auth/dispatcherPlayers')
const dispatcherEndgame = require('./auth/dispatcherEndgame')
const {router, addPlayer, resetDatabase ,pushPlayers} = require('./auth/route')
const dispatcher = require('./game/dispatcher')
const routing = require('./game/routing')
const gameDummyDatabase = require('./game/gameDummyDatabase')
const port = process.env.PORT || 4000

app
.use(bodyParser.json())
.use(cors())

const server = app.listen(port, () => console.log(`Listening on port ${port}`))
const io = socketIo.listen(server)

// authRouter
const dispatchPlayer = dispatcherPlayer(io)
const playerRouter = addPlayer(dispatchPlayer, gameDummyDatabase)

const dispatchPlayers = dispatcherPlayers(io)
const playersRouter = pushPlayers(dispatchPlayers, gameDummyDatabase)

const dispatchEndgame = dispatcherEndgame(io)
const endgameRouter = resetDatabase(dispatchEndgame)

// gameRouter
const dispatch = dispatcher(io)
const gameRouter = routing(dispatch, gameDummyDatabase)
app.use(gameRouter, playerRouter, playersRouter, endgameRouter, router)

io.on('connection', client => {
  console.log('client.id test: ', client.id)

  dispatch(gameDummyDatabase)

  client.on('disconnect', () => {
    console.log('disconnect test:', client.id)
  })
})
