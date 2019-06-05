const express=require("express")
const socketIo = require('socket.io')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const authRouters = require('./auth/route')
const dispatcher = require('./game/dispatcher')
const routing = require('./game/routing')
const gameDummyDatabase = require('./game/gameDummyDatabase')
const port = process.env.PORT || 4000

app
.use(bodyParser.json())
.use(cors())
.use(authRouters)

const server = app.listen(port, () => console.log(`Listening on port ${port}`))
const io = socketIo.listen(server)

// gameRouter
const dispatch = dispatcher(io)
const router = routing(dispatch, gameDummyDatabase)
app.use(router)

io.on('connection', client => {
  console.log('client.id test: ', client.id)

  dispatch(gameDummyDatabase)

  client.on('disconnect', () => {
    console.log('disconnect test:', client.id)
  })
})
