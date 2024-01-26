const express = require("express");
const { surveyQuestionController } = require("../controllers");
const { authMiddleware } = require("../middlewares"); // Import this if you need authentication

const router = express.Router();

router
  .route("/")
  .post(
    authMiddleware.tokenVerification,
    surveyQuestionController.createSurveyQuestionController
  );

router
  .route("/:questionID")
  .delete(
    authMiddleware.tokenVerification,
    surveyQuestionController.deleteSurveyQuestionController
  );


module.exports = router;
