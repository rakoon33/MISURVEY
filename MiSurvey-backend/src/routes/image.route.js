const express = require('express');
const { imageController } = require('../controllers');
const { authMiddleware } = require('../middlewares');
const router = express.Router();
const upload = require('../config/multerconfig');

router.post('/upload-survey-image/:id', authMiddleware.tokenVerification, upload.single('image'), imageController.saveSurveyImageController);
router.post('/upload-company-logo/:id', authMiddleware.tokenVerification, upload.single('image'), imageController.saveCompanyLogoController);
router.post('/upload-user-avatar/:id', authMiddleware.tokenVerification, upload.single('image'), imageController.saveUserAvatarController);

router.put('/update-survey-image/:id', authMiddleware.tokenVerification, upload.single('image'), imageController.updateSurveyImageController);
router.put('/update-company-logo/:id', authMiddleware.tokenVerification, upload.single('image'), imageController.updateCompanyLogoController);
router.put('/update-user-avatar/:id', authMiddleware.tokenVerification, upload.single('image'), imageController.updateUserAvatarController);

router.delete('/delete-survey-image/:id', authMiddleware.tokenVerification, imageController.deleteSurveyImageController);
router.delete('/delete-company-logo/:id', authMiddleware.tokenVerification, imageController.deleteCompanyLogoController);
router.delete('/delete-user-avatar/:id', authMiddleware.tokenVerification, imageController.deleteUserAvatarController);

module.exports = router;
