const express = require('express');
const { surveyController } = require('../controllers');
const { authMiddleware } = require('../middlewares'); // Import this if you need authentication

const router = express.Router();

// Route to create a new survey
//router.post('/', authMiddleware.tokenVerification, surveyController.createSurveyController);
const multer = require('multer');

// Configure multer for image upload
const storage = multer.memoryStorage(); // You can also use diskStorage
const upload = multer({ storage: storage });

// Route to create a new survey with image upload handling
router.route('/')
    .post(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, surveyController.createSurveyController)
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, surveyController.getAllSurveyController);

router
    .route('/searchSurveys')
    .get(authMiddleware.tokenVerification, surveyController.searchSurveyController);

router.route('/detail/:SurveyID')
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, surveyController.getOneSurveyWithoutDataController);

router.route('/:SurveyID')
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, surveyController.getOneSurveyWithDataController)
    .put(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, surveyController.updateSurveyController)
    .delete(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, surveyController.deleteSurveyController);


// You can add more routes here for other survey functionalities

module.exports = router;
