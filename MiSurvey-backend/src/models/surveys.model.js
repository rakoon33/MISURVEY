const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Surveys = db.sequelize.define('Surveys', {
    SurveyID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'UserID'
        }
    },
    CompanyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Companies',
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
        allowNull: false
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

module.exports = Surveys;
