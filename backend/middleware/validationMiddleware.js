const { validationResult } = require('express-validator');

/**
 * Runs after express-validator chains.
 * If there are errors, responds with 400 and the first error message.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }
  next();
};

module.exports = { validate };
