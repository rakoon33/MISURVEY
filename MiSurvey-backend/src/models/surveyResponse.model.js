const { DataTypes } = require('sequelize');
const db = require('../config/database');

const SurveyResponse = db.sequelize.define('SurveyResponse', {
    ResponseID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    CustomerID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Customer',
            key: 'CustomerID'
        }
    },
    SurveyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Survey',
            key: 'SurveyID'
        }
    },
    QuestionID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'SurveyQuestion',
            key: 'QuestionID'
        }
    },
    ResponseValue: {
        type: DataTypes.TEXT
    },
    CreatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'SurveyResponses',
    timestamps: false, // This will prevent Sequelize from automatically adding createdAt and updatedAt timestamps
});

module.exports = SurveyResponse;
