const { surveyQuestionService } = require('../services');

const createSurveyQuestionController = async (req, res) => {
    console.log(req.body)
    try {
        const surveyquestion = await surveyQuestionService.createSurveyQuestion(req.body);
        res.json(surveyquestion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createSurveyQuestionController
};
