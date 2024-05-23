const { UserActivityLog } = require("../models");
const { Op } = require("sequelize");

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

const getAllActivities = async (userData) => {

  try {
    if (userData.role === 'SuperAdmin') {
      // Fetch all activities for SuperAdmin without filtering by CompanyID
      const { count, rows } = await UserActivityLog.findAndCountAll({
        order: [['CreatedAt', 'DESC']]
      });
      return { status: true, message: "Activities fetched successfully", activities: rows };
    } else {
      // Fetch activities and count specific to the user's CompanyID
      const { rows } = await UserActivityLog.findAndCountAll({
        where: { CompanyID: userData.companyID },
        order: [['CreatedAt', 'DESC']]
      });
      const total = rows.length;

      return { status: true, message: "Activities fetched successfully", activities: rows };
    }
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

module.exports = {
    createLogActivity,
    getAllActivities
};
