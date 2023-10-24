// models/index.js
const User = require('./user.model');
const Company = require('./company.model');
const CompanyUsers = require('./companyUsers.model')
const CompanyRoles = require('./companyRoles.model')

module.exports = {
  User,
  Company,
  CompanyUsers,
  CompanyRoles,
  // ...other models
};