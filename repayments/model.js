const db  = require('../database/db')

class repaymentModel {
    static async getCustomer(){
        return db.select(
            'c.CustomerName',
            's.SeasonName',
            'r.Amount',
            ''
        )
    }
}