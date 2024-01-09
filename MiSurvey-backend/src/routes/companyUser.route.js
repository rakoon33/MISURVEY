const express = require('express');
const { companyUserController } = require('../controllers');
const { authMiddleware } = require('../middlewares');
const router = express.Router();

/**
 * @swagger
 * /api/companyusers:
 *   post:
 *     tags: [Company]
 *     summary: Create a new company user and associated user account (superadmin & admin & supervisor can use this API)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyUserData:
 *                 type: object
 *                 required:
 *                   - CompanyID
 *                   - CompanyRoleID
 *                 properties:
 *                   CompanyID:
 *                     type: integer
 *                     example: 123
 *                   CompanyRoleID:
 *                     type: integer
 *                     example: 456
 *               userData:
 *                 type: object
 *                 required:
 *                   - Username
 *                   - Email
 *                 properties:
 *                   Username:
 *                     type: string
 *                     example: 'john_doe'
 *                   Email:
 *                     type: string
 *                     format: email
 *                     example: 'john@example.com'
 *     responses:
 *       201:
 *         description: Company User and associated User account created successfully.
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
 *                   example: 'Company User and associated User account created successfully'
 *                 companyUser:
 *                   type: object
 *                   properties:
 *                     UserID:
 *                       type: integer
 *                       example: 789
 *                     CompanyID:
 *                       type: integer
 *                       example: 123
 *                     CompanyRoleID:
 *                       type: integer
 *                       example: 456
 *       400:
 *         description: Bad request, failed to create company user.
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
 *                   example: 'Error occurred while creating company user'
 *   get:
 *     tags: [Company]
 *     summary: Retrieve all company users (superadmin & admin & supervisor can use this API)
 *     responses:
 *       200:
 *         description: All Company Users fetched successfully.
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
 *                   example: 'All Company Users fetched successfully'
 *                 companyUsers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       UserID:
 *                         type: integer
 *                         example: 789
 *                       CompanyID:
 *                         type: integer
 *                         example: 123
 *                       CompanyRoleID:
 *                         type: integer
 *                         example: 456
 *                       User:
 *                         type: object
 *                         properties:
 *                           ... # Add User model properties here
 *                       Company:
 *                         type: object
 *                         properties:
 *                           ... # Add Company model properties here
 *                       CompanyRole:
 *                         type: object
 *                         properties:
 *                           ... # Add CompanyRole model properties here
 *       400:
 *         description: Bad request, failed to fetch company users.
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
 *                   example: 'Failed to fetch company users'
 */
router
    .route('/')
    .post(authMiddleware.tokenVerification, companyUserController.createCompanyUserController)
    .get(authMiddleware.tokenVerification, companyUserController.getAllCompanyUsersController);

/**
 * @swagger
 * /api/companyusers/{companyUserId}:
 *   delete:
 *     tags: [Company]
 *     summary: Delete a company user (superadmin & admin & supervisor can use this API)
 *     parameters:
 *       - in: path
 *         name: companyUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the company user
 *     responses:
 *       200:
 *         description: Company User deleted successfully.
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
 *                   example: 'Company User deleted successfully'
 *       400:
 *         description: Bad request, failed to delete company user.
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
 *                   example: 'Company User not found'
 *
 *   get:
 *     tags: [Company]
 *     summary: Retrieve a single company user (superadmin & admin & supervisor can use this API)
 *     parameters:
 *       - in: path
 *         name: companyUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the company user
 *     responses:
 *       200:
 *         description: Company User fetched successfully.
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
 *                   example: 'Company User fetched successfully'
 *                 companyUser:
 *                   type: object
 *                   properties:
 *                     UserID:
 *                       type: integer
 *                       example: 789
 *                     CompanyID:
 *                       type: integer
 *                       example: 123
 *                     CompanyRoleID:
 *                       type: integer
 *                       example: 456
 *                     User:
 *                       type: object
 *                       properties:
 *                         ... # Add User model properties here
 *                     Company:
 *                       type: object
 *                       properties:
 *                         ... # Add Company model properties here
 *                     CompanyRole:
 *                       type: object
 *                       properties:
 *                         ... # Add CompanyRole model properties here
 *       400:
 *         description: Bad request, failed to fetch company user.
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
 *                   example: 'Company User not found'
 */
router
    .route('/:companyUserId')
    .delete(authMiddleware.tokenVerification, companyUserController.deleteCompanyUserController)
    .get(authMiddleware.tokenVerification, companyUserController.getOneCompanyUserController);

module.exports = router;
