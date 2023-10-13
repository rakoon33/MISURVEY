const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Company = db.sequelize.define('Company', {
  CompanyID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  CompanyName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  CompanyDomain: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  CreatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  AdminID: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'Companies',
  timestamps: false,
});

module.exports = Company;
