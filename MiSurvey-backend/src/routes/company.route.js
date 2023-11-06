const express = require('express');
const { companyController } = require('../controllers');
const { authMiddleware } = require('../middlewares');
const router = express.Router();


router
    .route('/companyProfile')
    .get(authMiddleware.tokenVerification, companyController.getCompanyProfileController)
    .put(authMiddleware.tokenVerification, companyController.updateCompanyController);

router
    .route('/searchCompanies')
    .get(authMiddleware.tokenVerification, companyController.searchCompanyController);


router.route('/')
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyController.getAllCompaniesController)
    .post(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyController.createCompanyController);

router
    .route('/:CompanyID')
    .delete(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyController.deleteCompanyController)
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyController.getOneCompanyController)
    .put(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyController.updateCompanyController);

module.exports = router;