const db = require("../../database/db");

class repaymentModel {
  static async getRepayments(id) {
    const query = await db
      .select('r.RepaymentsID', "c.CustomerName", 's.SeasonID', "s.SeasonName", "r.Amount", "r.Date", 'r.ParentID' )
      .from("Repayments as r")
      .leftJoin("Customers as c", "c.CustomerID", "r.CustomerID")
      .leftJoin("Seasons as s", "s.SeasonID", "r.SeasonID");
    if (id) {
      const result = await db
      .select('r.RepaymentsID', "c.CustomerName", 's.SeasonID', "s.SeasonName", "r.Amount", "r.Date", 'r.ParentID' )
      .from("Repayments as r")
      .leftJoin("Customers as c", "c.CustomerID", "r.CustomerID")
      .leftJoin("Seasons as s", "s.SeasonID", "r.SeasonID").where("RepaymentsID", id).first();
      return result;
    }
    return query;
  }
  static async updateParentID(ParentID, RepaymentsID){
    const  response = await db('Repayments').update({ParentID}, 'RepaymentsID').where({RepaymentsID})
    return this.getRepayments(response[0])
  }


  static async getCustomers(id) {
    let query = db("Customers");
    if (id) {
      const result = await db("Customers").where("CustomerID", id).first();
      return result;
    }
    return query;
  }
  static async getSeasons(id) {
    const query = db("Seasons");
    if (id) {
      const result = await db("Seasons").where("SeasonID", id);
     
      return result;
    }
    return query
  }
  static async uploadPayments(upload) {
    const ids = await db("Repayments").insert(upload, 'RepaymentsID');
    return this.updateParentID(ids[0], ids[0]);
  }
  static async getCustomerSummaries(CustomerID, SeasonID ,id) {
    const query = db("CustomerSummaries");
    if(id){
        return await db("CustomerSummaries").where({ id });
    }
    if (CustomerID && SeasonID) {
      return await db("CustomerSummaries").where({ CustomerID, SeasonID });
    }
    if (CustomerID) {
      return await db("CustomerSummaries").where({ CustomerID });
    }
    if (SeasonID) {
      return await db("CustomerSummaries").where({ SeasonID });
    }
    return query;
  }
  static async outstandingCredit(CustomerID){
     const response = await db('CustomerSummaries').orderBy('SeasonID')
     return response.filter(Summary=> Summary.CustomerID === CustomerID && Number(Summary.TotalCredit) > Number(Summary.TotalRepaid)
     )
  }
  static async updateCustomerSummaries(TotalRepaid,id){
      const  response = await db('CustomerSummaries').update({TotalRepaid}, ['id', 'CustomerID']).where({id})
     const ids = response[0].id
      return this.getCustomerSummaries('','', ids)

  }
}

module.exports = repaymentModel;
