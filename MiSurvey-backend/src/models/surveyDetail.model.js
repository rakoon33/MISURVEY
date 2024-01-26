const { DataTypes } = require("sequelize");
const db = require("../config/database");

const SurveyDetail = db.sequelize.define(
  "SurveyDetail",
  {
    SurveyDetailID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    SurveyID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Survey",
        key: "SurveyID",
      },
    },
    SentBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "UserID",
      },
    },
    SentAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    RecipientCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Recipients: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    tableName: "SurveyDetails",
    timestamps: false,
  }
);

module.exports = SurveyDetail;
