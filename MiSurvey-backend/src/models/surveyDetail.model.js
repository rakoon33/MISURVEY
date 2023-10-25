const { DataTypes } = require('sequelize');
const db = require('../config/database'); 

const SurveyDetails = db.sequelize.define('SurveyDetails', {
    SurveyDetailID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    SurveyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Surveys',
            key: 'SurveyID'
        }
    },
    SentBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'UserID'
        }
    },
    SentAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    RecipientCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Recipients: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    CompanyID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Companies',
            key: 'CompanyID'
        }
    }
}, {
    tableName: 'SurveyDetails',
    timestamps: false, 
});

module.exports = SurveyDetails;
