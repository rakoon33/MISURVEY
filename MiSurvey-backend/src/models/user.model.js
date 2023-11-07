const { DataTypes  } = require('sequelize');
const db = require('../config/database');
const Company = require('./company.model');

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
  PhoneNumber: {
    type: DataTypes.STRING(20),
  },
  UserAvatar: {
    type: DataTypes.STRING(255),  // Assuming the avatar's path or URL will be stored here
  },
  UserPassword: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  UserRole: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Admin',
    validate: {
      isIn: [['SuperAdmin', 'Admin', 'Supervisor']]
    },
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

User.hasOne(Company, { as: 'AdminOfCompany', foreignKey: 'AdminID' });  // Thiết lập mối quan hệ với Company

module.exports = User;
