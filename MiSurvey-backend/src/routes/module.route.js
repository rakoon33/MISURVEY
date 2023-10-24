const express = require('express');
const { moduleController } = require('../controllers');
const router = express.Router();


// SuperAdmin routes

router.post('/SuperAdmin/createModule', moduleController.createModuleBySuperAdminController); 
router.put('/SuperAdmin/updateModule/:ModuleID', moduleController.updateModuleBySuperAdminController); 
router.delete('/SuperAdmin/deleteModule/:ModuleID', moduleController.deleteModuleBySuperAdminController); 
router.get('/SuperAdmin/searchModules', moduleController.searchModulesBySuperAdminController);
router.get('/SuperAdmin/getOneModuleDetail/:ModuleID', moduleController.getOneModuleBySuperAdminController);
router.get('/SuperAdmin/getAllModules', moduleController.getAllModulesBySuperAdminController);
// User routes


module.exports = router;