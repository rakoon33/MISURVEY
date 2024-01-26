const express = require("express");
const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares");
const router = express.Router();

/**
 * @swagger
 * /api/users/getUserData:
 *   get:
 *     summary: Get data of current username (superadmin & admin)
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
 *                 status:
 *                   type: boolean
 *                   example: false
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
 *                 status:
 *                   type: boolean
 *                   example: false
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
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve user data.
 */
router.get(
  "/getUserData",
  authMiddleware.tokenVerification,
  userController.getUserDataController
);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Retrieve the authenticated user's profile (superadmin & admin)
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
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve user details
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
  .route("/profile")
  .get(
    authMiddleware.tokenVerification,
    userController.getUserProfileController
  );

/**
 * @swagger
 * /api/users/profile/{UserID}:
 *   put:
 *     summary: Update the profile of the authenticated user (superadmin & admin)
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
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid data provided or user does not exist."
 */
router
  .route("/profile/:UserID")
  .put(authMiddleware.tokenVerification, userController.updateUserController); // chưa xài

/**
 * @swagger
 * /api/users/searchUsers:
 *   get:
 *     summary: Search for users based on specific criteria (superadmin)
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: column
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Username, Email, PhoneNumber, UserRole, IsActive, Fullname]
 *         description: Column to search in (Username, Email, PhoneNumber, UserRole, IsActive, Fullname)
 *       - in: query
 *         name: searchTerm
 *         required: true
 *         schema:
 *           type: string
 *         description: Term to search for in the specified column
 *     responses:
 *       200:
 *         description: Users found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, invalid column or searchTerm
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
 *                   example: Both column and searchTerm are required as query parameters.
 *       500:
 *         description: Internal server error occurred while processing the request
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
 *                   example: An unexpected error occurred while searching for users.
 */
router
  .route("/searchUsers")
  .get(authMiddleware.tokenVerification, userController.searchUserController);

/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: Retrieve a list of all users (superadmin can see all user, admin only see their info)
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, unable to retrieve users
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
 *                   example: "Failed to retrieve users"
 *   post:
 *     summary: Create a new user (superadmin & admin can create user)
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Username
 *               - FirstName
 *               - LastName
 *               - Email
 *               - UserPassword
 *             properties:
 *               Username:
 *                 type: string
 *               FirstName:
 *                 type: string
 *               LastName:
 *                 type: string
 *               Email:
 *                 type: string
 *                 format: email
 *               UserPassword:
 *                 type: string
 *                 format: password
 *               UserRole:
 *                 type: string
 *               IsActive:
 *                 type: boolean
 *             example:
 *               Username: "newuser123"
 *               FirstName: "John"
 *               LastName: "Doe"
 *               Email: "john.doe@example.com"
 *               UserPassword: "Password123"
 *               UserRole: "User"
 *               IsActive: true
 *     responses:
 *       200:
 *         description: User created successfully
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
 *                   example: "User created successfully"
 *                 userID:
 *                   type: integer
 *                   example: 101
 *       400:
 *         description: Bad request, user creation failed due to invalid input or other errors
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
 *                   example: "User creation failed, invalid data provided"
 */
router
  .route("/")
  .get(authMiddleware.tokenVerification, userController.getAllUsersController)
  .post(authMiddleware.tokenVerification, userController.createUserController);

/**
 * @swagger
 * /api/users/{UserID}:
 *   delete:
 *     summary: Delete a user by their UserID (superadmin)
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: UserID
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the user to be deleted
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *                   example: "User deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, user deletion failed due to invalid UserID or other error
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
 *                   example: "User not found or user deletion failed."
 *   get:
 *     summary: Retrieve details of a specific user by UserID (superadmin & admin can view all)
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: UserID
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the user
 *     responses:
 *       200:
 *         description: User details retrieved successfully
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
 *         description: Bad request, failed to retrieve user due to invalid UserID or other error
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
 *                   example: "User not found or failed to retrieve user details."
 *   put:
 *     summary: Update information for a specific user by UserID (superadmin and admin can update all user)
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: UserID
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the user to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserPassword:
 *                 type: string
 *                 format: password
 *                 description: New password for the user (optional)
 *               FirstName:
 *                 type: string
 *                 description: First name of the user (optional)
 *               LastName:
 *                 type: string
 *                 description: Last name of the user (optional)
 *               Email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user (optional)
 *               UserRole:
 *                 type: string
 *                 description: Role of the user within the system (optional)
 *               IsActive:
 *                 type: boolean
 *                 description: Indicates if the user's account is active (optional)
 *               # Include other updatable user properties here
 *             example:
 *               UserPassword: "newpassword123"
 *               FirstName: "Jane"
 *               LastName: "Doe"
 *               Email: "janedoe@example.com"
 *               UserRole: "Admin"
 *               IsActive: true
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *         description: Bad request, failed to update user due to invalid UserID or other error
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
 *                   example: "User not found or failed to update user details."
 */
router
  .route("/:UserID")
  .delete(authMiddleware.tokenVerification, userController.deleteUserController)
  .get(authMiddleware.tokenVerification, userController.getOneUserController)
  .put(authMiddleware.tokenVerification, userController.updateUserController);

module.exports = router;
