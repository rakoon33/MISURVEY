const reportService = require('../services/report.service');

const getDashboardDataController = async (req, res) => {
    const result = await reportService.getDashboardData(req.user);
    if (!result.status) {
        return res.status(500).json({ message: result.message });
    }
    res.json(result.data);
};

const getSurveyTypeUsageController = async (req, res) => {
    const { startDate, endDate } = req.query;  // Lấy các tham số từ query string
    const result = await reportService.getSurveyTypeUsage(startDate, endDate, req.user);
    res.status(result.status ? 200 : 500).json(result);
};

const getActivityOverviewController = async (req, res) => {
    const { startDate, endDate } = req.query;
    const result = await reportService.getActivityOverview(startDate, endDate, req.user);
    res.status(result.status ? 200 : 500).json(result);
};


const getSurveyCountByDateRangeController = async (req, res) => {
    const { startDate, endDate } = req.query;
    const result = await reportService.getSurveyCountByDateRange(startDate, endDate, req.user);
    res.status(result.status ? 200 : 500).json(result);
};


const getSurveyQuestionDataController = async (req, res) => {
    try {
      const result = await reportService.getSurveyQuestionData(req.params.surveyId);
      if (result.status) {
        res.status(200).json({ status: true, data: result.data });
      } else {
        res.status(400).json({ status: false, message: result.message });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

module.exports = {
    getDashboardDataController,
    getActivityOverviewController,
    getSurveyTypeUsageController,
    getSurveyCountByDateRangeController,
    getSurveyQuestionDataController
};
