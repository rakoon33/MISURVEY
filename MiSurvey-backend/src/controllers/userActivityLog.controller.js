const { userActivityLogService } = require("../services");

const getAllActivitiesController = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    
    const result = await userActivityLogService.getAllActivities(req.user, page, pageSize);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
  
  module.exports = {
    getAllActivitiesController
  };