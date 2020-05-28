const joi = require('@hapi/joi')
const joiDate = require('@hapi/joi-date')

const CustomerID   = joi
.number()
.invalid('')
.integer()
.required()
.error(errors => {
  errors.forEach(err => {
    switch (err.type) {
      case 'any.required':
        err.message = 'Customer ID is required';
        break;
      case 'any.empty':
        err.message = 'Customer ID cannot be empty';
        break;
      case 'number.integer':
        err.message = 'Customer ID must be an integer';
      default:
        break;
    }
  });
  return errors;
});
const SeasonID = joi
.number().integer().positive().allow('').error(
    errors => {
        errors.forEach(err => {
          switch (err.type) {
            case 'any.required':
              err.message = 'Season ID is required';
              break;
            case 'any.empty':
              err.message = 'Season ID cannot be empty';
              break;
            case 'number.integer':
              err.message = 'Season ID must be an integer';
              case 'number.positive':
                err.message = 'Season ID must be positive';
            default:
              break;
          }
        });
        return errors;
      }   
);

const Date = joi.extend(joiDate)
.date().format('MM/DD/YYYY')
.invalid('')
.required()
.error(errors => {
  errors.forEach(err => {
    switch (err.type) {
      case 'any.required':
        err.message = 'Date is required';
        break;
    case 'date.format':
        err.message= 'Date should be in the form "MM/DD/YYYY"'
      case 'any.empty':
        err.message = 'Date cannot be empty';
        break;
      case 'date.base':
        err.message = 'value is not a date';
      default:
        break;
    }
  });
  return errors;
});

const Amount = joi
.number()
.invalid('')
.positive()
.required()
.error(errors => {
  errors.forEach(err => {
    switch (err.type) {
      case 'any.required':
        err.message = 'Amount is required';
        break;
      case 'any.empty':
        err.message = 'Amount cannot be empty';
        break;
      case 'number.integer':
        err.message = 'Amount must be an integer';
    case 'number.postive':
        err.message = 'Amount must be positive';
      default:
        break;
    }
  });
  return errors;
});

const repaymentsUpload = joi.object().keys({
    CustomerID,
    SeasonID,
    Date,
    Amount
})

module.exports = {
    repaymentsUpload
}