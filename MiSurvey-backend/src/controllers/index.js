const authController = require('./auth.controller');
const companyController = require('./company.controller');
const companyroleController = require('./companyrole.controller');
const userController = require('./user.controller')
const moduleController = require('./module.controller');

module.exports = {
    authController,
    companyController,
    userController,
    companyroleController,
    moduleController
  // ...other models
};