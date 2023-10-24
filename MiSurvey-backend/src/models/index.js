// models/index.js
const User = require('./user.model');
const Company = require('./company.model');
const CompanyRole = require('./companyrole.model');
const Module = require('./module.model');
const CompanyUsers = require('./companyUsers.model');
const CompanyRoles = require('./companyRoles.model');
const IndividualPermissions = require('./individualPermissions.model');
const SurveyDetails = require('./surveyDetails.model');
const Surveys = require('./surveys.model');
const SurveyPages = require('./surveyPages.model');
const SurveyQuestions = require('./surveyQuestions.model');
const SurveyResponses = require('./surveyResponses.model');

module.exports = {
  User,
  Company,
  CompanyRole,
  Module,
  CompanyUsers,
  CompanyRoles,
  IndividualPermissions,
  SurveyDetails,
  Surveys,
  SurveyPages,
  SurveyQuestions,
  SurveyResponses,
  // ...other models
};