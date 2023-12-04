const express = require('express');
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares');
const router = express.Router();

/**
 * @swagger
 * /api/users/getUserData:
 *   get:
 *     summary: Get data of current username
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User found successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, username query parameter is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Username is required as a query parameter.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No user found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve user data.
 */
router.get('/getUserData', authMiddleware.tokenVerification, userController.getUserDataController);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Retrieve the authenticated user's profile
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, could not retrieve user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve user details
 *   put:
 *     summary: Update the profile of the authenticated user
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: UserID
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FirstName:
 *                 type: string
 *               LastName:
 *                 type: string
 *               UserPassword:
 *                 type: string
 *                 format: password
 *               Email:
 *                 type: string
 *                 format: email
 *               PhoneNumber:
 *                 type: string
 *               UserAvatar:
 *                 type: string
 *                 format: uri
 *               # Add other updatable fields here
 *             example:
 *               FirstName: "John"
 *               LastName: "Doe"
 *               Email: "john.doe@example.com"
 *               PhoneNumber: "1234567890"
 *               UserAvatar: "http://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, could not update user profile due to invalid data or other error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid data provided or user does not exist."
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         UserID:
 *           type: integer
 *           description: Unique identifier for the user
 *         Username:
 *           type: string
 *           description: Username for the user account
 *         FirstName:
 *           type: string
 *           description: First name of the user
 *         LastName:
 *           type: string
 *           description: Last name of the user
 *         Email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         UserRole:
 *           type: string
 *           description: Role of the user in the system
 */
router
    .route('/profile')
    .get(authMiddleware.tokenVerification, userController.getUserProfileController)
    .put(authMiddleware.tokenVerification, userController.updateUserController);

router
    .route('/searchUsers')
    .get(authMiddleware.tokenVerification, userController.searchUserController);

router.route('/')
    .get(authMiddleware.tokenVerification, userController.getAllUsersController)
    .post(authMiddleware.tokenVerification, userController.createUserController);

router
    .route('/:UserID')
    .delete(authMiddleware.tokenVerification, userController.deleteUserController)
    .get(authMiddleware.tokenVerification,userController.getOneUserController)
    .put(authMiddleware.tokenVerification, userController.updateUserController);


module.exports = router;
