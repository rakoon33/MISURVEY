const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Notification = db.sequelize.define(
  "Notification",
  {
    NotificationID: {
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
    Message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Method: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [["Email", "SMS"]],
      },
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [["Read", "Unread"]],
      },
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
    tableName: "Notifications",
    timestamps: false,
  }
);

module.exports = Notification;
