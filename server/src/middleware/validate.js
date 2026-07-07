const { validationResult } = require('express-validator');
const { fail } = require('../utils/helpers');

// Runs after express-validator chains; returns 422 with the first message.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
  return fail(res, details[0].message, 422, details);
}

module.exports = validate;
