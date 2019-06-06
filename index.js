const express=require("express")
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app);
const socketIo = require('socket.io')(http)
const cors = require('cors')
const dispatcherPlayer = require('./auth/dispatcherPlayer')
const dispatcherPlayers = require('./auth/dispatcherPlayers')
const {router, addPlayer, addPlayers} = require('./auth/route')
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
const playersRouter = addPlayers(dispatchPlayers, gameDummyDatabase)

// gameRouter
const dispatch = dispatcher(io)
const gameRouter = routing(dispatch, gameDummyDatabase)
app.use(gameRouter, playerRouter, playersRouter, router)

io.on('connection', client => {
  console.log('client.id test: ', client.id)

  dispatch(gameDummyDatabase)

  client.on('disconnect', () => {
    console.log('disconnect test:', client.id)
  })
})
