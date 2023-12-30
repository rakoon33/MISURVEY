const db = require('../config/database');
const { Survey } = require('../models');
const {createSurveyPage} = require('./surveyPage.service');
const {createSurveyQuestion} = require('./surveyQuestion.service');

const createSurvey = async (data) => {
    try {
        // Directly access the survey data since only one survey is being created at a time
        const surveyData = data;

        // Create the survey
        const survey = await Survey.create({
            UserID: surveyData.UserID,
            CompanyID: surveyData.CompanyID,
            Title: surveyData.Title,
            SurveyDescription: surveyData.SurveyDescription,
            InvitationMethod: surveyData.InvitationMethod,
            SurveyStatus: surveyData.SurveyStatus,
            StartDate: surveyData.StartDate,
            EndDate: surveyData.EndDate,
            ResponseRate: surveyData.ResponseRate,
            CreatedBy: surveyData.CreatedBy,
            Approve: surveyData.Approve
        });

        // Create each survey page
        for (const pageData of surveyData.pages) {
            // Add SurveyID to page data
            pageData.SurveyID = survey.SurveyID; // Assuming the created survey object has an 'id' property

            // Create the survey page
            const page = await createSurveyPage(pageData);

            // Create each survey question for this page
            for (const questionData of pageData.questions) {
                // Add PageID to question data
                questionData.PageID = page; // Assuming the created page object has an 'id' property
                console.log(questionData);
                // Create the survey question
                await createSurveyQuestion(questionData);
            }
        }

        return { status: true, message: "Survey created successfully", survey };
    } catch (error) {
        return { status: false, message: error.message, error: error.toString() };
    }
};


module.exports = {
    createSurvey
};
