const express = require('express');
const { authController } = require('../controllers');

const router = express.Router();

// SuperAdmin routes
router.post('/admin/login', authController.adminLoginController);

// User routes
//router.post('/user/login', authController.adminLoginController);

module.exports = router;