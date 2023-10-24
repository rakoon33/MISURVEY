const { DataTypes } = require('sequelize');
const db = require('../config/database');

const CompanyRoles = db.sequelize.define('CompanyRoles', {
    CompanyRoleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    CompanyRoleName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    CompanyRoleDescription: {
        type: DataTypes.TEXT,
    },
    CreatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    CreatedBy: {
        type: DataTypes.INTEGER,
    },
    UpdatedAt: {
        type: DataTypes.DATE,
    },
    UpdatedBy: {
        type: DataTypes.INTEGER,
    }
}, {
    tableName: 'CompanyRoles',
    timestamps: false,
});

module.exports = CompanyRoles;
