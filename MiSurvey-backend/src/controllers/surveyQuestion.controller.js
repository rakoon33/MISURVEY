const { surveyQuestionService } = require("../services");

const deleteSurveyQuestionController = async (req, res) => {
  try {
    const questionID = req.params.questionID;
    const result = await surveyQuestionService.deleteSurveyQuestion(questionID);

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const checkQuestionResponsesController = async (req, res) => {
  try {
    const hasResponses = await surveyQuestionService.checkQuestionResponses(req.params.questionId);
    res.json({ hasResponses });
  } catch (error) {
    res.status(500).json({ message: "Failed to check question responses", error: error.message });
  }
};

module.exports = {
  deleteSurveyQuestionController,
  checkQuestionResponsesController
};
