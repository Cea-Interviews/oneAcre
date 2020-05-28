const express = require('express')
const repayments = require('./controller')
const multer = require('multer')
const path = require('path')
const validation = require('./middleware')

const upload = multer({fileFilter: function(req, file, cb){
    let ext = path.extname(file.originalname);
    if(ext !== '.json' && ext !== '.xls' && ext !== '.xlsx') {
        return cb(new Error('Only JSON and Excel format accepted'))
    }
    cb(null, true)
}});

const router = express.Router()
router.get('/customers', repayments.getCustomers)
router.get('/customers/summary',  repayments.getCustomerSummary)
router.get('/seasons', repayments.getSeasons)
router.post('/mrepayments', upload.single('repayments'), repayments.multipleRepayments)
router.post('/repayments', repayments.uploadRepayments)
router.get('/repayments',repayments.getRepayments)
module.exports = router