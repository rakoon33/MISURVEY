const express = require('express');
const companyRoleController = require('../controllers/companyRole.controller');

const router = express.Router();

// Routes for SuperAdmin CRUD operations for Company Roles
router.post('/SuperAdmin/createCompanyRole', companyRoleController.createCompanyRoleSuperAdminController);
router.put('/SuperAdmin/updateCompanyRole/:id', companyRoleController.updateCompanyRoleSuperAdminController); 
router.delete('/SuperAdmin/deleteCompanyRole/:id', companyRoleController.deleteCompanyRoleSuperAdminController); 

module.exports = router;
