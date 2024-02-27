const { surveyQuestionService } = require("../services");

const createSurveyQuestionController = async (req, res) => {
  try {
    const surveyquestion = await surveyQuestionService.createSurveyQuestion(
      req.body
    );
    res.json(surveyquestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSurveyQuestionController = async (req, res) => {
    try {
      const questionID = req.params.questionID;
      const result = await surveyQuestionService.deleteSurveyQuestion(questionID);
  
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

module.exports = {
  createSurveyQuestionController,
  deleteSurveyQuestionController
};
