const express = require("express");
const { companyRoleController } = require("../controllers");
const { authMiddleware } = require("../middlewares");
const router = express.Router();

/**
 * @swagger
 * /api/companyRoles/searchCompanyRoles:
 *   get:
 *     tags:
 *       - Company
 *     summary: Search for company roles (superadmin & admin & supervisor can use this API)
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
  .route("/searchCompanyRoles")
  .get(
    authMiddleware.tokenVerification,
    companyRoleController.searchCompanyRolesController
  );

/**
 * @swagger
 * /api/companyRoles:
 *   post:
 *     tags: [Company]
 *     summary: Create a new company role with permissions (only superadmin can use this API)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleData:
 *                 type: object
 *                 required:
 *                   - CompanyRoleName
 *                   - CompanyRoleDescription
 *                 properties:
 *                   CompanyRoleName:
 *                     type: string
 *                     example: 'Manager2'
 *                   CompanyRoleDescription:
 *                     type: string
 *                     example: 'Managers have the ability to oversee and manage operations.'
 *               permissionsData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - ModuleID
 *                     - CanView
 *                     - CanAdd
 *                     - CanUpdate
 *                     - CanDelete
 *                     - CanExport
 *                     - CanViewData
 *                   properties:
 *                     ModuleID:
 *                       type: integer
 *                       example: 1
 *                     CanView:
 *                       type: boolean
 *                       example: true
 *                     CanAdd:
 *                       type: boolean
 *                       example: true
 *                     CanUpdate:
 *                       type: boolean
 *                       example: true
 *                     CanDelete:
 *                       type: boolean
 *                       example: true
 *                     CanExport:
 *                       type: boolean
 *                       example: true
 *                     CanViewData:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       200:
 *         description: Company Role and Role Permissions created successfully.
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
 *                   example: 'Company Role and Role Permissions created successfully.'
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: object
 *                       properties:
 *                         CompanyRoleID:
 *                           type: integer
 *                           example: 1
 *                         CompanyRoleName:
 *                           type: string
 *                           example: 'Manager2'
 *                         CompanyRoleDescription:
 *                           type: string
 *                           example: 'Managers have the ability to oversee and manage operations.'
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           ModuleID:
 *                             type: integer
 *                             example: 1
 *                           CanView:
 *                             type: boolean
 *                             example: true
 *                           CanAdd:
 *                             type: boolean
 *                             example: true
 *                           CanUpdate:
 *                             type: boolean
 *                             example: true
 *                           CanDelete:
 *                             type: boolean
 *                             example: true
 *                           CanExport:
 *                             type: boolean
 *                             example: true
 *                           CanViewData:
 *                             type: boolean
 *                             example: true
 *       400:
 *         description: Bad request, failed to create company role and permissions.
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
 *                   example: 'Company Role creation failed.'
 *                 error:
 *                   type: string
 *                   example: 'Error details string.'
 *   get:
 *     tags: [Company]
 *     summary: Get all company roles (only superadmin can use this APU)
 *     responses:
 *       200:
 *         description: Company Roles fetched successfully.
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
 *                   example: 'Company Roles fetched successfully'
 *                 data:
 *                   type: object
 *                   properties:
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           CompanyRoleID:
 *                             type: integer
 *                             example: 1
 *                           CompanyRoleName:
 *                             type: string
 *                             example: 'Admin'
 *                           CompanyRoleDescription:
 *                             type: string
 *                             example: 'Handles management tasks'
 *                           CreatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: '2021-01-01T00:00:00.000Z'
 *                           CreatedBy:
 *                             type: integer
 *                             example: 1
 *                           UpdatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: '2021-01-02T00:00:00.000Z'
 *                           UpdatedBy:
 *                             type: integer
 *                             example: 2
 *       400:
 *         description: Bad request, failed to fetch company roles.
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
 *                   example: 'Failed to fetch company roles'
 *                 error:
 *                   type: string
 *                   example: 'Error details string.'
 */
