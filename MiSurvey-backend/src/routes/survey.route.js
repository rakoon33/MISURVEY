const express = require("express");
const { surveyController } = require("../controllers");
const { authMiddleware, cls } = require("../middlewares");

const router = express.Router();

/**
 * @swagger
 * /api/survey:
 *   post:
 *     tags: [Survey]
 *     summary: Create a new survey (admin & supervisor can use this API)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: integer
 *                 example: 2
 *               CompanyID:
 *                 type: integer
 *                 example: 1
 *               Title:
 *                 type: string
 *                 example: 'Employee Engagement Survey2'
 *               SurveyDescription:
 *                 type: string
 *                 example: 'A survey to understand employee engagement levels.'
 *               SurveyImages:
 *                 type: string
 *                 example: 'abc'
 *               InvitationMethod:
 *                 type: string
 *                 example: 'Email'
 *               SurveyStatus:
 *                 type: string
 *                 example: 'Open'
 *               Customizations:
 *                 type: object
 *                 properties:
 *                   topBarColor:
 *                     type: string
 *                     example: '#BA3232'
 *                   buttonTextColor:
 *                     type: string
 *                     example: '#2f3c54'
 *                   thanksMessage:
 *                     type: string
 *                     example: 'Cam on'
 *               CreatedBy:
 *                 type: integer
 *                 example: 2
 *               Approve:
 *                 type: string
 *                 example: 'Yes'
 *               SurveyQuestions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     QuestionText:
 *                       type: string
 *                       example: 'How satisfied are you with your current role?'
 *                     QuestionType:
 *                       type: integer
 *                       example: 1
 *                     PageOrder:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       200:
 *         description: Survey created successfully.
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
 *                   example: 'Survey created successfully'
 *                 survey:
 *                   type: object
 *                   properties:
 *                     SurveyID:
 *                       type: integer
 *                       example: 1
 *                     Title:
 *                       type: string
 *                       example: 'Employee Engagement Survey2'
 *                     SurveyDescription:
 *                       type: string
 *                       example: 'A survey to understand employee engagement levels.'
 *                     SurveyImages:
 *                       type: string
 *                       example: 'abc'
 *                     InvitationMethod:
 *                       type: string
 *                       example: 'Email'
 *                     SurveyStatus:
 *                       type: string
 *                       example: 'Open'
 *                     Customizations:
 *                       type: object
 *                       properties:
 *                         topBarColor:
 *                           type: string
 *                           example: '#BA3232'
 *                         buttonTextColor:
 *                           type: string
 *                           example: '#2f3c54'
 *                         thanksMessage:
 *                           type: string
 *                           example: 'Cam on'
 *                     CreatedBy:
 *                       type: integer
 *                       example: 2
 *                     Approve:
 *                       type: string
 *                       example: 'Yes'
 *       400:
 *         description: Bad request, failed to create the survey.
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
 *                   example: 'Error occurred while creating survey'
 *
 *   get:
 *     tags: [Survey]
 *     summary: Retrieve all surveys (admin & supervisor can use this API)
 *     responses:
 *       200:
 *         description: Surveys fetched successfully.
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
 *                   example: 'Surveys fetched successfully'
 *                 surveys:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       SurveyID:
 *                         type: integer
 *                         example: 1
 *                       Title:
 *                         type: string
 *                         example: 'Customer Satisfaction Survey'
 *                       SurveyDescription:
 *                         type: string
 *                         example: 'This survey is intended to understand customer satisfaction levels.'
 *                       SurveyLink:
 *                         type: string
 *                         example: 'https://example.com/survey/link'
 *                       SurveyStatus:
 *                         type: string
 *                         example: 'Active'
 *       400:
 *         description: Bad request, failed to fetch surveys.
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
 *                   example: 'Error occurred while fetching surveys'
 */
