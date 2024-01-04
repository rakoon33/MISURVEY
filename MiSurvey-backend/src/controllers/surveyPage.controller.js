const { surveyPageService } = require('../services');

const deleteSurveyPageController = async (req, res) => {
    try {
        const result = await surveyPageService.deleteSurveyPage(req.params.SurveyPageID);  
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    deleteSurveyPageController
};