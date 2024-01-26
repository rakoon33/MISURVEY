const { DataTypes } = require("sequelize");
const db = require("../config/database");

const CompanyRole = db.sequelize.define(
  "CompanyRole",
  {
    CompanyRoleID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "CompanyRoles",
    timestamps: false,
  }
);

module.exports = CompanyRole;
