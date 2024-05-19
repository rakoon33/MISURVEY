const authController = require("./auth.controller");
const companyController = require("./company.controller");
const companyRoleController = require("./companyrole.controller");
const userController = require("./user.controller");
const moduleController = require("./module.controller");
const individualPermissionController = require("./individualPermission.controller");
const companyUserController = require("./companyUser.controller");
const surveyController = require("./survey.controller");
const surveyResponseController = require("./surveyResponse.controller");
const surveyQuestionController = require("./surveyQuestion.controller");
const customerController = require("./customer.controller");
const questionTemplateController = require("./questionTemplate.controller");
const reportController = require("./report.controller");
const userActivityLogController = require("./userActivityLog.controller");
const servicePackageController = require("./servicePackage.controller");
const userPackageController = require("./userPackage.controller");
const imageController = require("./image.controller");
const notificationController = require("./notification.controller");

module.exports = {
  authController,
  companyController,
  userController,
  companyRoleController,
  moduleController,
  individualPermissionController,
  companyUserController,
  surveyController,
  surveyResponseController,
  surveyQuestionController,
  customerController,
  questionTemplateController,
  reportController,
  userActivityLogController,
  servicePackageController,
  userPackageController,
  imageController,
  notificationController
};
