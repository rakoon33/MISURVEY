const express = require("express");
const { surveyQuestionController } = require("../controllers");
const { authMiddleware } = require("../middlewares");
const router = express.Router();

router
  .route("/:questionID")
  .delete(
    authMiddleware.tokenVerification,
    surveyQuestionController.deleteSurveyQuestionController
  );

module.exports = router;
