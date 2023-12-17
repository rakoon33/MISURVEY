const express = require('express');
const { surveyPageController } = require('../controllers');
const { authMiddleware } = require('../middlewares');

const router = express.Router();

// Route to create a new survey page
// Assuming you want to protect this route, we are using tokenVerification middleware
router.post('/', authMiddleware.tokenVerification, surveyPageController.createSurveyPageController);

// You can add more routes here as needed, such as for updating, retrieving, or deleting survey pages

module.exports = router;
