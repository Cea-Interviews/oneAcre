const {config} = require('dotenv')
config()

module.exports = ({
    port: process.env.PORT,
    devDb: process.env.URL
})