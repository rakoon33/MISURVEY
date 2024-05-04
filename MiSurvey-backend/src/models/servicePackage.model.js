const { DataTypes } = require("sequelize");
const db = require("../config/database");

const ServicePackage = db.sequelize.define(
  "ServicePackage",
  {
    PackageID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    PackageName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    Features: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    Duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "UserID",
      },
    },
    UpdatedAt: {
      type: DataTypes.DATE,
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "UserID",
      },
    },
    QuestionLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ResponseLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ShareMethod: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "ServicePackages",
    timestamps: false,
  }
);

module.exports = ServicePackage;
