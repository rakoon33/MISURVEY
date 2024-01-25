const authController = require('./auth.controller');
const companyController = require('./company.controller');
const companyRoleController = require('./companyrole.controller');
const userController = require('./user.controller')
const moduleController = require('./module.controller');
const individualPermissionController = require('./individualPermission.controller');
const companyUserController = require('./companyUser.controller');
const surveyController = require('./survey.controller');
const surveyResponseController = require('./surveyResponse.controller');


module.exports = {
    authController,
    companyController,
    userController,
    companyRoleController,
    moduleController,
    individualPermissionController,
    companyUserController,
    surveyController,
    surveyResponseController
  // ...other models
};