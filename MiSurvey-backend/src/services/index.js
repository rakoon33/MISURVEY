const authService = require('./auth.service');
const companyService = require('./company.service');
const companyRoleService = require('./companyrole.service');
const userService = require('./user.service');
const moduleService = require('./module.service');
const individualPermissionService = require('./individualPermission.service');

module.exports = {
    authService,
    companyService,
    userService,
    companyRoleService,
    moduleService,
    individualPermissionService
  // ...other services
};