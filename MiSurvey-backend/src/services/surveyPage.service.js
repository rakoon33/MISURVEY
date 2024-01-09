const { SurveyPage, SurveyQuestion } = require('../models');
const { sequelize } = require('../config/database');

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
    const t = transaction || await sequelize.transaction();

    try {
        // Delete the survey question associated with the page
        await SurveyQuestion.destroy({
            where: { PageID: pageID },
            transaction: t
        });

        // Delete the survey page
        const deletedRows = await SurveyPage.destroy({
            where: { PageID: pageID },
            transaction: t
        });

        if (deletedRows === 0) {
            throw new Error("No survey page found with the given ID or no page was deleted.");
        }

        if (!transaction) {
            await t.commit();
        }

        return { status: true, message: "Survey page and its question deleted successfully" };
    } catch (error) {
        if (!transaction && t.finished !== 'commit') {
            await t.rollback();
        }
        return { status: false, message: error.message, error: error.toString() };
    }
};

module.exports = {
    createSurveyPage,
    updateSurveyPage,
    deleteSurveyPage
};
