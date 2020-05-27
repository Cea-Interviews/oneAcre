const db = require('../database/db')

const tablesList = ['CustomerSummaries','Repayments',  'Seasons', 'Customers'  ]
const clearData = async(req, res) => {
    try{
  const {table} = req.query
  if(table !== 'all'){
      await db(table).del()
      return res.status(200).json({
        status:200,
          message: `Data in ${table} cleared`
      })
      
  }
  if(table === 'all') {
    tablesList.forEach(async name => await db(name).del())
    return res.status(200).json({
        status:200,
        message: 'Data in all tables cleared'
    })
  }
  return res.status(404).json({
      status:400,
      message: 'Table Not Found'

  })
}
catch(err) {
    res.status(500).json({
        status:500,
        error: err.toString()
    })
}
  
}


module.exports = clearData