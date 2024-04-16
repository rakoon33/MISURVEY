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

module.exports = {
  deleteSurveyQuestionController,
};
