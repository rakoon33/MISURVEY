const express = require('express');
const { companyController } = require('../controllers');

const router = express.Router();

// SuperAdmin routes
router.post('/SuperAdmin/addCompany', companyController.addCompanyBySuperAdminController); 
router.put('/SuperAdmin/updateCompany/:CompanyID', companyController.updateCompanyBySuperAdminController);
router.delete('/SuperAdmin/deleteCompany/:CompanyID', companyController.deleteCompanyBySuperAdminController);

// User routes

module.exports = router;