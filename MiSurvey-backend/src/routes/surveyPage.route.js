const express = require('express');
const { surveyPageController } = require('../controllers');
const { authMiddleware } = require('../middlewares'); // Import this if you need authentication

const router = express.Router();

router.route('/:SurveyPageID')
    .delete(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, surveyPageController.deleteSurveyPageController);

module.exports = router;
