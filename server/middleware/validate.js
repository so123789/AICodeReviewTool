const { validationResult } = require("express-validator");

// Runs after express-validator's chain of checks; if any failed, responds
// with a consistent 400 shape instead of letting the route handler see
// unvalidated input.
module.exports = function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};
