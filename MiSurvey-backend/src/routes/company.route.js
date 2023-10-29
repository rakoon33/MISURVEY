const express = require('express');
const { companyController } = require('../controllers');

const router = express.Router();

// SuperAdmin routes
router.post('/SuperAdmin/createCompany', companyController.createCompanyBySuperAdminController); 
router.put('/SuperAdmin/updateCompany/:CompanyID', companyController.updateCompanyBySuperAdminController);
router.delete('/SuperAdmin/deleteCompany/:CompanyID', companyController.deleteCompanyBySuperAdminController);
router.post('/SuperAdmin/getAllCompaniesBySuperAdmin', companyController.getAllCompaniesBySuperAdminController);
router.get('/SuperAdmin/searchCompany', companyController.searchCompanyBySuperAdminController);

// Admin routes
router.post('/Admin/createCompany/:AdminID', companyController.createCompanyByAdminController); 
router.put('/Admin/updateCompany/:AdminID', companyController.updateCompanyByAdminController);
router.delete('/Admin/deleteCompany/:CompanyID', companyController.deleteCompanyByAdminController);
router.post('/Admin/getCompanyByAdmin/:AdminID', companyController.getCompanyByAdminController);

// Admin & SuperAdmin routes
router.get('/getOneCompany/:CompanyID', companyController.getOneCompanyController);

module.exports = router;