const express = require('express');
const { companyUserController } = require('../controllers');
const { authMiddleware } = require('../middlewares');
const router = express.Router();

/**
 * @swagger
 * /api/companyusers:
 *   post:
 *     tags: [Company]
 *     summary: Create a new company user and associated user account
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
 */
router
    .route('/')
    .post(authMiddleware.tokenVerification, companyUserController.createCompanyUserController)
    .get(authMiddleware.tokenVerification, companyUserController.getAllCompanyUsersController);

router
    .route('/:companyUserId')
    .delete(authMiddleware.tokenVerification, companyUserController.deleteCompanyUserController)
    .get(authMiddleware.tokenVerification, companyUserController.getOneCompanyUserController);

module.exports = router;
