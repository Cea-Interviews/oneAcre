const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const util = require('./utils')
const multer = require('multer')
const server = express()

const port = util.secrets.port
const router = require('./repayments')
server.use(cors())
server.use(helmet())
server.use(express.json())
server.use('/api', router)

server.get('/', (req, res) => {
    return res.json({message : 'Api is up'})
})



server.get('/resetdb', (req, res) => util.truncateDb(req, res))

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
module.exports = server;