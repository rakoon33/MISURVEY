const { servicePackage } = require("../services");

const createServicePackageController = async (req, res) => {
  try {
    const newServicePackage = await servicePackage.createServicePackage(req.body);
    res.json(newServicePackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllServicePackagesController = async (req, res) => {
  try {
    const packages = await servicePackage.getAllServicePackages();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createServicePackageController,
  getAllServicePackagesController
};