const express = require('express');
const { companyController } = require('../controllers');

const router = express.Router();

// SuperAdmin routes
router.post('/admin/addCompany', companyController.adminAddCompanyController); 



// User routes
//router.post('/user/addCompany', companyController.adminAddCompanyController); 

module.exports = router;