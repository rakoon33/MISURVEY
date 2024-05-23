const { userActivityLogService } = require("../services");

const getAllActivitiesController = async (req, res) => {
  try {

    const result = await userActivityLogService.getAllActivities(req.user);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
  
module.exports = {
  getAllActivitiesController
};