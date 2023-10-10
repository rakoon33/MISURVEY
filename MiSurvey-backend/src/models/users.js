// File: models/User.js
const { DataTypes } = require('sequelize');
const db = require('../config/database');

const User = db.sequelize.define('User', {
  UserID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Username: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
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
  },
  Password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Role: {
    type: DataTypes.ENUM('Superadmin', 'Admin', 'User'),
    defaultValue: 'User',
    allowNull: false,
  },
  CreatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  LastLogin: {
    type: DataTypes.DATE,
  },
  IsActive: {
    type: DataTypes.TINYINT(1),
    defaultValue: 1,
    allowNull: false,
  },
  CreatedBy: {
    type: DataTypes.INTEGER,
  },
  UpdatedAt: {
    type: DataTypes.DATE,
  },
  UpdatedBy: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'Users',
  timestamps: false,
});

module.exports = User;