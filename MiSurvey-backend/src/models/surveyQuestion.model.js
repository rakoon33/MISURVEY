const { DataTypes } = require('sequelize');
const db = require('../config/database'); // Make sure this path points to your database configuration

const SurveyQuestions = db.sequelize.define('SurveyQuestions', {
    QuestionID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    PageID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'SurveyPages',
            key: 'PageID'
        }
    },
    QuestionText: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    QuestionType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'SurveyTypes',
            key: 'SurveyTypeID'
        }
    },
    QuestionOrder: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'SurveyQuestions',
    timestamps: false, 
});

module.exports = SurveyQuestions;