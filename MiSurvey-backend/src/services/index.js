const authService = require('./auth.service');
const companyService = require('./company.service');
const superadminService = require('./user.service')
module.exports = {
    authService,
    companyService,
    superadminService
  // ...other services
};