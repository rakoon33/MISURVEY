const { DataTypes } = require('sequelize');
const db = require('../config/database');

const SurveyResponses = db.sequelize.define('SurveyResponses', {
    ResponseID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    CustomerID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Customers',
            key: 'CustomerID'
        }
    },
    SurveyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Surveys',
            key: 'SurveyID'
        }
    },
    QuestionID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'SurveyQuestions',
            key: 'QuestionID'
        }
    },
    ResponseType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['Rating', 'Comment', 'Radio', 'Checkbox']]
        }
    },
    ResponseValue: {
        type: DataTypes.TEXT
    },
    CreatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'SurveyResponses',
    timestamps: false, // This will prevent Sequelize from automatically adding createdAt and updatedAt timestamps
});

module.exports = SurveyResponses;