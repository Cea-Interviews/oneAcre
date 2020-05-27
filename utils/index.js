const secrets = require('./secrets');
const truncateDb = require('./truncatedb')
const repayments = require('./repayment')
const mapper = require('./mapper')

module.exports = ({
    secrets,
    truncateDb,
    repayments,
    mapper
})