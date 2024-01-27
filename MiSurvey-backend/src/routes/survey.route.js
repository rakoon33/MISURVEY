const express = require("express");
const { surveyController } = require("../controllers");
const { authMiddleware } = require("../middlewares"); // Import this if you need authentication

const router = express.Router();


router
  .route("/")
  .post(
    authMiddleware.tokenVerification,
    surveyController.createSurveyController
  )
  .get(
    authMiddleware.tokenVerification,
    surveyController.getAllSurveyController
  );

router
  .route("/searchSurveys")
  .get(
    authMiddleware.tokenVerification,
    surveyController.searchSurveyController
  );

router
  .route("/c/f/:SurveyLink")
  .get(
    authMiddleware.tokenVerification,
    surveyController.getOneSurveyWithDataByLinkController
  );

router
  .route("/detail/:SurveyID")
  .get(
    authMiddleware.tokenVerification,
    surveyController.getOneSurveyWithoutDataController
  );

router
  .route("/:SurveyID")
  .get(
    authMiddleware.tokenVerification,
    surveyController.getOneSurveyWithDataController
  )
  .put(
    authMiddleware.tokenVerification,
    surveyController.updateSurveyController
  )
  .delete(
    authMiddleware.tokenVerification,
    surveyController.deleteSurveyController
  );

module.exports = router;
