const express = require('express');
const { companyRoleController } = require('../controllers');
const { authMiddleware } = require('../middlewares');
const router = express.Router();

/**
 * @swagger
 * /api/companyRoles/searchCompanyRoles:
 *   get:
 *     tags:
 *       - Company
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         type: string
 *         description: Name of the company role to search for.
 *     responses:
 *       200:
 *         description: Company roles retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates if the search was successful
 *                 message:
 *                   type: string
 *                   example: 'Company role fetched successfully'
 *                   description: Describes the outcome of the operation
 *                 companyroles:
 *                   type: array
 *                   description: An array of company roles matching the search query
 *                   items:
 *                     type: object
 *                     properties:
 *                       CompanyRoleID:
 *                         type: integer
 *                         example: 1
 *                         description: Unique identifier for the company role
 *                       CompanyRoleName:
 *                         type: string
 *                         example: 'Admin'
 *                         description: Name of the company role
 *                       CompanyRoleDescription:
 *                         type: string
 *                         example: 'Handles management tasks'
 *                         description: Description of the company role
 *                       CreatedAt:
 *                         type: string
 *                         example: '2023-12-04T17:39:56.000Z'
 *                         description: Timestamp when the company role was created
 *                       CreatedBy:
 *                         type: integer
 *                         example: 1
 *                         description: Identifier of the user who created the company role
 *                       UpdatedAt:
 *                         type: string
 *                         example: '2023-12-04T17:39:56.000Z'
 *                         description: Timestamp when the company role was last updated
 *                       UpdatedBy:
 *                         type: integer
 *                         example: 1
 *                         description: Identifier of the user who last updated the company role
 *       400:
 *         description: Bad request, failed to search company roles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                   description: Indicates if the search was unsuccessful
 *                 message:
 *                   type: string
 *                   example: 'Required data missing or invalid data was sent. Check the request and try again.'
 *                   description: Describes the error or reason for failure
 */
router
    .route('/searchCompanyRoles')
    .get(authMiddleware.tokenVerification, companyRoleController.searchCompanyRolesController);


router
    .route('/')
    .post(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyRoleController.createCompanyRoleController)
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyRoleController.getAllCompanyRolesController);

router
    .route('/:CompanyRoleID')
    .delete(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyRoleController.deleteCompanyRoleController)
    .put(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyRoleController.updateCompanyRoleController)
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyRoleController.getOneCompanyRoleController);

module.exports = router;
