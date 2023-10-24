const express = require('express');
const companyroleController = require('../controllers/companyrole.controller');

const router = express.Router();

// Routes for SuperAdmin CRUD operations for Company Roles
router.post('/SuperAdmin/createCompanyRole', companyroleController.createCompanyRoleSuperAdminController);
router.put('/SuperAdmin/updateCompanyRole/:id', companyroleController.updateCompanyRoleSuperAdminController); 
router.delete('/SuperAdmin/deleteCompanyRole/:id', companyroleController.deleteCompanyRoleSuperAdminController); 

module.exports = router;