router
  .route("/")
  .post(
    authMiddleware.tokenVerification,
    surveyController.createSurveyController
  )
  .get(
    authMiddleware.tokenVerification,
    surveyController.getAllSurveyController
  );

/**
 * @swagger
 * /api/survey/searchSurveys:
 *   get:
 *     tags: [Survey]
 *     summary: Search for surveys (superadmin & admin & supervisor can use this APU)
 *     parameters:
 *       - in: query
 *         name: column
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Title, SurveyDescription, InvitationMethod, Title]
 *         description: The column to search in.
 *       - in: query
 *         name: searchTerm
 *         required: true
 *         schema:
 *           type: string
 *         description: The search term to look for in the specified column.
 *     responses:
 *       200:
 *         description: Search completed successfully.
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
 *                     type: object
 *                     properties:
 *                       SurveyID:
 *                         type: integer
 *                         example: 1
 *                       Title:
 *                         type: string
 *                         example: 'Customer Feedback'
 *                       SurveyDescription:
 *                         type: string
 *                         example: 'Survey to collect customer feedback on our services.'
 *       400:
 *         description: Bad request, both column and searchTerm are required as query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Both column and searchTerm are required as query parameters.'
 *       500:
 *         description: Internal Server Error, failed to search surveys.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to search surveys.'
 */
router
  .route("/searchSurveys")
  .get(
    authMiddleware.tokenVerification,
    surveyController.searchSurveyController
  );

router
  .route("/send")
  .post(
    authMiddleware.tokenVerification,
    surveyController.sendSurveyEmailController
  );

/**
 * @swagger
 * /api/survey/c/f/{SurveyLink}:
 *   get:
 *     tags: [Survey]
 *     summary: Retrieve a survey by its unique link (superadmin & admin & supervisor can use this API)
 *     parameters:
 *       - in: path
 *         name: SurveyLink
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique link identifier for the survey.
 *     responses:
 *       200:
 *         description: Survey retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 survey:
 *                   type: object
 *                   properties:
 *                     Title:
 *                       type: string
 *                       example: 'Customer Satisfaction Survey'
 *                     Customizations:
 *                       type: object
 *                       properties:
 *                         Color:
 *                           type: string
 *                           example: '#FF5733'
 *                         FontSize:
 *                           type: integer
 *                           example: 12
 *                     SurveyQuestions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           QuestionText:
 *                             type: string
 *                             example: 'How satisfied are you with our service?'
 *       400:
 *         description: Bad request, failed to retrieve the survey.
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
 *                   example: 'Survey not found'
 */
router
  .route("/c/f/:SurveyLink")
  .get(
    surveyController.getOneSurveyWithDataByLinkController
  );

/**
 * @swagger
 * /api/survey/detail/{SurveyID}:
 *   get:
 *     tags: [Survey]
 *     summary: Retrieve a survey by its ID (superadmin & admin & supervisor can use this API)
 *     parameters:
 *       - in: path
 *         name: SurveyID
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier for the survey.
 *     responses:
 *       200:
 *         description: Survey retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 survey:
 *                   type: object
 *                   properties:
 *                     SurveyID:
 *                       type: integer
 *                       example: 1
 *                     Title:
 *                       type: string
 *                       example: 'Customer Satisfaction Survey'
 *                     SurveyDescription:
 *                       type: string
 *                       example: 'This survey is intended to understand customer satisfaction levels.'
 *       400:
 *         description: Bad request, failed to retrieve the survey.
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
 *                   example: 'Survey not found'
 */
router
  .route("/detail/:SurveyID")
  .get(
    authMiddleware.tokenVerification,
    surveyController.getOneSurveyWithoutDataController
  );

