const jwt = require('jsonwebtoken');

const tokenVerification = (req, res, next) => {

  return next();
 
};

module.exports = {
  tokenVerification,
};