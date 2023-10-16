const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

// Routes for SuperAdmin CRUD operations
router.post('/SuperAdmin/create', userController.superAdminCreateUserController);
router.put('/SuperAdmin/update/:id', userController.superAdminUpdateUserController); 
router.delete('/SuperAdmin/delete/:id', userController.superAdminDeleteUserController); 

module.exports = router;
