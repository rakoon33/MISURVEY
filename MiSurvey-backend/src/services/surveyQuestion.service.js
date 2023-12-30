const db = require('../config/database');
const { SurveyQuestion } = require('../models');

const createSurveyQuestion = async (questionData) => {
    try {
        const surveyquestion = await SurveyQuestion.create({
            PageID: questionData.PageID,
            QuestionText: questionData.QuestionText,
            QuestionType: questionData.QuestionType
            // Include other fields if necessary
        });
        return { status: true, message: "SurveyQuestion created successfully", surveyquestion };
    } catch (error) {
        return { status: false, message: error.message, error: error.toString() };
    }
};

module.exports = {
    createSurveyQuestion
};
