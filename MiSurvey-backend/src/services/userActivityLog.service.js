const { UserActivityLog } = require("../models");

const createLogActivity = async (userId, action, description, tableName, companyId) => {
  await UserActivityLog.create({
    UserID: userId,
    UserAction: action,
    ActivityDescription: description,
    TableName: tableName,
    CreatedAt: new Date(),
    CompanyID: companyId,
  });
};

const getAllActivities = async () => {
  try {
    const activities = await UserActivityLog.findAll();
    return { status: true, message: "Activities fetched successfully", activities };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

module.exports = {
    createLogActivity,
    getAllActivities
};
