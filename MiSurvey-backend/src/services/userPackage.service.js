const { UserPackage } = require("../models");
const { Op } = require("sequelize");
const db = require("../config/database");

const createUserPackage = async (userpackage) => {
  try {
    // Deactivate current active package if it exists
    const currentPackage = await UserPackage.findOne({
      where: {
        CompanyID: userpackage.CompanyID,
        IsActive: true
      }
    });

    if (currentPackage) {
      currentPackage.IsActive = false;
      await currentPackage.save();
    }

    // Create the new package
    const userPackage = await UserPackage.create(userpackage);
    return { status: true, message: "User Package created successfully", userPackage };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};
module.exports = {
    createUserPackage
};