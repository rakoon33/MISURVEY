const express = require('express');
const { questionTemplateController } = require('../controllers');
const { authMiddleware } = require('../middlewares');
const router = express.Router();

router.post('/', authMiddleware.tokenVerification,questionTemplateController.createQuestionTemplateController);
router.get('/', authMiddleware.tokenVerification,questionTemplateController.getAllQuestionTemplatesController);
router.get('/search', authMiddleware.tokenVerification,questionTemplateController.searchQuestionTemplatesController);
router.put('/:templateID', authMiddleware.tokenVerification,questionTemplateController.updateQuestionTemplateController);
router.delete('/:templateID', authMiddleware.tokenVerification,questionTemplateController.deleteQuestionTemplateController);
router.get('/:templateId', authMiddleware.tokenVerification,questionTemplateController.getQuestionTemplateController);

module.exports = router;
