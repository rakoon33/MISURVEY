const { DataTypes } = require("sequelize");
const db = require("../config/database");

const UserPackage = db.sequelize.define(
  "UserPackage",
  {
    UserPackageID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    PackageID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ServicePackage",
        key: "PackageID",
      },
    },
    StartDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    EndDate: {
      type: DataTypes.DATE
    },
    CompanyID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Company",
        key: "CompanyID",
      },
    },
  },
  {
    tableName: "UserPackages",
    timestamps: false,
  }
);

module.exports = UserPackage;
