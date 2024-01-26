const { DataTypes } = require("sequelize");
const db = require("../config/database");

const IndividualPermission = db.sequelize.define(
  "IndividualPermission",
  {
    IndividualPermissionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CompanyUserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "CompanyUser",
        key: "CompanyUserID",
      },
    },
    ModuleID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Module",
        key: "ModuleID",
      },
    },
    CanView: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    CanAdd: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    CanUpdate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    CanDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    CanExport: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    CanViewData: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
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
    tableName: "IndividualPermissions",
    timestamps: false,
  }
);

module.exports = IndividualPermission;
