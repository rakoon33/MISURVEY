const { DataTypes } = require('sequelize');
const db = require('../config/database'); 

const SurveyPage = db.sequelize.define('SurveyPage', {
    PageID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    SurveyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Survey',
            key: 'SurveyID'
        }
    },
    PageTitle: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    PageOrder: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: 'SurveyPages',
    timestamps: false, 
});

module.exports = SurveyPage;