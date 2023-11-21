const { DataTypes } = require('sequelize');
const db = require('../config/database');
const User = require('./user.model');

const ServicePackage = db.sequelize.define('ServicePackage', {
    PackageID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    PackageName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    RequestLimit: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Features: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    Duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CreatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    CreatedBy: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'UserID'
        }
    },
    UpdatedAt: {
        type: DataTypes.DATE
    },
    UpdatedBy: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'UserID'
        }
    }
}, {
    tableName: 'ServicePackages',
    timestamps: false,
});

module.exports = ServicePackage;
