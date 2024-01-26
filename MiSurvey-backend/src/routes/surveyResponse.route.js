const express = require("express");
const { surveyResponseController } = require("../controllers");
const { authMiddleware } = require("../middlewares"); // Import this if you need authentication

const router = express.Router();

router
  .route("/")
  .post(
    authMiddleware.tokenVerification,
    surveyResponseController.createSurveyResponseController
  );


  router
  .route("/all/:surveyID")
  .get(
    authMiddleware.tokenVerification,
    surveyResponseController.getAllResponseController
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


module.exports = router;
