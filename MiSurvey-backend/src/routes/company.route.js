const express = require('express');
const { companyController } = require('../controllers');
const { authMiddleware } = require('../middlewares');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Company
 * /api/companies/companyProfile:
 *   get:
 *     summary: Retrieve the company profile
 *     tags: [Company]
 *     responses:
 *       200:
 *         description: Company profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyProfile'
 *       400:
 *         description: Bad request, failed to retrieve company profile due to client-side error.
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
 *                   example: 'Required data missing or invalid data was sent. Check the request and try again.'
 *                 '*errorDetails':
 *                   type: object
 *                   additionalProperties: true
 *                   description: 'Detailed information about the error(s) that occurred, which may include validation issues.'
 * components:
 *   schemas:
 *     CompanyProfile:
 *       type: object
 *       required:
 *         - CompanyID
 *         - CompanyName
 *       properties:
 *         CompanyID:
 *           type: integer
 *           description: Unique identifier for the company.
 *         CompanyName:
 *           type: string
 *           description: Name of the company.
 */
router
    .route('/companyProfile')
    .get(authMiddleware.tokenVerification, companyController.getCompanyProfileController)

/**
 * @swagger
 * tags:
 *   - name: Company
 * /api/companies/companyProfile/{CompanyID}:
 *   put:
 *     summary: Update a specific company's profile
 *     tags:
 *       - Company
 *     parameters:
 *       - in: path
 *         name: CompanyID
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the company to update
 *     requestBody:
 *       required: true
 *       description: JSON object containing the fields to update for the company
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CompanyName:
 *                 type: string
 *                 description: Updated name of the company
 *               CompanyDomain:
 *                 type: string
 *                 description: Updated domain of the company
 *               CreatedAt:
 *                 type: string
 *                 description: Updated created date of the company 
 *               AdminID:
 *                 type: integer
 *                 description: Updated AdminID that exists in Users table and has a role of Admin
 *     responses:
 *       200:
 *         description: Company updated successfully
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
 *                   example: Company updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Bad request, failed to update company profile due to invalid input
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
 *                   example: "Invalid input parameters or malformed syntax."
 */
router
    .route('/companyProfile/:CompanyID')
    .put(authMiddleware.tokenVerification, companyController.updateCompanyController); // chưa xài

/**
 * @swagger
 * /api/companies/searchCompanies:
 *   get:
 *     summary: Search for companies
 *     tags: [Company]
 *     parameters:
 *       - in: query
 *         name: companyName
 *         schema:
 *           type: string
 *         required: false
 *         description: Partial or full company name to search for
 *       - in: query
 *         name: adminID
 *         schema:
 *           type: integer
 *         required: false
 *         description: Admin ID to filter the companies by
 *     responses:
 *       200:
 *         description: List of companies matching search criteria
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
 *                   example: Companies fetched successfully
 *                 companies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 *       400:
 *         description: Bad request, failed to process search due to an error
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
 *                   example: Error message describing the reason for failure
 */
router
    .route('/searchCompanies')
    .get(authMiddleware.tokenVerification, companyController.searchCompanyController);

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: API for managing companies
 * 
 * /api/companies:
 *   get:
 *     summary: Get a list of all companies
 *     tags: [Company]
 *     responses:
 *       200:
 *         description: A list of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *       400:
 *         description: The request was invalid or cannot be served. The exact error message will be provided in the response body.
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
 *                   example: "Invalid request parameters. Please check your request and try again."
 * 
 *   post:
 *     summary: Create a new company
 *     tags: [Company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: Company created successfully by SuperAdmin
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
 *                   example: Company created successfully by SuperAdmin
 *                 data:
 *                   type: object
 *                   properties:
 *                     CreatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-02T18:16:08.363Z"
 *                       description: The timestamp when the company was created
 *                     CompanyID:
 *                       type: integer
 *                       example: 5
 *                       description: Unique identifier for the company
 *                     CompanyName:
 *                       type: string
 *                       example: "nhuphans344"
 *                       description: Name of the company
 *                     CompanyDomain:
 *                       type: string
 *                       example: "nhuphan123453r4633@gmail.com"
 *                       description: Domain of the company
 *                     AdminID:
 *                       type: string
 *                       example: "5"
 *                       description: Identifier for the admin user of the company
 *       400:
 *         description: Bad request, failed to create company due to invalid input
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
 *                   example: "Invalid input data provided for creating company"
 *                 error:
 *                   type: string
 *                   description: Detailed error message from the server
 * 
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - CompanyName
 *         - AdminID
 *       properties:
 *         CompanyID:
 *           type: integer
 *           description: Unique identifier for the company
 *         CompanyLogo:
 *           type: string
 *           description: URL to the company's logo
 *         CompanyName:
 *           type: string
 *           description: Name of the company
 *         CompanyDomain:
 *           type: string
 *           description: Domain of the company
 *         CreatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the company was created
 *         AdminID:
 *           type: integer
 *           description: Unique identifier of the admin user
 */
router.route('/')
    .get(authMiddleware.tokenVerification, companyController.getAllCompaniesController)
    .post(authMiddleware.tokenVerification, companyController.createCompanyController);

/**
 * @swagger
 * /api/companies/{CompanyID}:
 *   delete:
 *     summary: Delete a specific company
 *     tags:
 *       - Company
 *     parameters:
 *       - in: path
 *         name: CompanyID
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the company to be deleted
 *     responses:
 *       200:
 *         description: Company deleted successfully
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
 *                   example: Company deleted successfully
 *       400:
 *         description: Bad request, deletion failed due to invalid CompanyID or other related data issues
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
 *                   example: "CompanyID is invalid or related survey details could not be deleted."
 * 
 *   get:
 *     summary: Retrieve a specific company's profile
 *     tags:
 *       - Company
 *     parameters:
 *       - in: path
 *         name: CompanyID
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the company to retrieve
 *     responses:
 *       200:
 *         description: Company profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Bad request, failed to fetch company profile due to invalid CompanyID
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
 *                   example: "Invalid CompanyID provided or company does not exist."
 * 
 *   put:
 *     summary: Update the details of an existing company
 *     tags:
 *       - Company
 *     parameters:
 *       - in: path
 *         name: CompanyID
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CompanyName:
 *                 type: string
 *                 description: Updated name of the company
 *               CompanyDomain:
 *                 type: string
 *                 description: Updated domain of the company
 *               AdminID:
 *                 type: integer
 *                 description: Updated identifier for the admin of the company
 *               # Add other updatable fields here
 *             example:
 *               CompanyName: "New Company Name"
 *               CompanyDomain: "newcompanydomain.com"
 *               AdminID: 2
 *     responses:
 *       200:
 *         description: Company updated successfully
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
 *                   example: "Company updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Bad request, could not update company due to invalid data or other error
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
 *                   example: "Invalid data provided or company does not exist."
 */
router
    .route('/:CompanyID')
    .delete(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyController.deleteCompanyController)
    .get(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyController.getOneCompanyController)
    .put(authMiddleware.tokenVerification, authMiddleware.isSuperAdmin, companyController.updateCompanyController);

module.exports = router;