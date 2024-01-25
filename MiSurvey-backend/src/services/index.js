const authService = require('./auth.service');
const companyService = require('./company.service');
const companyRoleService = require('./companyrole.service');
const userService = require('./user.service');
const moduleService = require('./module.service');
const individualPermissionService = require('./individualPermission.service');
const companyUserService = require('./companyUser.service');
const surveyService = require('./survey.service');
const surveyQuestionService = require('./surveyQuestion.service');
const surveyResponseService = require('./surveyResponse.service');

module.exports = {
    authService,
    companyService,
    userService,
    companyRoleService,
    moduleService,
    individualPermissionService,
    companyUserService,
    surveyService,
    surveyQuestionService,
    surveyResponseService
  // ...other services
};