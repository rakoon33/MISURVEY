const authController = require('./auth.controller');
const companyController = require('./company.controller');
const userController = require('./user.controller');
const companyroleController = require('./companyrole.controller');
const moduleController = require('./module.controller');
module.exports = {
    authController,
    companyController,
    userController,
    moduleController,
    companyroleController
  // ...other models
};