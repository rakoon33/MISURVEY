const { ServicePackage } = require("../models");
const { Op } = require("sequelize");
const db = require("../config/database");

const createServicePackage = async (packageData) => {
    try {
      const servicePackage = await ServicePackage.create(packageData);
      return { status: true, message: "Package created successfully", servicePackage };
    } catch (error) {
      return { status: false, message: error.message, error: error.toString() };
    }
};

const getAllServicePackages = async () => {
  try {
    return await ServicePackage.findAll();
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createServicePackage,
  getAllServicePackages
};