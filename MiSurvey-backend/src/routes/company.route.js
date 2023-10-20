const express = require('express');
const { companyController } = require('../controllers');

const router = express.Router();

// SuperAdmin routes
router.post('/SuperAdmin/createCompany', companyController.createCompanyBySuperAdminController); 
router.put('/SuperAdmin/updateCompany/:CompanyID', companyController.updateCompanyBySuperAdminController);
router.delete('/SuperAdmin/deleteCompany/:CompanyID', companyController.deleteCompanyBySuperAdminController);
router.post('/SuperAdmin/getAllCompanies/:AdminID', companyController.getAllCompaniesBySuperAdminController);

// Admin routes
router.post('/Admin/createCompany/:AdminID', companyController.createCompanyByAdminController); 
router.put('/Admin/updateCompany/:AdminID', companyController.updateCompanyByAdminController);

module.exports = router;