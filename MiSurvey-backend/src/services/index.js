const authService = require('./auth.service');
const companyService = require('./company.service');
const companyroleService = require('./companyrole.service')
const userService = require('./user.service');
const moduleService = require('./module.service');

module.exports = {
    authService,
    companyService,
    userService,
    companyroleService,
    moduleService
  // ...other services
};