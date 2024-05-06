const express = require("express");
const reportController = require("../controllers/report.controller");
const { authMiddleware } = require("../middlewares");
const router = express.Router();

router.get(
  "/",
  authMiddleware.tokenVerification,
  reportController.getDashboardDataController
);
router.get(
  "/activity-overview",
  authMiddleware.tokenVerification,
  reportController.getActivityOverviewController
);
router.get(
  "/survey-type-usage",
  authMiddleware.tokenVerification,
  reportController.getSurveyTypeUsageController
);

router.get(
  "/survey-count",
  authMiddleware.tokenVerification,
  reportController.getSurveyCountByDateRangeController
);

router.get(
  "/survey-report/:surveyId",
  reportController.getSurveyQuestionDataController
);

module.exports = router;
