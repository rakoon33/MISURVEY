const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

// Routes for SuperAdmin CRUD operations
router.post('/SuperAdmin/createUser', userController.createUserSuperAdminController);
router.put('/SuperAdmin/updateUser/:id', userController.updateUserSuperAdminController); 
router.delete('/SuperAdmin/deleteUser/:id', userController.deleteUserSuperAdminController); 
router.get('/SuperAdmin/getUserDetailsByID/:id', userController.getUserDetailsByIDSuperAdminController);
router.get('/SuperAdmin/getAllUsers', userController.getAllUsersSuperAdminController);

module.exports = router;
