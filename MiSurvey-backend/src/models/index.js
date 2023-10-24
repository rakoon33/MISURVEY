// models/index.js
const User = require('./user.model');
const Company = require('./company.model');
const CompanyRole = require('./companyrole.model');

module.exports = {
  User,
  Company,
  CompanyRole
  // ...other models
};