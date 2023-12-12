const { surveyService } = require('../services');
const multer = require('multer');

// Set up Multer for image upload handling
const storage = multer.memoryStorage(); // You can also use diskStorage
const upload = multer({ storage: storage });

const createSurveyController = async (req, res) => {
    try {
        console.log(req.body);
        // Extracting survey data and the image from the request
        const surveyData = {
            UserID: req.body.UserID,
            CompanyID: req.body.CompanyID,
            Title: req.body.Title,
            SurveyDescription: req.body.SurveyDescription,
            SurveyImages: req.file, // Assuming image is sent as a file
            InvitationMethod: req.body.InvitationMethod,
            Customizations: req.body.Customizations
        };

        // Convert image to BLOB if present
        if (surveyData.SurveyImages) {
            // Convert buffer to BLOB (Binary Large Object)
            surveyData.SurveyImages = surveyData.SurveyImages.buffer;
        }

        // Call the service function to create a survey
        const result = await surveyService.createSurvey(surveyData);

        // Send response
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message || "Error occurred while creating survey"
        });
    }
};

// Export a middleware chain with multer and your controller
module.exports = {
    createSurveyController: [upload.single('image'), createSurveyController] // 'image' is the field name for the uploaded file
};

