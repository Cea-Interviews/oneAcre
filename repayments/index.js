const express = require('express')
const repayments = require('./controller')

const router = express.Router()

router.get('/customers', repayments.getCustomers)
router.get('/customers/summary', repayments.getCustomerSummary)
router.get('/seasons', repayments.getSeasons)
router.post('/repayments', repayments.uploadRepayments)
module.exports = router