const { surveyResponseService } = require("../services");

const createSurveyResponseController = async (req, res) => {
  try {
    const responses = req.body;
    const result = await surveyResponseService.createSurveyResponses(responses);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOneSurveyResponseController = async (req, res) => {
  try {
    const result = await surveyResponseService.getOneResponse(
      req.params.responseID
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllResponseController = async (req, res) => {
  try {
    const result = await surveyResponseService.getAllResponsesFromSurvey(
      req.params.surveyID
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSurveyResponseController = async (req, res) => {
  try {
    const responseID = req.params.responseID;
    const result = await surveyResponseService.deleteResponse(responseID);

    res.json({ message: result.message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSurveyResponseCountController = async (req, res) => {
  try {
    const result = await surveyResponseService.getSurveyResponseCount(req.params.surveyID);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createSurveyResponseController,
  getOneSurveyResponseController,
  deleteSurveyResponseController,
  getAllResponseController,
  getSurveyResponseCountController
};
