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
    CompanyID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Companies', 
        key: 'CompanyID',
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
