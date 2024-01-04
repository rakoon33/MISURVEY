const { SurveyQuestion } = require('../models');

const createSurveyQuestion = async (questionData, transaction) => {
    try {
        const surveyquestion = await SurveyQuestion.create(questionData, { transaction });
        return { status: true, message: "SurveyQuestion created successfully", surveyquestion };
    } catch (error) {
        return { status: false, message: error.message, error: error.toString() };
    }
};

const updateSurveyQuestion = async (questionID, questionData, transaction) => {
    try {
        const [updatedRows] = await SurveyQuestion.update(questionData, {
            where: { QuestionID: questionID },
            transaction
        });

        if (updatedRows === 0) {
            return { status: false, message: "No survey question found with the given ID or no changes were made." };
        }

        const updatedQuestion = await SurveyQuestion.findByPk(questionID, { transaction });
        return { status: true, message: "SurveyQuestion updated successfully", updatedQuestion };
    } catch (error) {
        return { status: false, message: error.message, error: error.toString() };
    }
};

const deleteSurveyQuestion = async (questionID, transaction) => {
    try {
        const deletedRows = await SurveyQuestion.destroy({
            where: { QuestionID: questionID },
            transaction
        });

        if (deletedRows === 0) {
            return { status: false, message: "No survey question found with the given ID." };
        }

        return { status: true, message: "SurveyQuestion deleted successfully" };
    } catch (error) {
        return { status: false, message: error.message, error: error.toString() };
    }
};

module.exports = {
    createSurveyQuestion,
    updateSurveyQuestion,
    deleteSurveyQuestion
};
