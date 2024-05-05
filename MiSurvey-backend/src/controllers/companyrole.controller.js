const { companyRoleService } = require("../services");

const createCompanyRoleController = async (req, res) => {
  const { roleData, permissionsData } = req.body;

  try {
    const newRole = await companyRoleService.createCompanyRole(
      roleData,
      permissionsData, 
      req.user.companyID,
      req.user
    );
    res.status(200).json(newRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCompanyRoleController = async (req, res) => {
  const { roleData, permissionsData } = req.body;

  console.log(req.body);
  if (!roleData || !permissionsData) {
    return res.status(400).json({
      status: false,
      message: "roleData and permissionsData are required.",
    });
  }

  const { CompanyRoleID } = req.params;

  if (!CompanyRoleID) {
    return res.status(400).json({
      status: false,
      message: "CompanyRoleID is required.",
    });
  }

  try {
    const result = await companyRoleService.updateCompanyRole(
      CompanyRoleID,
      roleData,
      permissionsData,
      req.user
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deleteCompanyRoleController = async (req, res) => {
  try {
    const result = await companyRoleService.deleteCompanyRole(
      req.params.CompanyRoleID,
      req.user
    );
    if (!result.status) {
      return res.status(400).json({ message: result.message });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllCompanyRolesController = async (req, res) => {
  try {
    const result = await companyRoleService.getAllCompanyRoles(req.user.companyID);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOneCompanyRoleController = async (req, res) => {
  try {
    const result = await companyRoleService.getOneCompanyRole(req.params.CompanyRoleID);
    if (!result.status) {
      return res.status(400).json({ message: result.message });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const searchCompanyRolesController = async (req, res) => {
  try {
    const { name } = req.query;
    const result = await companyRoleService.searchCompanyRoles(name);
    if (!result.status) {
      return res.status(400).json({ message: result.message });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCompanyRoleController,
  updateCompanyRoleController,
  deleteCompanyRoleController,
  getAllCompanyRolesController,
  getOneCompanyRoleController,
  searchCompanyRolesController,
};
