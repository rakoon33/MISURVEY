const { CompanyUser, User, Company, CompanyRole } = require('../models');
const { createUser } = require('./user.service');
const db = require('../config/database');

const createCompanyUser = async (companyUserData, userData) => {
    const transaction = await db.sequelize.transaction();
    try {
      const { CompanyID, CompanyRoleID } = companyUserData;

      if (!CompanyID || !CompanyRoleID) {
          throw new Error('CompanyID and CompanyRoleID are required');
      }

      const newUser = await createUser(userData);

      if (!newUser.status) {
          throw new Error(newUser.message);
      }

      const newCompanyUser = await CompanyUser.create({
          UserID: newUser.userID,
          CompanyID,
          CompanyRoleID
      }, { transaction });

      await transaction.commit();

      return {
          status: true,
          message: "Company User and associated User account created successfully",
          companyUser: newCompanyUser
      };
    } catch (error) {
        await transaction.rollback();
        return {
            status: false,
            message: error.message || "Failed to create company user and associated user account",
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
        { model: CompanyRole, as: 'CompanyRole' }
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
        { model: CompanyRole, as: 'CompanyRole' }
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
