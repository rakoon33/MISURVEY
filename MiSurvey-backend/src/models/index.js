// models/index.js
const User = require('./user.model');
const Company = require('./company.model');
const CompanyRole = require('./companyrole.model');
const Module = require('./module.model');
module.exports = {
  User,
  Company,
  CompanyRole,
  Module
  // ...other models
};