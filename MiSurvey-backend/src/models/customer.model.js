const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Customer = db.sequelize.define('Customer', {
    CustomerID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    FirstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    LastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    Email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    PhoneNumber: {
        type: DataTypes.STRING(15),
        allowNull: true,
    },
    Address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    CreatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'Customers',
    timestamps: false,
});

module.exports = Customer;
