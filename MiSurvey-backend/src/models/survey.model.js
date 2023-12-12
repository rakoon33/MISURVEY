const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Survey = db.sequelize.define('Survey', {
    SurveyID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'UserID'
        }
    },
    CompanyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Company',
            key: 'CompanyID'
        }
    },
    Title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    SurveyDescription: { // New field added
        type: DataTypes.TEXT,
        allowNull: true
    },
    SurveyImages: {
        type: DataTypes.BLOB
    },
    InvitationMethod: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    SurveyStatus: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    StartDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    EndDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    Customizations: {
        type: DataTypes.JSON
    },
    CreatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    ResponseRate: {
        type: DataTypes.FLOAT
    },
    CreatedBy: {
        type: DataTypes.INTEGER
    },
    UpdatedAt: {
        type: DataTypes.DATE
    },
    UpdatedBy: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'Surveys',
    timestamps: false,
});

module.exports = Survey;
