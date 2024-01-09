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

const updateSurveyController = async (req, res) => {

    try {
        const result = await surveyService.updateSurvey(req.params.SurveyID, req.body);  
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSurveyController = async (req, res) => {
    try {
        const result = await surveyService.deleteSurvey(req.params.SurveyID);  
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const searchSurveyController = async (req, res) => {
    try {
      const { column, searchTerm } = req.query;
  
      if (!column || !searchTerm) {
        return res.status(400).json({
          message: "Both column and searchTerm are required as query parameters.",
        });
      }
      const result = await surveyService.searchSurvey(column, searchTerm);
      res.json(result);
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to search surveys." });
    }
};


module.exports = {
    createSurveyController,
    getOneSurveyWithDataController,
    getOneSurveyWithoutDataController,
    getAllSurveyController,
    updateSurveyController,
    deleteSurveyController,
    searchSurveyController
};
