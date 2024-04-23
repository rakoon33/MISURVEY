const express = require('express');
const { questionTemplateController } = require('../controllers');
const router = express.Router();

router.post('/', questionTemplateController.createQuestionTemplateController);
router.get('/', questionTemplateController.getAllQuestionTemplatesController);
router.get('/search', questionTemplateController.searchQuestionTemplatesController);
router.put('/:templateID', questionTemplateController.updateQuestionTemplateController);
router.delete('/:templateID', questionTemplateController.deleteQuestionTemplateController);
router.get('/:templateId', questionTemplateController.getQuestionTemplateController);

module.exports = router;
