const express = require('express');
const { authController } = require('../controllers');

const router = express.Router();

// SuperAdmin routes

/**
 * @swagger
 * /api/SuperAdmin/login:
 *   post:
 *     summary: Login for SuperAdmin
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the SuperAdmin
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password of the SuperAdmin
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Status of the login operation
 *                 message:
 *                   type: string
 *                   description: Message regarding the login operation
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated sessions (only available upon successful login)
 *       400:
 *         description: Bad request, login failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Status of the login operation
 *                 message:
 *                   type: string
 *                   description: Error message regarding the login operation
 */
router.post('/SuperAdmin/login', authController.loginBySuperAdminController);

// User routes
//router.post('/Admin/login', authController.loginByAdminController);

module.exports = router;

