const { individualPermissionService } = require("../services");

const createIndividualPermissionController = async (req, res) => {
  try {
    const newPermission =
      await individualPermissionService.createIndividualPermission(req.body);
    res.json(newPermission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateIndividualPermissionController = async (req, res) => {
  const { companyUserId, moduleId } = req.params;
  const permissionData = req.body;

  try {
    const result = await individualPermissionService.updateIndividualPermission(
      companyUserId,
      moduleId,
      permissionData
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteIndividualPermissionController = async (req, res) => {
  const { companyUserId, moduleId } = req.params;
  try {
    const result = await individualPermissionService.deleteIndividualPermission(
      companyUserId,
      moduleId
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOneIndividualPermissionController = async (req, res) => {
  const { companyUserId, moduleId } = req.params; // Extract params
  try {
    const result = await individualPermissionService.getOneIndividualPermission(
      companyUserId,
      moduleId
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllIndividualPermissionsController = async (req, res) => {
  try {
    const result =
      await individualPermissionService.getAllIndividualPermissions();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchIndividualPermissionsController = async (req, res) => {
  const { companyUserId } = req.params;
  try {
    const result =
      await individualPermissionService.searchIndividualPermissions(
        companyUserId
      );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createIndividualPermissionController,
  updateIndividualPermissionController,
  deleteIndividualPermissionController,
  getOneIndividualPermissionController,
  getAllIndividualPermissionsController,
  searchIndividualPermissionsController,
};
