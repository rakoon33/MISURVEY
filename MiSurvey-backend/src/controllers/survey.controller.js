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

module.exports = {
    createSurveyController
};
