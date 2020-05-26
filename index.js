const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const util = require('./utils')
const server = express()
const port = util.secrets.port
server.use(cors())
server.use(helmet())
server.use(express.json())

server.get('/', (req, res) => {
    return res.json({message : 'Api is up'})
})
server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
module.exports = server;