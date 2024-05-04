const { userPackage } = require("../services");

const createUserPackageController = async (req, res) => {
  console.log(req.body);
  try {
    const newUserPackage = await userPackage.createUserPackage(req.body);
    res.json(newUserPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createUserPackageController
};