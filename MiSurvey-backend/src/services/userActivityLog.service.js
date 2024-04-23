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

module.exports = {
    createLogActivity
};
