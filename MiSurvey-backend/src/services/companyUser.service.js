const { CompanyUser, User, Company, CompanyRole } = require('../models');

const createCompanyUser = async (companyUserData) => {
  try {
    // Destructure the required fields from companyUserData
    const { UserID, CompanyID, CompanyRoleID } = companyUserData;

    // Validate that all required fields are provided
    if (!UserID || !CompanyID || !CompanyRoleID) {
      throw new Error('UserID, CompanyID, and CompanyRoleID are required');
    }

    // Create the company user
    const newCompanyUser = await CompanyUser.create({
      UserID,
      CompanyID,
      CompanyRoleID
    });

    return {
      status: true,
      message: "Company User created successfully",
      companyUser: newCompanyUser
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Failed to create company user",
      error: error.toString()
    };
  }
};

const deleteCompanyUser = async (companyUserId) => {
  try {
    const companyUser = await CompanyUser.findByPk(companyUserId);

    if (!companyUser) {
      return { status: false, message: "Company User not found" };
    }

    await companyUser.destroy();
    return { status: true, message: "Company User deleted successfully" };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const getOneCompanyUser = async (companyUserId) => {
  try {
    const companyUser = await CompanyUser.findByPk(companyUserId, {
      include: [
        { model: User, as: 'User' },
        { model: Company, as: 'Company' },
        { model: CompanyRole, as: 'CompanyRole1' }
      ]
    });

    if (!companyUser) {
      return { status: false, message: "Company User not found" };
    }

    return { status: true, message: "Company User fetched successfully", companyUser };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const getAllCompanyUsers = async () => {
  try {
    const companyUsers = await CompanyUser.findAll({
      include: [
        { model: User, as: 'User' },
        { model: Company, as: 'Company' },
        { model: CompanyRole, as: 'CompanyRole1' }
      ]
    });

    return { status: true, message: "All Company Users fetched successfully", companyUsers };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};


module.exports = {
  createCompanyUser,
  deleteCompanyUser,
  getOneCompanyUser,
  getAllCompanyUsers
};
