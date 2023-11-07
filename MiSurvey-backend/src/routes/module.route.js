const express = require('express');
const { moduleController } = require('../controllers');
const { authMiddleware } = require('../middlewares');
const router = express.Router();

router
    .route('/searchModules')
    .get(authMiddleware.tokenVerification, moduleController.searchModulesController);

router.route('/')
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, moduleController.getAllModulesController)
    .post(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, moduleController.createModuleController);

router
    .route('/:ModuleID')
    .delete(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, moduleController.deleteModuleController)
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, moduleController.getOneModuleController)
    .put(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, moduleController.updateModuleController);

module.exports = router;