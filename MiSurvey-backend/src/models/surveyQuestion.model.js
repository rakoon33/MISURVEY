const { DataTypes } = require("sequelize");
const db = require("../config/database"); // Make sure this path points to your database configuration

const SurveyQuestion = db.sequelize.define(
  "SurveyQuestion",
  {
    QuestionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    QuestionText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    QuestionType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "SurveyType",
        key: "SurveyTypeID",
      },
    },
    PageOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    SurveyID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Survey",
        key: "SurveyID",
      },
    },
  },
  {
    tableName: "SurveyQuestions",
    timestamps: false,
  }
);

module.exports = SurveyQuestion;
