const { individualPermissionService } = require("../services");

const createIndividualPermissionController = async (req, res) => {
  try {
    const newPermission = await individualPermissionService.createIndividualPermission(req.body);
    if (newPermission.status) {
      res.json(newPermission);
    } else {
      res.status(400).json({ message: newPermission.message });
    }
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
    if (result.status) {
      res.json(result);
    } else {
      res.status(400).json({ message: result.message });
    }
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
    if (result.status) {
      res.json(result);
    } else {
      res.status(400).json({ message: result.message });
    }
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
    if (result.status) {
      res.json(result);
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllIndividualPermissionsController = async (req, res) => {
  try {
    const result = await individualPermissionService.getAllIndividualPermissions();
    if (result.status) {
      res.json(result);
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchIndividualPermissionsController = async (req, res) => {
  const { companyUserId } = req.params;
  try {
    const result = await individualPermissionService.searchIndividualPermissions(
      companyUserId
    );
    if (result.status) {
      res.json(result);
    } else {
      res.status(400).json({ message: result.message });
    }
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
