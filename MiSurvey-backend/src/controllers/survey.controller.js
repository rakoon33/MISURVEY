const { surveyService } = require('../services');

const createSurveyController = async (req, res) => {
    console.log(req.body)
    try {
        const newSurvey = await surveyService.createSurvey(req.body);
        res.json(newSurvey);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getOneSurveyWithDataController = async (req, res) => {
    try {
        const result = await surveyService.getOneSurveyWithData(req.params.SurveyID);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getOneSurveyWithoutDataController = async (req, res) => {
    try {
        const result = await surveyService.getOneSurveyWithoutData(req.params.SurveyID);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllSurveyController = async (req, res) => {
    try {
        const result = await surveyService.getAllSurvey();
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createSurveyController,
    getOneSurveyWithDataController,
    getOneSurveyWithoutDataController,
    getAllSurveyController
};
