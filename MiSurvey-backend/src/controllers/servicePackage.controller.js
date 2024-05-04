const { servicePackage } = require("../services");

const createServicePackageController = async (req, res) => {
  console.log(req.body);
  try {
    const newServicePackage = await servicePackage.createServicePackage(req.body);
    res.json(newServicePackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createServicePackageController
};