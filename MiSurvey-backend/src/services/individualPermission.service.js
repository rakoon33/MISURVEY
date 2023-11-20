const { IndividualPermission } = require('../models');

const createIndividualPermission = async (permissionData) => {
  try {
    // Check if the permission already exists
    const existingPermission = await IndividualPermission.findOne({
      where: { 
        CompanyUserID: permissionData.CompanyUserID,
        ModuleID: permissionData.ModuleID
      }
    });

    if (existingPermission) {
      return { status: false, message: "Individual Permission with this CompanyUserID and ModuleID already exists" };
    }

    // Create the permission if it doesn't exist
    const permission = await IndividualPermission.create(permissionData);
    return { status: true, message: "Individual Permission created successfully", permission };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};


const updateIndividualPermission = async (companyUserId, moduleId, permissionData) => {
  try {
    const [updatedRows] = await IndividualPermission.update(permissionData, {
      where: { 
        CompanyUserID: companyUserId,
        ModuleID: moduleId 
      }
    });

    if (updatedRows === 0) {
      return { status: false, message: "No individual permission updated" };
    }
    return { status: true, message: "Individual Permission updated successfully" };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};


const deleteIndividualPermission = async (companyUserId, moduleId) => {
  try {
    await IndividualPermission.destroy({
      where: { 
        CompanyUserID: companyUserId,
        ModuleID: moduleId 
      }
    });
    return { status: true, message: "Individual Permission deleted successfully" };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const getOneIndividualPermission = async (companyUserId, moduleId) => {
  try {
    const permission = await IndividualPermission.findOne({
      where: { 
        CompanyUserID: companyUserId,
        ModuleID: moduleId 
      }
    });

    if (!permission) {
      return { status: false, message: "Individual Permission not found" };
    }
    return { status: true, message: "Individual Permission fetched successfully", permission };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const getAllIndividualPermissions = async () => {
  try {
    const permissions = await IndividualPermission.findAll();
    if (permissions.length === 0) {
      return { status: false, message: "No individual permissions found" };
    }
    return { status: true, message: "Individual Permissions fetched successfully", permissions };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const searchIndividualPermissions = async (companyUserId) => {
  try {
    // Construct the search condition
    const condition = {};
    if (companyUserId) condition.CompanyUserID = companyUserId;

    const permissions = await IndividualPermission.findAll({
      where: condition
    });

    if (permissions.length === 0) {
      return { status: false, message: "No matching individual permissions found" };
    }

    return { status: true, message: "Individual Permissions found", permissions };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};



module.exports = {
  createIndividualPermission,
  updateIndividualPermission,
  deleteIndividualPermission,
  getOneIndividualPermission,
  getAllIndividualPermissions,
  searchIndividualPermissions
};
