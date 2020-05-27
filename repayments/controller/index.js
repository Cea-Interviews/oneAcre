const model = require("../models");
const utils = require("../../utils");

const {override, overpaid, cascade } = utils.repayments;
const {mapper} = utils

const uploadRepayments = async (req, res) => {
  try {
      let response;
    const { CustomerID, SeasonID, Date, Amount } = req.body;
    if (SeasonID && SeasonID !== 0) {
       response = await override(CustomerID, SeasonID, Date, Amount);
      if(response){
          return res.status(201).json({
        status: 201,
        data: response,
      });
      }
      return res.status(404).json({
          status:404,
          message: 'Season not found'
      })
    }
    const SeasonsOwed = await model.outstandingCredit(CustomerID)
    if (SeasonsOwed.length === 0) {
      response = await overpaid(CustomerID, Date, Amount);
      return res.status(201).json({
        status: 201,
        data: response,
      });
    }
    if (SeasonsOwed.length > 0 || SeasonID === 0) {
      response = await cascade(CustomerID, Date, Amount);
      return res.status(201).json({
        status: 201,
        data: response,
      });
    }
    return res.status(400).json({
      status: 400,
      message: "Something Went Wrong",
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      error: err.toString(),
    });
  }
};
const getCustomers = async (req, res) => {
  try {
    const response = await model.getCustomers();
    if (response) {
      return res.status(200).json({
        status: 200,
        data: response,
      });
    }
    return res.status(404).json({
      status: 404,
      message: "No Customer Found",
    });
  } catch (err) {
    return res.status(500).json({ status: 500, error: err.toString() });
  }
};
const getSeasons = async (req, res) => {
  try {
    const response = await model.getSeasons();
    if (response) {
      return res.status(200).json({
        status: 200,
        data: mapper.toDate(response),
      });
    }
    return res.status(404).json({
      status: 404,
      message: "No Season Found",
    });
  } catch (err) {
    return res.status(500).json({ status: 500, error: err.toString() });
  }
};

const getCustomerSummary = async (req, res) => {
  try {
    const {CustomerID, SeasonID} = req.query;
    const response = await model.getCustomerSummaries(CustomerID, SeasonID);
    if (response) {
      return res.status(200).json({
        status: 200,
        data: [...mapper.toNumber(response)],
      });
    }
    return res.status(404).json({
      status: 404,
      message: "No summary found",
    });
  } catch (err) {
    return res.status(500).json({ status: 500, error: err.toString() });
  }
};

module.exports = {
  uploadRepayments,
  getCustomers,
  getSeasons,
  getCustomerSummary,
};
