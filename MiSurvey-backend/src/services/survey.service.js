const db = require('../config/database');
const { Survey, SurveyPage, SurveyQuestion } = require('../models');
const {createSurveyPage, updateSurveyPage} = require('./surveyPage.service');
const {createSurveyQuestion, updateSurveyQuestion} = require('./surveyQuestion.service');
const { sequelize } = require('../config/database');
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

const getOneSurveyWithData = async (surveyID) => {
    try {
        const survey = await Survey.findByPk(surveyID, {
            attributes: { 
                exclude: [
                    "SurveyDescription", "SurveyImages", "InvitationMethod",
                    "StartDate", "EndDate", "CreatedAt", "ResponseRate",
                    "CreatedBy", "UpdatedAt", "UpdatedBy", "Approve", "SurveyStatus", "SurveyLink"
                ]
            },
            include: [{
                model: SurveyPage,
                as: 'SurveyPages',
                include: [{
                    model: SurveyQuestion,
                    as: 'SurveyQuestions'
                }]
            }]
        });

        if (!survey) {
            return { status: false, message: "Survey not found" };
        }

        return { status: true, survey: survey.toJSON() };
    } catch (error) {
        return { status: false, message: error.message, error: error.toString() };
    }
};


const getOneSurveyWithoutData = async (surveyID) => {
    try {
        const survey = await Survey.findByPk(surveyID);

        if (!survey) {
            return { status: false, message: "Survey not found" };
        }

        return { status: true, survey };
    } catch (error) {
        return { status: false, message: error.message, error: error.toString() };
    }
};

const getAllSurvey = async () => {
    try {
        const surveys = await Survey.findAll({
            attributes: { 
                exclude: [
                    "CreatedAt", "ResponseRate",
                    "CreatedBy", "UpdatedAt", "UpdatedBy"
                ]
            }
        });
        return { status: true, message: "Surveys fetched successfully", surveys };
    } catch (error) {
        return { status: false, message: error.message, error: error.toString() };
    }
};

const updateSurvey = async (surveyID, updateData) => {
    const transaction = await sequelize.transaction();

    try {
        // Update the survey main details
        await Survey.update(updateData, {
            where: { SurveyID: surveyID },
            transaction
        });

        // Iterate through each page data in the updateData
        for (const pageData of updateData.pages || []) {
            if (pageData.PageID) {
                // Update existing question
                const questionData = pageData.question;
                if (questionData && questionData.QuestionID) {
                    await updateSurveyQuestion(questionData.QuestionID, questionData, transaction);
                }
            } else {
                // Create new page and question
                const newPageID = await createSurveyPage({ SurveyID: surveyID, PageOrder: pageData.PageOrder }, transaction);
                const questionData = pageData.question;
                if (questionData) {
                    await createSurveyQuestion({ ...questionData, PageID: newPageID }, transaction);
                }
            }
        }

        await transaction.commit();
        const updatedSurvey = await Survey.findByPk(surveyID);
        return { status: true, message: "Survey updated successfully", updatedSurvey };
    } catch (error) {
        if (transaction.finished !== 'commit') {
            await transaction.rollback();
        }
        return { status: false, message: error.message, error: error.toString() };
    }
};

module.exports = {
    createSurvey,
    getOneSurveyWithData,
    getOneSurveyWithoutData,
    getAllSurvey,
    updateSurvey
};
