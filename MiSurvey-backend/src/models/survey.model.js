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
            model: 'User', // The model name should match the Sequelize model name for Users
            key: 'UserID'
        }
    },
    CompanyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Company', // The model name should match the Sequelize model name for Companies
            key: 'CompanyID'
        }
    },
    Title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    SurveyDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    SurveyImages: {
        type: DataTypes.TEXT
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
        type: DataTypes.FLOAT,
        allowNull: true
    },
    CreatedBy: {
        type: DataTypes.INTEGER
    },
    UpdatedAt: {
        type: DataTypes.DATE
    },
    UpdatedBy: {
        type: DataTypes.INTEGER
    },
    Approve: {
        type: DataTypes.TEXT
    },
    SurveyLink: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'Surveys',
    timestamps: false,
});

module.exports = Survey;
