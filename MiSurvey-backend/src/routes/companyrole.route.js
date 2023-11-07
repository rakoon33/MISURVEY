const express = require('express');
const { companyRoleController } = require('../controllers');
const { authMiddleware } = require('../middlewares');

const router = express.Router();

router
    .route('/searchCompanyRoles')
    .get(authMiddleware.tokenVerification, companyRoleController.searchCompanyRolesController);

router
    .route('/')
    .post(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyRoleController.createCompanyRoleController)
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyRoleController.getAllCompanyRolesController);


router
    .route('/:CompanyRoleID')
    .delete(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyRoleController.deleteCompanyRoleController)
    .put(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyRoleController.updateCompanyRoleController)
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyRoleController.getOneCompanyRoleController);

module.exports = router;
