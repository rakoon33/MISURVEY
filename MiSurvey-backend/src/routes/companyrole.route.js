const express = require('express');
const { companyRoleController } = require('../controllers');
const { authMiddleware } = require('../middlewares');

const router = express.Router();

router
    .route('/')
    .post(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyRoleController.createCompanyRoleController)


router
    .route('/:CompanyRoleID')
    .delete(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyRoleController.deleteCompanyRoleController)
    .put(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyRoleController.updateCompanyRoleController);

module.exports = router;
