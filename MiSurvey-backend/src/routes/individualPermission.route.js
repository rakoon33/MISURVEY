const express = require('express');
const { individualPermissionController } = require('../controllers');
const { authMiddleware } = require('../middlewares');
const router = express.Router();

router.route('/')
    .post(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, individualPermissionController.createIndividualPermissionController);

router
    .route('/:companyUserId/:moduleId')
    .delete(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, individualPermissionController.deleteIndividualPermissionController)
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, individualPermissionController.getOneIndividualPermissionController)
    .put(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, individualPermissionController.updateIndividualPermissionController);

module.exports = router;