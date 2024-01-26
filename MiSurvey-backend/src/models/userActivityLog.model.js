const { DataTypes } = require("sequelize");
const db = require("../config/database");

const UserActivityLog = db.sequelize.define(
  "UserActivityLog",
  {
    LogID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "UserID",
      },
    },
    UserAction: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [["INSERT", "UPDATE", "DELETE"]],
      },
    },
    ActivityDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    TableName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    RecordID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    CompanyID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Company",
        key: "CompanyID",
      },
    },
  },
  {
    tableName: "UserActivityLogs",
    timestamps: false,
  }
);

module.exports = UserActivityLog;
