const express = require('express');
const superadminController = require('../controllers/superadmin.controller');

const router = express.Router();

// Routes for Superadmin CRUD operations
router.post('/admin/create', superadminController.createSuperadminController);
router.put('/admin/update/:id', superadminController.updateSuperadminController); 
router.delete('/admin/delete/:id', superadminController.deleteSuperadminController); 

module.exports = router;
