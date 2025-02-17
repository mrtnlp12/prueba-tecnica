const { validationResult } = require('express-validator');

const validateRequest = () => {
  return (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((error) => error.msg),
      });
    }
    next();
  };
};

module.exports = { validateRequest };