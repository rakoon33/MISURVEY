// models/index.js
const User = require('./user.model');
const Company = require('./company.model');
const Module = require('./module.model');
const CompanyUser = require('./companyUser.model');
const IndividualPermission = require('./individualPermission.model');
const SurveyDetail = require('./surveyDetail.model');
const Survey = require('./survey.model');
const SurveyPage = require('./surveyPage.model');
const SurveyQuestion = require('./surveyQuestion.model');
const SurveyResponse = require('./surveyResponse.model');
const CompanyRole = require('./companyRole.model');
const RolePermissions = require('./rolePermission.model');

module.exports = {
  User,
  Company,
  CompanyRole,
  Module,
  CompanyUser,
  IndividualPermission,
  SurveyDetail,
  Survey,
  SurveyPage,
  SurveyQuestion,
  SurveyResponse,
  RolePermissions
  // ...other models
};