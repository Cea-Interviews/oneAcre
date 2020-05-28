const db = require("../database/db");
const model = require("../repayments/models");
const mapper = require("./mapper");
const overpaid = async (CustomerID, date, Amount) => {
  // get client most recent season
  const response = await db
    .select("s.SeasonID", "s.StartDate", "c.id", "c.TotalRepaid")
    .from("CustomerSummaries as c")
    .join("Seasons as s", "s.SeasonID", "c.SeasonID")
    .where("c.CustomerID", CustomerID)
    .orderBy("s.StartDate", "desc");
  // then get the seasonID for that season
  const SeasonID = response[0].SeasonID;
  const { id } = response[0];
  let totalRepaid = Number(response[0].TotalRepaid);
  totalRepaid += Number(Amount);
  const upload = { CustomerID, SeasonID, Date: date, Amount };
  const repaymentRecord = await model.uploadPayments(upload);
  const CustomerSummary = await model.updateCustomerSummaries(totalRepaid, id);
  return {
    repaymentRecord: {
      ...repaymentRecord,
      Amount: Number(repaymentRecord.Amount),
      Date: new Date(repaymentRecord.Date).toLocaleDateString(),
    },
    CustomerSummary: mapper.toNumber(CustomerSummary)[0],
  };

  // create repayment record for only that season
};
const override = async (CustomerID, SeasonID, date, Amount) => {
  const upload = { CustomerID, SeasonID, Date: date, Amount };
  const checkSeason = await db
    .select("s.SeasonName", "s.SeasonID", "c.id", "c.TotalRepaid")
    .from("CustomerSummaries as c")
    .join("Seasons as s", "s.SeasonID", "c.SeasonID")
    .where("c.CustomerID", CustomerID)
    .andWhere("s.SeasonID", SeasonID);
  if (checkSeason.length > 0) {
    const { id } = checkSeason[0];
    let totalRepaid = Number(checkSeason[0].TotalRepaid);
    totalRepaid += Number(Amount);
    const repaymentRecord = await model.uploadPayments(upload);
    const CustomerSummary = await model.updateCustomerSummaries(
      totalRepaid,
      id
    );
    return {
      repaymentRecord: {
        ...repaymentRecord,
        Amount: Number(repaymentRecord.Amount),
        Date: new Date(repaymentRecord.Date).toLocaleDateString(),
      },
      CustomerSummary: mapper.toNumber(CustomerSummary)[0],
    };
  } else {
    return false;
  }
};
const cascade = async (CustomerID, date, Amount) => {
  const upload = { CustomerID, Date: date, Amount };
  const response = await model.outstandingCredit(CustomerID);
  console.log(response)
  let deposit = Amount;
  let repaymentsRecords = [];
  let customerSummaries = [];
  for (let i = 0; i < response.length; i++) {
    if (deposit > 0) {
      let currentAmount = deposit;
      let totalRepaid = Number(response[i].TotalRepaid);
      let deficit =
        Number(response[i].TotalCredit) - Number(response[i].TotalRepaid);
      totalRepaid += deficit < currentAmount ? deficit : currentAmount;
      const repaymentRecord = await model.uploadPayments({
        ...upload,
        SeasonID: response[i].SeasonID,
        Amount: currentAmount,
      });
      repaymentsRecords.push(repaymentRecord);
      if (Number(currentAmount) > 0) {
        responses = await model.updateCustomerSummaries(
          totalRepaid,
          response[i].id
        );
        customerSummaries.push(...responses);
      }

      if (deficit < currentAmount) {
        currentAmount = deficit - currentAmount;
        const adjustment = await model.uploadPayments({
          ...upload,
          SeasonID: response[i].SeasonID,
          Amount: currentAmount,
        });
        repaymentsRecords.push(adjustment);
        deposit = -currentAmount;
      } else break;
    }
  }
  const parentID = repaymentsRecords[0].RepaymentsID;
  const newRecords = await Promise.all(
    repaymentsRecords.map(async (repayment) => {
      return await model.updateParentID(parentID, repayment.RepaymentsID);
    })
  );
  return {
    repaymentRecord: newRecords,
    CustomerSummary: mapper.toNumber(customerSummaries),
  };
};

module.exports = {
  overpaid,
  override,
  cascade,
};
