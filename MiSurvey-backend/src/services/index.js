const authService = require('./auth.service');
const companyService = require('./company.service');
const companyRoleService = require('./companyRole.service')
const userService = require('./user.service');
const moduleService = require('./module.service');

module.exports = {
    authService,
    companyService,
    userService,
    companyRoleService,
    moduleService
  // ...other services
};