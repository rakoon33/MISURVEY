const db = require('../config/database');
const { SurveyPage } = require('../models');

const createSurveyPage = async (pageData) => {
    try {
        // Create a survey page with the provided data
        const surveypage = await SurveyPage.create({
            SurveyID: pageData.SurveyID, // The ID of the survey this page belongs to
            PageOrder: pageData.PageOrder // The order of the page in the survey
            // Include other fields if necessary
        });
        return surveypage.PageID;
    } catch (error) {
        return { status: false, message: error.message, error: error.toString() };
    }
};

module.exports = {
    createSurveyPage
};
