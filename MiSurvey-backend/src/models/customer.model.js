const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Customer = db.sequelize.define(
  "Customer",
  {
    CustomerID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    CreatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    FullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "Customers",
    timestamps: false,
  }
);

module.exports = Customer;
