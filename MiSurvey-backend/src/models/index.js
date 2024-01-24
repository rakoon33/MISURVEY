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
const CompanyRole = require('./companyrole.model');
const RolePermission = require('./rolePermission.model');
const Customer = require('./customer.model');
const Ticket = require('./ticket.model');
const Notification = require('./notification.model');
const ServicePackage = require('./servicePackage.model');
const UserPackage = require('./userPackage.model');
const UserActivityLog = require('./userActivityLog.model');
const SurveyReport = require('./surveyReport.model');
const SurveyType = require('./surveyType.model');

// Set up the association

Module.hasMany(IndividualPermission, { foreignKey: 'ModuleID', as: 'permissions' });
IndividualPermission.belongsTo(Module, { foreignKey: 'ModuleID', as: 'module' });

RolePermission.belongsTo(Module, {
  foreignKey: 'ModuleID', // Adjust as per your column name in RolePermission
  as: 'module' // Alias for this association
});

// Optional: Reverse association from Module to RolePermission
Module.hasMany(RolePermission, {
  foreignKey: 'ModuleID', // Adjust as per your column name in RolePermission
  as: 'rolePermissions' // Alias for this association
});

// User and Company
User.hasOne(Company, {
  foreignKey: 'AdminID',
  as: 'AdminOfCompany' // Ensure this alias is unique
});
Company.belongsTo(User, {
  foreignKey: 'AdminID',
  as: 'Admin' // Different alias for the inverse relationship
});

// User and CompanyUser associations
User.hasMany(CompanyUser, {
  foreignKey: 'UserID',
  as: 'CompanyUsers'
});
CompanyUser.belongsTo(User, {
  foreignKey: 'UserID',
  as: 'User'
});

// Company and CompanyUser associations
Company.hasMany(CompanyUser, {
  foreignKey: 'CompanyID',
  as: 'CompanyUsers'
});
CompanyUser.belongsTo(Company, {
  foreignKey: 'CompanyID',
  as: 'Company'
});

//CompanyUser vs CompanyRole
CompanyUser.belongsTo(CompanyRole, {
  foreignKey: 'CompanyRoleID',
  as: 'CompanyRole'
});
CompanyRole.hasMany(CompanyUser, {
  foreignKey: 'CompanyRoleID',
  as: 'CompanyUsers'
});

// CompanyRole and RolePermission
RolePermission.belongsTo(CompanyRole, {
  foreignKey: 'CompanyRoleID',
  as: 'companyRole'
});

CompanyRole.hasMany(RolePermission, {
  foreignKey: 'CompanyRoleID',
  as: 'permissions'
});

// Survey and SurveyPage
Survey.hasMany(SurveyPage, {
  foreignKey: 'SurveyID',
  as: 'SurveyPages'
});
SurveyPage.belongsTo(Survey, {
  foreignKey: 'SurveyID',
  as: 'Survey'
});

// SurveyPage and SurveyQuestion
SurveyPage.hasMany(SurveyQuestion, {
  foreignKey: 'PageID',
  as: 'SurveyQuestions'
});
SurveyQuestion.belongsTo(SurveyPage, {
  foreignKey: 'PageID',
  as: 'SurveyPage'
});

// Survey and SurveyDetail
Survey.hasMany(SurveyDetail, {
  foreignKey: 'SurveyID',
  as: 'SurveyDetails'
});
SurveyDetail.belongsTo(Survey, {
  foreignKey: 'SurveyID',
  as: 'Survey'
});

// SurveyQuestion and SurveyType
SurveyQuestion.belongsTo(SurveyType, {
  foreignKey: 'QuestionType', // Assuming 'QuestionType' is the foreign key in SurveyQuestion referring to SurveyTypeID in SurveyType
  as: 'SurveyType'
});

SurveyType.hasMany(SurveyQuestion, {
  foreignKey: 'QuestionType',
  as: 'SurveyQuestions'
});

// SurveyResponse belongs to Customer
SurveyResponse.belongsTo(Customer, {
  foreignKey: 'CustomerID',
  as: 'Customer'
});

// SurveyResponse belongs to Survey
SurveyResponse.belongsTo(Survey, {
  foreignKey: 'SurveyID',
  as: 'Survey'
});

// SurveyResponse belongs to SurveyQuestion
SurveyResponse.belongsTo(SurveyQuestion, {
  foreignKey: 'QuestionID',
  as: 'SurveyQuestion'
});

// Optionally, define the inverse relationships
// Customer has many SurveyResponses
Customer.hasMany(SurveyResponse, {
  foreignKey: 'CustomerID',
  as: 'SurveyResponses'
});

// Survey has many SurveyResponses
Survey.hasMany(SurveyResponse, {
  foreignKey: 'SurveyID',
  as: 'SurveyResponses'
});

// SurveyQuestion has many SurveyResponses
SurveyQuestion.hasMany(SurveyResponse, {
  foreignKey: 'QuestionID',
  as: 'SurveyResponses'
});

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
  RolePermission,
  Customer,
  Ticket,
  Notification,
  ServicePackage,
  UserPackage,
  UserActivityLog,
  SurveyReport,
  SurveyType
  // ...other models
};