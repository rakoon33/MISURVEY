const { DataTypes } = require('sequelize');
const db = require('../config/database');

const RolePermissions = db.sequelize.define('RolePermissions', {
    RolePermissionID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    CompanyRoleID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'CompanyRoles',
            key: 'CompanyRoleID'
        }
    },
    ModuleID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Modules',
            key: 'ModuleID'
        }
    },
    CanView: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    CanAdd: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    CanUpdate: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    CanDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    CanExport: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    CanViewData: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    CreatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    CreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    UpdatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    UpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'RolePermissions',
    timestamps: false,
});

module.exports = RolePermissions;
