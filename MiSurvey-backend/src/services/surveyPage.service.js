const db = require('../config/database');
const {SurveyPage} = require('../models');

const createSurveyPage = async (pageData) => {
    try {
      const surveypage = await SurveyPage.create(pageData);
      return { status: true, message: "Survey Page created successfully", surveypage };
    } catch (error) {
      return { status: false, message: error.message, error: error.toString() };
    }
  };

module.exports = {
    createSurveyPage
};
