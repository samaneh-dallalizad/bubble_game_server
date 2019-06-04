const express=require("express")
const bodyParser = require('body-parser')
const app = express()
var cors = require('cors')
const authRouters = require('./auth/route')
const port = process.env.PORT || 4000

app
.use(bodyParser.json())
.use(cors())
.use(authRouters)
.listen(port, () => console.log(`Listening on port ${port}`))