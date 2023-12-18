const db = require('../config/database');
const {Survey} = require('../models');

const createSurvey = async (surveyData) => {
    console.log(surveyData);
    try {
        const { 
            UserID, 
            CompanyID, 
            Title, 
            SurveyDescription, // Optional field
            InvitationMethod, 
            Customizations,
            Approve // Optional field
        } = surveyData;

        if (!UserID || !CompanyID || !Title || !InvitationMethod) {
            throw new Error('Missing required fields for creating a survey');
        }


        const newSurvey = await Survey.create({
            UserID,
            CompanyID,
            Title,
            SurveyDescription,
            SurveyImages: surveyData.SurveyImages,
            InvitationMethod,
            Customizations,
            Approve
        });

        return {
            status: true,
            message: "Survey created successfully",
            survey: newSurvey
        };
    } catch (error) {
        return {
            status: false,
            message: error.message || "Failed to create survey",
            error: error.toString()
        };
    }
};


module.exports = {
    createSurvey
};
