const { SurveyPage } = require('../models');

const createSurveyPage = async (pageData, transaction) => {
    try {
        const surveypage = await SurveyPage.create(pageData, { transaction });
        return surveypage.PageID;
    } catch (error) {
        return { status: false, message: error.message, error: error.toString() };
    }
};

const updateSurveyPage = async (pageID, updateData, transaction) => {
    try {
        const [updatedRows] = await SurveyPage.update(updateData, {
            where: { PageID: pageID },
            transaction
        });

        if (updatedRows === 0) {
            return { status: false, message: "No survey page found with the given ID or no changes were made." };
        }

        const updatedPage = await SurveyPage.findByPk(pageID, { transaction });
        return { status: true, message: "Survey page updated successfully", updatedPage };
    } catch (error) {
        return { status: false, message: error.message, error: error.toString() };
    }
};

const deleteSurveyPage = async (pageID, transaction) => {
    try {
        const deletedRows = await SurveyPage.destroy({
            where: { PageID: pageID },
            transaction
        });

        if (deletedRows === 0) {
            return { status: false, message: "No survey page found with the given ID or no page was deleted." };
        }

        return { status: true, message: "Survey page deleted successfully" };
    } catch (error) {
        return { status: false, message: error.message, error: error.toString() };
    }
};

module.exports = {
    createSurveyPage,
    updateSurveyPage,
    deleteSurveyPage
};
