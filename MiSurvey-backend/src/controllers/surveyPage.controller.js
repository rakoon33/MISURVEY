const { surveyPageService } = require('../services');

const createSurveyPageController = async (req, res) => {
    console.log(req.body)
    try {
        const surveypage = await surveyPageService.createSurveyPage(req.body);
        res.json(surveypage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createSurveyPageController
};
