const { UserPackage } = require("../models");
const { Op } = require("sequelize");
const db = require("../config/database");

const createUserPackage = async (userpackage) => {
    try {
      const package = await UserPackage.create(userpackage);
      return { status: true, message: "User Package created successfully", package };
    } catch (error) {
      return { status: false, message: error.message, error: error.toString() };
    }
};

module.exports = {
    createUserPackage
};