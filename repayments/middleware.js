const joi = require("@hapi/joi");
const validationSchema = require("./validation");
const validate = (value, scheme, res, next) => {
  scheme.validate(
    value,
    { abortEarly: false, stripUnknown: true },
    (err) => {
      if (err) {
        const errMsg = [];
        for (let i = 0; i < err.details.length; i++) {
          errMsg.push(err.details[i].message);
        }
        return statusHandler(res, 400, errMsg);
      }
      next();
    }
  );
};

const validateRepaymentUpload = (req, res, next) => {
  return validate(req.body, validationSchema.repaymentsUpload, res, next);
};

module.exports = {
  validateRepaymentUpload,
};
