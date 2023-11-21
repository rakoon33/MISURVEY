const { DataTypes } = require('sequelize');
const db = require('../config/database');

const SurveyReport = db.sequelize.define('SurveyReport', {
    ReportID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'UserID'
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
    FeedbacksCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    AverageRating: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    CreatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    ReportFrequency: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ExpiredDays: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SurveyDetailID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'SurveyDetail',
            key: 'SurveyDetailID'
        }
    },
    CompanyID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Company',
            key: 'CompanyID'
        }
    },
    CreatedBy: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User',
            key: 'UserID'
        }
    },
    UpdatedAt: {
        type: DataTypes.DATE
    },
    UpdatedBy: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User',
            key: 'UserID'
        }
    }
}, {
    tableName: 'SurveyReports',
    timestamps: false
});

module.exports = SurveyReport;
