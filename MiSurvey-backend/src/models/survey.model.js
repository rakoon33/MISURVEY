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
    SurveyImages: {
        type: DataTypes.STRING(255)
    },
    InvitationMethod: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    SurveyStatus: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    StartDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    EndDate: {
        type: DataTypes.DATE,
        allowNull: false
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
