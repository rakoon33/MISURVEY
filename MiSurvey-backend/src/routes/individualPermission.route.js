const express = require("express");
const { individualPermissionController } = require("../controllers");
const { authMiddleware } = require("../middlewares");
const router = express.Router();

/**
 * @swagger
 * /api/permissions/search/{companyUserId}:
 *   get:
 *     tags: [Permission]
 *     summary: Search individual permissions for a company user (only super admin can use this API)
 *     parameters:
 *       - in: path
 *         name: companyUserId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the company user to search permissions for.
 *     responses:
 *       200:
 *         description: Individual Permissions found.
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
 *                   example: 'Individual Permissions found'
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       PermissionID:
 *                         type: integer
 *                         example: 1
 *                       CompanyUserID:
 *                         type: integer
 *                         example: 123
 *                       ModuleID:
 *                         type: integer
 *                         example: 456
 *       500:
 *         description: Internal Server Error, failed to search individual permissions.
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
 *                   example: 'No matching individual permissions found'
 */
router
  .route("/search/:companyUserId")
  .get(
    authMiddleware.tokenVerification,
    authMiddleware.isSuperAdmin,
    individualPermissionController.searchIndividualPermissionsController
  );

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     tags: [Permission]
 *     summary: Create a new individual permission (only super admin can use this API)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CompanyUserID:
 *                 type: integer
 *                 example: 9
 *               ModuleID:
 *                 type: integer
 *                 example: 11
 *               CanView:
 *                 type: boolean
 *                 example: true
 *               CanAdd:
 *                 type: boolean
 *                 example: false
 *               CanUpdate:
 *                 type: boolean
 *                 example: true
 *               CanDelete:
 *                 type: boolean
 *                 example: false
 *               CanExport:
 *                 type: boolean
 *                 example: true
 *               CanViewData:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Individual Permission created successfully.
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
 *                   example: 'Individual Permission created successfully'
 *                 permission:
 *                   type: object
 *                   properties:
 *                     PermissionID:
 *                       type: integer
 *                       example: 789
 *                     CompanyUserID:
 *                       type: integer
 *                       example: 123
 *                     ModuleID:
 *                       type: integer
 *                       example: 456
 *       400:
 *         description: Bad request, failed to create the individual permission.
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
 *                   example: 'Error occurred while creating individual permission'
 *   get:
 *     tags: [Permission]
 *     summary: Retrieve all individual permissions (only super admin can use this API)
 *     responses:
 *       200:
 *         description: Individual Permissions fetched successfully.
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
 *                   example: 'Individual Permissions fetched successfully'
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       PermissionID:
 *                         type: integer
 *                         example: 1
 *                       CompanyUserID:
 *                         type: integer
 *                         example: 123
 *                       ModuleID:
 *                         type: integer
 *                         example: 456
 *                       CanView:
 *                         type: boolean
 *                         example: true
 *                       CanAdd:
 *                         type: boolean
 *                         example: false
 *       500:
 *         description: Internal Server Error, failed to fetch individual permissions.
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
 *                   example: 'No individual permissions found'
 */
router
  .route("/")
  .post(
    authMiddleware.tokenVerification,
    authMiddleware.isSuperAdmin,
    individualPermissionController.createIndividualPermissionController
  )
  .get(
    authMiddleware.tokenVerification,
    authMiddleware.isSuperAdmin,
    individualPermissionController.getAllIndividualPermissionsController
  );

/**
 * @swagger
 * /api/permissions/{companyUserId}/{moduleId}:
 *   delete:
 *     tags: [Permission]
 *     summary: Delete an individual permission (only super admin can use this API)
 *     parameters:
 *       - in: path
 *         name: companyUserId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the company user
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the module
 *     responses:
 *       200:
 *         description: Individual Permission deleted successfully.
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
 *                   example: 'Individual Permission deleted successfully'
 *       400:
 *         description: Bad request, failed to delete the individual permission.
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
 *                   example: 'Error occurred while deleting individual permission'
 *   get:
 *     tags: [Permission]
 *     summary: Retrieve a specific individual permission (only super admin can use this API)
 *     parameters:
 *       - in: path
 *         name: companyUserId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the company user
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the module
 *     responses:
 *       200:
 *         description: Individual Permission fetched successfully.
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
 *                   example: 'Individual Permission fetched successfully'
 *                 permission:
 *                   type: object
 *                   properties:
 *                     CompanyUserID:
 *                       type: integer
 *                       example: 123
 *                     ModuleID:
 *                       type: integer
 *                       example: 456
 *                     CanView:
 *                       type: boolean
 *                       example: true
 *                     CanAdd:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Bad request, failed to fetch the individual permission.
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
 *                   example: 'Individual Permission not found'
 *   put:
 *     tags: [Permission]
 *     summary: Update an individual permission (only super admin can use this API)
 *     parameters:
 *       - in: path
 *         name: companyUserId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the company user
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the module
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CanView:
 *                 type: boolean
 *                 example: true
 *               CanAdd:
 *                 type: boolean
 *                 example: false
 *               CanUpdate:
 *                 type: boolean
 *                 example: true
 *               CanDelete:
 *                 type: boolean
 *                 example: false
 *               CanExport:
 *                 type: boolean
 *                 example: true
 *               CanViewData:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Individual Permission updated successfully.
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
 *                   example: 'Individual Permission updated successfully'
 *       400:
 *         description: Bad request, failed to update the individual permission.
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
 *                   example: 'No individual permission updated'
 */
router
  .route("/:companyUserId/:moduleId")
  .delete(
    authMiddleware.tokenVerification,
    authMiddleware.isSuperAdmin,
    individualPermissionController.deleteIndividualPermissionController
  )
  .get(
    authMiddleware.tokenVerification,
    authMiddleware.isSuperAdmin,
    individualPermissionController.getOneIndividualPermissionController
  )
  .put(
    authMiddleware.tokenVerification,
    authMiddleware.isSuperAdmin,
    individualPermissionController.updateIndividualPermissionController
  );

module.exports = router;
