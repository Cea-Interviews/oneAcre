const server = require('./api');
const utils = require('./utils');

const port = utils.secrets.port

server.listen(port , () => {
    console.log(`Server listening to ${port}`)
})