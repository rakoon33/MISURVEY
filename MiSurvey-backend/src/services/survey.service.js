const db = require('../config/database');
const { Survey } = require('../models');
const {createSurveyPage} = require('./surveyPage.service');
const {createSurveyQuestion} = require('./surveyQuestion.service');
let nanoid;

const createSurvey = async (data) => {
    if (!nanoid) {
        nanoid = (await import('nanoid')).nanoid;
    }
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
            Customizations: surveyData.Customizations, // Assuming Customizations is stored as JSON in the database
            CreatedBy: surveyData.CreatedBy,
            Approve: surveyData.Approve
        });

        surveyData.SurveyLink = await nanoid();
        const [addSurveyLink] = await Survey.update({SurveyLink:surveyData.SurveyLink}, {
            where: { SurveyID: survey.SurveyID },
          });
        if (addSurveyLink === 0) {
            return { status: false, message: "Failed create Survey Link" };
        }
        // Create each survey page
        for (const pageData of surveyData.pages) {
            // Add SurveyID to page data
            pageData.SurveyID = survey.SurveyID; // Assuming the created survey object has an 'id' property

            // Create the survey page
            const page = await createSurveyPage(pageData);
            
            const questionData = pageData.question;
            // Add PageID to question data
            questionData.PageID = page; // Assuming the created page object has an 'id' property
            console.log(questionData);
            // Create the survey question
            await createSurveyQuestion(questionData);
        }

        return { status: true, message: "Survey created successfully", survey };
    } catch (error) {
        return { status: false, message: error.message, error: error.toString() };
    }
};


module.exports = {
    createSurvey
};
