const express = require("express");
const { surveyResponseController } = require("../controllers");
const { authMiddleware } = require("../middlewares");

const router = express.Router();

router
  .route("/count/:surveyID")
  .get(surveyResponseController.getSurveyResponseCountController);



/**
 * @swagger
 * /api/responses:
 *   post:
 *     tags: [Survey Responses]
 *     summary: Submit survey responses with optional customer information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FirstName:
 *                 type: string
 *                 description: Customer's first name.
 *                 example: 'ABC'
 *               LastName:
 *                 type: string
 *                 description: Customer's last name.
 *                 example: 'DEF'
 *               Email:
 *                 type: string
 *                 description: Customer's email address.
 *                 example: 'abcdef@email.com'
 *               PhoneNumber:
 *                 type: string
 *                 description: Customer's phone number.
 *                 example: '012345678'
 *               Address:
 *                 type: string
 *                 description: Customer's address.
 *                 example: '124 no street'
 *               SurveyResponses:
 *                 type: array
 *                 description: Array of survey responses.
 *                 items:
 *                   type: object
 *                   properties:
 *                     SurveyID:
 *                       type: integer
 *                       description: ID of the survey being responded to.
 *                       example: 32
 *                     QuestionID:
 *                       type: integer
 *                       description: ID of the survey question being answered.
 *                       example: 79
 *                     ResponseValue:
 *                       type: string
 *                       description: The value of the response.
 *                       example: '8'
 *     responses:
 *       200:
 *         description: Survey responses submitted successfully.
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
 *                   example: 'Survey responses submitted successfully'
 *       400:
 *         description: Bad request, failed to submit survey responses.
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
 *                   example: 'Error occurred while submitting survey responses'
 */
router
  .route("/")
  .post(
    surveyResponseController.createSurveyResponseController
  );

/**
 * @swagger
 * /api/responses/all/{surveyID}:
 *   get:
 *     tags: [Survey Responses]
 *     summary: Retrieve all responses for a specific survey
 *     parameters:
 *       - in: path
 *         name: surveyID
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the survey for which responses are being retrieved.
 *     responses:
 *       200:
 *         description: Successfully retrieved all responses for the survey.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 responses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ResponseID:
 *                         type: integer
 *                         example: 1
 *                       SurveyID:
 *                         type: integer
 *                         example: 1
 *                       SurveyQuestion:
 *                         type: object
 *                         properties:
 *                           QuestionID:
 *                             type: integer
 *                             example: 10
 *                           QuestionText:
 *                             type: string
 *                             example: 'How satisfied are you with our service?'
 *                           SurveyType:
 *                             type: object
 *                             properties:
 *                               TypeID:
 *                                 type: integer
 *                                 example: 1
 *                               TypeName:
 *                                 type: string
 *                                 example: 'Multiple Choice'
 *       400:
 *         description: Bad request, failed to retrieve survey responses.
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
 *                   example: 'No responses found for this survey'
 */
router
  .route("/all/:surveyID")
  .get(
    authMiddleware.tokenVerification,
    surveyResponseController.getAllResponseController
  );

/**
 * @swagger
 * /api/responses/{responseID}:
 *   get:
 *     tags: [Survey Responses]
 *     summary: Retrieve a single survey response
 *     parameters:
 *       - in: path
 *         name: responseID
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the survey response to retrieve.
 *     responses:
 *       200:
 *         description: Survey response retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 response:
 *                   type: object
 *                   properties:
 *                     ResponseID:
 *                       type: integer
 *                       example: 1
 *                     SurveyID:
 *                       type: integer
 *                       example: 32
 *                     QuestionID:
 *                       type: integer
 *                       example: 79
 *                     ResponseValue:
 *                       type: string
 *                       example: '8'
 *       400:
 *         description: Bad request, failed to retrieve the survey response.
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
 *                   example: 'Survey response not found'
 *   delete:
 *     tags: [Survey Responses]
 *     summary: Delete a survey response
 *     parameters:
 *       - in: path
 *         name: responseID
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the survey response to be deleted.
 *     responses:
 *       200:
 *         description: Survey response and associated tickets deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Survey response and associated tickets deleted successfully'
 *       400:
 *         description: Bad request, failed to delete the survey response.
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
 *                   example: 'Survey response not found or failed to delete'
 */
router
  .route("/:responseID")
  .get(
    authMiddleware.tokenVerification,
    surveyResponseController.getOneSurveyResponseController
  )
  .delete(
    authMiddleware.tokenVerification,
    surveyResponseController.deleteSurveyResponseController
  );

module.exports = router;
