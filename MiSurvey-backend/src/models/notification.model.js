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
    CompanyID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Companies', 
        key: 'CompanyID',
      }
    },
    Message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    NotificationType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Feedback',
    },
    NotificationStatus: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: {
          args: [['Read', 'Unread']],
          msg: "Status must be either 'Read' or 'Unread'"
        }
      }
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ReferenceID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'SurveyResponses',
        key: 'ResponseID',
      }
    }
  },
  {
    tableName: 'Notifications',
    timestamps: false,
    freezeTableName: true
  }
);

module.exports = Notification;
