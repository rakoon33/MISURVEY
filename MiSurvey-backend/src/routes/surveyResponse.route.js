const express = require("express");
const { surveyResponseController } = require("../controllers");
const { authMiddleware } = require("../middlewares"); // Import this if you need authentication

const router = express.Router();

// Route to create a new survey with image upload handling
router
  .route("/")
  .post(
    authMiddleware.tokenVerification,
    surveyResponseController.createSurveyResponseController
  );

router
  .route("/:responseID")
  .get(
    authMiddleware.tokenVerification,
    surveyResponseController.getOneSurveyResponseController
  )
  .delete(
    authMiddleware.tokenVerification,
    surveyResponseController.deleteSurveyResponseController
  );

router
  .route("/all/:surveyID")
  .get(
    authMiddleware.tokenVerification,
    surveyResponseController.getAllResponseController
  );
// You can add more routes here for other survey functionalities

module.exports = router;