/**
 * @swagger
 * /api/survey/{SurveyID}:
 *   get:
 *     tags: [Survey]
 *     summary: Retrieve a survey with its associated data by ID (superadmin & admin & supervisor can use this API)
 *     parameters:
 *       - in: path
 *         name: SurveyID
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier for the survey.
 *     responses:
 *       200:
 *         description: Survey with data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 survey:
 *                   type: object
 *                   properties:
 *                     SurveyID:
 *                       type: integer
 *                       example: 1
 *                     Title:
 *                       type: string
 *                       example: 'Customer Satisfaction Survey'
 *                     Customizations:
 *                       type: object
 *                       properties:
 *                         Color:
 *                           type: string
 *                           example: '#FF5733'
 *                         FontSize:
 *                           type: integer
 *                           example: 12
 *                     SurveyQuestions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           QuestionID:
 *                             type: integer
 *                             example: 10
 *                           QuestionText:
 *                             type: string
 *                             example: 'How satisfied are you with our service?'
 *       400:
 *         description: Bad request, failed to retrieve the survey with data.
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
 *                   example: 'Survey not found'
 *   put:
 *     tags: [Survey]
 *     summary: Update a survey (superadmin & admin & supervisor can use this API)
 *     parameters:
 *       - in: path
 *         name: SurveyID
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier for the survey.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - UserID
 *               - CompanyID
 *               - Title
 *               - SurveyDescription
 *               - InvitationMethod
 *               - SurveyStatus
 *               - CreatedBy
 *               - Approve
 *               - SurveyQuestions
 *             properties:
 *               UserID:
 *                 type: integer
 *                 example: 2
 *               CompanyID:
 *                 type: integer
 *                 example: 1
 *               Title:
 *                 type: string
 *                 example: 'editnew2 Employee Engagement Survey'
 *               SurveyDescription:
 *                 type: string
 *                 example: 'editnew2 A survey to understand employee engagement levels.'
 *               InvitationMethod:
 *                 type: string
 *                 example: 'Email'
 *               SurveyStatus:
 *                 type: string
 *                 example: 'Open'
 *               Customizations:
 *                 type: object
 *                 properties:
 *                   color:
 *                     type: string
 *                     example: 'blue'
 *                   fontStyle:
 *                     type: string
 *                     example: 'Arial'
 *                   logoUrl:
 *                     type: string
 *                     example: 'https://example.com/logo.png'
 *               CreatedBy:
 *                 type: integer
 *                 example: 2
 *               Approve:
 *                 type: string
 *                 example: 'Yes'
 *               SurveyQuestions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     QuestionID:
 *                       type: integer
 *                       example: 96
 *                     QuestionText:
 *                       type: string
 *                       example: 'How satisfied are you with your current role?'
 *                     QuestionType:
 *                       type: integer
 *                       example: 2
 *                     PageOrder:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       200:
 *         description: Survey updated successfully.
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
 *                   example: 'Survey updated successfully'
 *       400:
 *         description: Bad request, failed to update the survey.
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
 *                   example: 'Error occurred while updating survey'
 *   delete:
 *     tags: [Survey]
 *     summary: Delete a survey (superadmin & admin & supervisor can use this API)
 *     parameters:
 *       - in: path
 *         name: SurveyID
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the survey to be deleted.
 *     responses:
 *       200:
 *         description: Survey deleted successfully.
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
 *                   example: 'Survey deleted successfully'
 *       400:
 *         description: Bad request, failed to delete the survey.
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
 *                   example: 'Error occurred while deleting survey'
 */

router.route('/summary/:surveyID/')
  .get(
    authMiddleware.tokenVerification, 
    surveyController.getSurveySummaryController
  );
  
  router
  .route("/summary-response/:responseID")
  .get(
    authMiddleware.tokenVerification,
    surveyController.getSurveyDetailsByResponseIdController
  );
  
router
  .route("/:SurveyID")
  .get(
    authMiddleware.tokenVerification,
    surveyController.getOneSurveyWithDataController
  )
  .put(
    authMiddleware.tokenVerification,
    surveyController.updateSurveyController
  )
  .delete(
    authMiddleware.tokenVerification,
    surveyController.deleteSurveyController
  );

module.exports = router;
