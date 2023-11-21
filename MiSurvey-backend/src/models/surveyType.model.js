const { DataTypes } = require('sequelize');
const db = require('../config/database');

const SurveyType = db.sequelize.define('SurveyType', {
    SurveyTypeID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    SurveyTypeName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    SurveyTypeDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    CreatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'SurveyTypes',
    timestamps: false
});

module.exports = SurveyType;
