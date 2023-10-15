const express = require('express');
const { companyController } = require('../controllers');

const router = express.Router();

// SuperAdmin routes
router.post('/admin/addCompany', companyController.adminAddCompanyController); 
router.put('/admin/updateCompany/:CompanyID', companyController.adminUpdateCompanyController);
router.delete('/admin/deleteCompany/:CompanyID', companyController.adminDeleteCompanyController);

// User routes

module.exports = router;