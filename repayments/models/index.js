const db = require("../../database/db");

class repaymentModel {
  static async getRepayments(RepaymentsID,CustomerID ) {
    if (RepaymentsID) {
      const result = await db
      .select('r.RepaymentsID', "c.CustomerName",'c.CustomerID' ,'s.SeasonID', "s.SeasonName", "r.Amount", "r.Date", 'r.ParentID' )
      .from("Repayments as r")
      .leftJoin("Customers as c", "c.CustomerID", "r.CustomerID")
      .leftJoin("Seasons as s", "s.SeasonID", "r.SeasonID")
      .where('r.RepaymentsID', RepaymentsID)
      return result;
    }
    if (CustomerID) {
      const result = await db
      .select('r.RepaymentsID', "c.CustomerName",'c.CustomerID' ,'s.SeasonID', "s.SeasonName", "r.Amount", "r.Date", 'r.ParentID' )
      .from("Repayments as r")
      .leftJoin("Customers as c", "c.CustomerID", "r.CustomerID")
      .leftJoin("Seasons as s", "s.SeasonID", "r.SeasonID")
      .where('r.CustomerID', CustomerID)
      return result;
    }
    if(RepaymentsID && CustomerID){
      const result = await db
      .select('r.RepaymentsID', "c.CustomerName", 's.SeasonID', "s.SeasonName", "r.Amount", "r.Date", 'r.ParentID' )
      .from("Repayments as r")
      .leftJoin("Customers as c", "c.CustomerID", "r.CustomerID")
      .leftJoin("Seasons as s", "s.SeasonID", "r.SeasonID")
      .where('r.RepaymentsID', RepaymentsID).andWhere('r.CustomerID', CustomerID)
      return result;
    }
    const query = await db
    .select('r.RepaymentsID', "c.CustomerName", 's.SeasonID', "s.SeasonName", "r.Amount", "r.Date", 'r.ParentID' )
    .from("Repayments as r")
    .leftJoin("Customers as c", "c.CustomerID", "r.CustomerID")
    .leftJoin("Seasons as s", "s.SeasonID", "r.SeasonID");
    return query;
  }
  static async updateParentID(ParentID, RepaymentsID){
    const  response = await db('Repayments').update({ParentID}, 'RepaymentsID').where({RepaymentsID})
    return this.getRepayments(response[0])
  }


  static async getCustomers(id) {
    if (id) {
      const result = await db("Customers").where("CustomerID", id).first();
      return result;
    }
    let query = db("Customers");
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
    console.log(CustomerID, SeasonID ,id)
    if(id){
        return await db
        .select("cr.CustomerName",'cr.CustomerID','s.SeasonName', 's.SeasonID', "cr.TotalCredit",'cr.TotalRepaid')
        .from("CustomerSummaries as cr") 
        .leftJoin("Customers as c", "c.CustomerID", "cr.CustomerID")
        .leftJoin("Seasons as s", "s.SeasonID", "cr.SeasonID")
        .where('cr.id', id);
    }
    if (CustomerID && SeasonID) {
      return await db
      .select("c.CustomerName",'cr.CustomerID','s.SeasonName', 's.SeasonID', "cr.TotalCredit",'cr.TotalRepaid')
      .from("CustomerSummaries as cr") 
      .leftJoin("Customers as c", "c.CustomerID", "cr.CustomerID")
      .leftJoin("Seasons as s", "s.SeasonID", "cr.SeasonID")
      .where('cr.CustomerID', CustomerID).andWhere('cr.SeasonID', SeasonID);
    }
    if (CustomerID) {
      return await db
      .select("c.CustomerName",'cr.CustomerID','s.SeasonName', 's.SeasonID', "cr.TotalCredit",'cr.TotalRepaid')
      .from("CustomerSummaries as cr") 
      .leftJoin("Customers as c", "c.CustomerID", "cr.CustomerID")
      .leftJoin("Seasons as s", "s.SeasonID", "cr.SeasonID")
      .where('cr.CustomerID', CustomerID);
    }
    if (SeasonID) {
      return await db
      .select("c.CustomerName",'cr.CustomerID','s.SeasonName', 's.SeasonID', "cr.TotalCredit",'cr.TotalRepaid')
      .from("CustomerSummaries as cr") 
      .leftJoin("Customers as c", "c.CustomerID", "cr.CustomerID")
      .leftJoin("Seasons as s", "s.SeasonID", "cr.SeasonID")
      .where('cr.SeasonID', SeasonID);
    }
    return await db
    .select("c.CustomerName",'cr.CustomerID','s.SeasonName', 's.SeasonID', "cr.TotalCredit",'cr.TotalRepaid')
    .from("CustomerSummaries as cr") 
    .leftJoin("Customers as c", "c.CustomerID", "cr.CustomerID")
    .leftJoin("Seasons as s", "s.SeasonID", "cr.SeasonID")
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
