const express = require('express');
const { individualPermissionController } = require('../controllers');
const { authMiddleware } = require('../middlewares');
const { isSuperAdmin } = require('../middlewares/auth.middleware');
const router = express.Router();

router.route('/')
    .post(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, individualPermissionController.createIndividualPermissionController)
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, individualPermissionController.getAllIndividualPermissionsController);

router
    .route('/:companyUserId/:moduleId')
    .delete(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, individualPermissionController.deleteIndividualPermissionController)
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, individualPermissionController.getOneIndividualPermissionController)
    .put(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, individualPermissionController.updateIndividualPermissionController);

router.route('/search/:companyUserId')
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, individualPermissionController.searchIndividualPermissionsController);

module.exports = router;