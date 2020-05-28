const model = require("../models");
const utils = require("../../utils");
const excelToJson = require("convert-excel-to-json");
const { override, overpaid, cascade } = utils.repayments;
const schema = require("../validation");
const { mapper } = utils;
const multipleRepayments = (req, res) => {
  let inputs;
  if (
    req.file.originalname.endsWith(".xls") ||
    req.file.originalname.endsWith(".xlsx")
  ) {
    inputs = excelToJson({ source: req.file.buffer });
    inputs = inputs["Repayment Upload"].map((input) => {
      return {
        CustomerID: input.A,
        SeasonID: input.B || "",
        Date: new Date(input.C).toLocaleDateString(),
        Amount: input.D,
      };
    });
    inputs = inputs.slice(1, inputs.length);
  }
  if (req.file.originalname.endsWith(".json")) {
    inputs = JSON.parse(req.file.buffer.toString()).RepaymentUploads;
  }
  const error = [];
  inputs.forEach(async (input) => {
    schema.repaymentsUpload.validate(
      input,
      { abortEarly: false, stripUnknown: true },
      (err) => {
        if (err) {
          const errMsg = [];
          for (let i = 0; i < err.details.length; i++) {
            errMsg.push(err.details[i].message);
          }
        }
      }
    );
    const { SeasonID, CustomerID, Date, Amount } = input;

    if (SeasonID && SeasonID !== 0) {
      try {
        await override(CustomerID, SeasonID, Date, Amount);
      } catch (err) {
        error.push(err);
      }
    } else if ((await model.outstandingCredit(CustomerID).length) === 0) {
      try {
        await overpaid(CustomerID, Date, Amount);
      } catch (err) {
        error.push(err);
      }
    } else if (
      (await model.outstandingCredit(CustomerID).length) > 0 ||
      SeasonID === 0
    ) {
      try {
        await cascade(CustomerID, Date, Amount);
      } catch (err) {
        error.push(err);
      }
    }
  });
  return res.status(201).json({
    status: 201,
    data: "Files Uploaded",
    error,
  });
};
const getRepayments = async (req, res) => {
  try {
    const { RepaymentsID, CustomerID } = req.query;
    const response = await model.getRepayments(RepaymentsID, CustomerID);
    
    if (response.length) {
      const newResponse = response.map(res => {
        return ({
          ...res,
          Date: new Date(res.Date).toLocaleDateString()
        })
      })
      return res.status(200).json({
        status: 200,
        data: newResponse,
      });
    }
    return res.status(404).json({
      status:404,
      message: err.toString()
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: err.toString(),
    });
  }
};

const uploadRepayments = async (req, res) => {
  try {
    const { CustomerID, SeasonID, Date, Amount } = req.body;
    if (SeasonID && SeasonID !== 0) {
      response = await override(CustomerID, SeasonID, Date, Amount);
      if (response) {
        return res.status(201).json({
          status: 201,
          data: response,
        });
      } else
        return res.status(404).json({
          status: 404,
          message: "Season not found",
        });
    }
    const seasonsOwed = await model.outstandingCredit(CustomerID);
    if (seasonsOwed.length === 0) {
      response = await overpaid(CustomerID, Date, Amount);
      return res.status(201).json({
        status: 201,
        data: response,
      });
    }
    if (seasonsOwed.length > 0 || SeasonID === 0) {
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
    if (response.length ) {
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
    if (response.length ) {
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
    const { CustomerID, SeasonID } = req.query;
    const response = await model.getCustomerSummaries(CustomerID, SeasonID);
    if (response.length) {
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
  multipleRepayments,
  getRepayments,
};
