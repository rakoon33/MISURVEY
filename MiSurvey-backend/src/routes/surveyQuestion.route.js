const express = require("express");
const { surveyQuestionController } = require("../controllers");
const { authMiddleware } = require("../middlewares");
const router = express.Router();

router.get(
  "/has-responses/:questionId",
  authMiddleware.tokenVerification,
  surveyQuestionController.checkQuestionResponsesController
);

router
  .route("/:questionID")
  .delete(
    authMiddleware.tokenVerification,
    surveyQuestionController.deleteSurveyQuestionController
  );


module.exports = router;
