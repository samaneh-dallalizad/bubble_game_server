const express=require("express")
const socketIo = require('socket.io')
const bodyParser = require('body-parser')
const app = express()
var cors = require('cors')
const authRouters = require('./auth/route')
const port = process.env.PORT || 4000

app
.use(bodyParser.json())
.use(cors())
.use(authRouters)

const server = app.listen(port, () => console.log(`Listening on port ${port}`))
const io = socketIo.listen(server)

io.on('connection', client => {
  console.log('client.id test: ', client.id)

  client.on('disconnect', () => {
    console.log('disconnect test:', client.id)
  })
})