router
  .route("/")
  .post(
    authMiddleware.tokenVerification,
    companyRoleController.createCompanyRoleController
  )
  .get(
    authMiddleware.tokenVerification,
    companyRoleController.getAllCompanyRolesController
  );

/**
 * @swagger
 * /api/companyRoles/{CompanyRoleID}:
 *   delete:
 *     tags: [Company]
 *     summary: Delete a company role (only superadmin can use this API)
 *     parameters:
 *       - in: path
 *         name: CompanyRoleID
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the company role to be deleted
 *     responses:
 *       200:
 *         description: Company Role and its permissions deleted successfully.
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
 *                   example: 'Company Role and its permissions deleted successfully.'
 *       400:
 *         description: Bad request, failed to delete company role.
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
 *                   example: 'Company Role deletion failed'
 *                 error:
 *                   type: string
 *                   example: 'Error details string.'
 *
 *   put:
 *     tags: [Company]
 *     summary: Update a company role and its permissions (only superadmin can use this API)
 *     parameters:
 *       - in: path
 *         name: CompanyRoleID
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the company role to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleData:
 *                 type: object
 *                 properties:
 *                   CompanyRoleName:
 *                     type: string
 *                     example: 'Manager'
 *                   CompanyRoleDescription:
 *                     type: string
 *                     example: 'Manages company operations and policies'
 *               permissionsData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ModuleID:
 *                       type: integer
 *                       example: 2
 *                     CanView:
 *                       type: boolean
 *                       example: true
 *                     CanAdd:
 *                       type: boolean
 *                       example: false
 *                     CanUpdate:
 *                       type: boolean
 *                       example: true
 *                     CanDelete:
 *                       type: boolean
 *                       example: false
 *     responses:
 *       200:
 *         description: Company Role and Permissions updated successfully.
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
 *                   example: 'Company Role and Permissions updated successfully.'
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: object
 *                       properties:
 *                         CompanyRoleID:
 *                           type: integer
 *                           example: 1
 *                         CompanyRoleName:
 *                           type: string
 *                           example: 'Admin'
 *                         CompanyRoleDescription:
 *                           type: string
 *                           example: 'Handles management tasks'
 *                         CreatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: '2021-01-01T00:00:00.000Z'
 *                         CreatedBy:
 *                           type: integer
 *                           example: 1
 *                         UpdatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: '2021-01-02T00:00:00.000Z'
 *                         UpdatedBy:
 *                           type: integer
 *                           example: 2
 *       400:
 *         description: Bad request, missing roleData or permissionsData.
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
 *                   example: 'roleData and permissionsData are required.'
 *   get:
 *     tags: [Company]
 *     summary: Get a single company role and its permissions (only superadmin can use this API)
 *     parameters:
 *       - in: path
 *         name: CompanyRoleID
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the company role to be retrieved
 *     responses:
 *       200:
 *         description: Company Role and its permissions fetched successfully.
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
 *                   example: 'Company Role and its permissions fetched successfully.'
 *                 data:
 *                   type: object
 *                   properties:
 *                     CompanyRoleID:
 *                       type: integer
 *                       example: 1
 *                     CompanyRoleName:
 *                       type: string
 *                       example: 'Admin'
 *                     CompanyRoleDescription:
 *                       type: string
 *                       example: 'Handles management tasks'
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           PermissionID:
 *                             type: integer
 *                             example: 101
 *                           PermissionName:
 *                             type: string
 *                             example: 'create_user'
 *                           PermissionDescription:
 *                             type: string
 *                             example: 'Allows creating a new user'
 *       400:
 *         description: Bad request, failed to retrieve company role.
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
 *                   example: 'Company Role not found'
 */
router
  .route("/:CompanyRoleID")
  .delete(
    authMiddleware.tokenVerification,
    companyRoleController.deleteCompanyRoleController
  )
  .put(
    authMiddleware.tokenVerification,
    companyRoleController.updateCompanyRoleController
  )
  .get(
    authMiddleware.tokenVerification,
    companyRoleController.getOneCompanyRoleController
  );

module.exports = router;
