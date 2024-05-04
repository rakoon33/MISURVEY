const { ServicePackage } = require("../models");
const { Op } = require("sequelize");
const db = require("../config/database");

const createServicePackage = async (packageData) => {
    try {
      const package = await ServicePackage.create(packageData);
      return { status: true, message: "Package created successfully", package };
    } catch (error) {
      return { status: false, message: error.message, error: error.toString() };
    }
};

module.exports = {
    createServicePackage
};