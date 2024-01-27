const express = require("express");
const { moduleController } = require("../controllers");
const { authMiddleware } = require("../middlewares");
const router = express.Router();

/**
 * @swagger
 * /api/modules/searchModules:
 *   get:
 *     tags: [Module]
 *     summary: Search for companies (superadmin & admin & supervisor can use this API)
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the module to search for.
 *     responses:
 *       200:
 *         description: Modules fetched successfully.
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
 *                   example: 'Modules fetched successfully'
 *                 modules:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ModuleID:
 *                         type: integer
 *                         example: 1
 *                       ModuleName:
 *                         type: string
 *                         example: 'Finance Module'
 *       400:
 *         description: Bad request, failed to search modules.
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
 *                   example: 'No modules found'
 */
router
  .route('/searchModules')
  .get(authMiddleware.tokenVerification, 
      moduleController.searchModulesController
  );

/**
 * @swagger
 * /api/modules:
 *   get:
 *     tags: [Module]
 *     summary: Retrieve all modules (only super admin can use this API)
 *     responses:
 *       200:
 *         description: Modules fetched successfully.
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
 *                   example: 'Modules fetched successfully'
 *                 modules:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ModuleID:
 *                         type: integer
 *                         example: 1
 *                       ModuleName:
 *                         type: string
 *                         example: 'Finance Module'
 *       400:
 *         description: Bad request, failed to fetch modules.
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
 *                   example: 'Error occurred while fetching modules'
 *   post:
 *     tags: [Module]
 *     summary: Create a new module (only super admin can use this API)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ModuleName:
 *                 type: string
 *                 example: 'Finance Module'
 *               Description:
 *                 type: string
 *                 example: 'Module for managing financial operations'
 *     responses:
 *       200:
 *         description: Module created successfully.
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
 *                   example: 'Module created successfully'
 *                 module:
 *                   type: object
 *                   properties:
 *                     ModuleID:
 *                       type: integer
 *                       example: 1
 *                     ModuleName:
 *                       type: string
 *                       example: 'Finance Module'
 *       400:
 *         description: Bad request, failed to create the module.
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
 *                   example: 'Error occurred while creating module'
 */
router
  .route('/')
  .get(
      authMiddleware.tokenVerification, 
      authMiddleware.isSuperAdmin, 
      moduleController.getAllModulesController
  )
  .post(
      authMiddleware.tokenVerification, 
      authMiddleware.isSuperAdmin, 
      moduleController.createModuleController
  );

/**
 * @swagger
 * /api/modules/{ModuleID}:
 *   delete:
 *     tags: [Module]
 *     summary: Delete a module (only super admin can use this API)
 *     parameters:
 *       - in: path
 *         name: ModuleID
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the module to be deleted.
 *     responses:
 *       200:
 *         description: Module deleted successfully.
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
 *                   example: 'Module deleted successfully'
 *       400:
 *         description: Bad request, failed to delete the module.
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
 *                   example: 'Error occurred while deleting module'
 *   get:
 *     tags: [Module]
 *     summary: Retrieve a single module (only super admin can use this API)
 *     parameters:
 *       - in: path
 *         name: ModuleID
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the module to be retrieved.
 *     responses:
 *       200:
 *         description: Module fetched successfully.
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
 *                   example: 'Module fetched successfully'
 *                 module:
 *                   type: object
 *                   properties:
 *                     ModuleID:
 *                       type: integer
 *                       example: 1
 *                     ModuleName:
 *                       type: string
 *                       example: 'Finance Module'
 *       400:
 *         description: Bad request, failed to fetch the module.
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
 *                   example: 'Module not found'
 *   put:
 *     tags: [Module]
 *     summary: Update a module (only super admin can use this API)
 *     parameters:
 *       - in: path
 *         name: ModuleID
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the module to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ModuleName:
 *                 type: string
 *                 example: 'Updated Finance Module'
 *               Description:
 *                 type: string
 *                 example: 'Updated description for the finance module'
 *     responses:
 *       200:
 *         description: Module updated successfully.
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
 *                   example: 'Module updated successfully'
 *       400:
 *         description: Bad request, failed to update the module.
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
 *                   example: 'Error occurred while updating module'
 */
router
  .route("/:ModuleID")
  .delete(
    authMiddleware.tokenVerification,
    authMiddleware.isSuperAdmin,
    moduleController.deleteModuleController
  )
  .get(
    authMiddleware.tokenVerification,
    authMiddleware.isSuperAdmin,
    moduleController.getOneModuleController
  )
  .put(
    authMiddleware.tokenVerification,
    authMiddleware.isSuperAdmin,
    moduleController.updateModuleController
  );

module.exports = router;