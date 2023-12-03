const express = require('express');
const { authController } = require('../controllers');
const router = express.Router();

/**
 * @swagger
 * /api/login:
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
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: Value=eyJhbGciO; Expires=Mon, 01 Jan 2024 08:54:17 GMT; HttpOnly=true; Secure=true
 *             description: Session ID cookie set upon successful login
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
 *       400:
 *         description: Bad request, login failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message regarding the login operation
 */
router.post('/login', authController.loginController);

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Logout the current user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logout successful, the session cookie has been cleared
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure
 *             description: Clears the JWT cookie by setting its expiration date to the past
 *       400:
 *         description: Logout failed due to an error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message regarding the logout operation
 */
router.post('/logout', authController.logoutController);

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user and their company
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - companyName
 *               - email
 *               - username
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the user
 *               lastName:
 *                 type: string
 *                 description: Last name of the user
 *               companyName:
 *                 type: string
 *                 description: Name of the company to be registered
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *               username:
 *                 type: string
 *                 description: Desired username for the user account
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for the user account
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Status of the registration operation
 *                 message:
 *                   type: string
 *                   description: Message regarding the registration operation
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     company:
 *                       $ref: '#/components/schemas/Company'
 *       400:
 *         description: Bad request, registration failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message explaining why the registration failed
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */
router.post('/register', authController.registerUserController);

/**
 * @swagger
 * /api/checkpermissions/{userId}:
 *   get:
 *     summary: Check permissions for a specific user
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user
 *     responses:
 *       200:
 *         description: Permissions retrieval successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userDetails:
 *                   type: object
 *                   description: Details of the user without password information
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       moduleName:
 *                         type: string
 *                         description: Name of the module
 *                       permissionDetail:
 *                         type: object
 *                         description: Specific permission details for the module
 *       400:
 *         description: Bad request, could be due to missing or invalid userId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining why the request failed
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the user does not exist
 */
router.get('/checkpermissions/:userId', authController.checkPermissionsController);

module.exports = router;

