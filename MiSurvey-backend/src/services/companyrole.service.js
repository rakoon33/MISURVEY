const { CompanyRole, RolePermission } = require("../models");
const { sequelize } = require("../config/database");
const { Op } = require("sequelize");

const createCompanyRole = async (roleData, permissionsData, companyID) => {
  roleData.CompanyID = companyID;
  const transaction = await sequelize.transaction();

  try {
    const newRole = await CompanyRole.create(roleData, { transaction });

    for (const permission of permissionsData) {
      permission.CompanyRoleID = newRole.CompanyRoleID;
      await RolePermission.create(permission, { transaction });
    }

    await transaction.commit(); // Commit the transaction if all goes well.

    return {
      status: true,
      message: "Company Role and Role Permissions created successfully",
      data: {
        role: newRole,
        permissions: permissionsData,
      },
    };
  } catch (error) {
    await transaction.rollback();

    return {
      status: false,
      message: error.message || "Company Role creation failed",
      error: error?.toString(),
    };
  }
};

const updateCompanyRole = async (id, roleData, permissionsData) => {
  const transaction = await sequelize.transaction();

  try {
    const [updatedRoleRows] = await CompanyRole.update(roleData, {
      where: { CompanyRoleID: id },
      transaction,
    });

    if (updatedRoleRows === 0) {
      await transaction.rollback();
      return {
        status: false,
        message: "Company Role not found or data unchanged",
      };
    }

    for (const permission of permissionsData) {
      await RolePermission.update(permission, {
        where: {
          CompanyRoleID: id,
          ModuleID: permission.ModuleID,
        },
        transaction,
      });
    }

    await transaction.commit();

    const updatedRole = await CompanyRole.findByPk(id, {
      include: {
        model: RolePermission,
        as: "permissions",
      },
    });

    return {
      status: true,
      message: "Company Role and Permissions updated successfully",
      data: {
        role: updatedRole,
      },
    };
  } catch (error) {
    await transaction.rollback();
    return {
      status: false,
      message: error.message || "Company Role update failed",
      error: error?.toString(),
    };
  }
};

const deleteCompanyRole = async (id) => {
  const transaction = await sequelize.transaction();

  try {
    const role = await CompanyRole.findByPk(id, { transaction });
    if (!role) {
      await transaction.rollback();
      return {
        status: false,
        message: "Company Role not found",
      };
    }

    await RolePermission.destroy({
      where: { CompanyRoleID: id },
      transaction,
    });

    await CompanyRole.destroy({
      where: { CompanyRoleID: id },
      transaction,
    });

    await transaction.commit();

    return {
      status: true,
      message: "Company Role and its permissions deleted successfully",
    };
  } catch (error) {
    await transaction.rollback();
    return {
      status: false,
      message: error.message || "Company Role deletion failed",
      error: error?.toString(),
    };
  }
};

const getAllCompanyRoles = async (companyId) => {
  try {
    const roles = await CompanyRole.findAll({
      where: {
        companyId: companyId,
        CompanyRoleName: {
          [Op.ne]: "Admin",
        },
      },
    });
    return {
      status: true,
      message: "Company Roles fetched successfully",
      data: {
        roles: roles,
      },
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Failed to fetch company roles",
      error: error?.toString(),
    };
  }
};

const getOneCompanyRole = async (id) => {
  try {
    const roleWithPermissions = await CompanyRole.findByPk(id, {
      include: [
        {
          model: RolePermission, // This should be the name of the model that holds the permissions
          as: "permissions", // This is the alias that Sequelize will use to join the tables
        },
      ],
    });

    if (!roleWithPermissions) {
      return {
        status: false,
        message: "Company Role not found",
      };
    }

    return {
      status: true,
      message: "Company Role and its permissions fetched successfully",
      data: roleWithPermissions, // This will now include the role data and its associated permissions
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Failed to fetch company role",
      error: error?.toString(),
    };
  }
};

const searchCompanyRoles = async (query) => {
  try {
    const companyroles = await CompanyRole.findAll({
      where: {
        CompanyRoleName: {
          [Op.like]: "%" + query + "%",
        },
      },
    });

    if (companyroles.length === 0) {
      return { status: false, message: "No company role found" };
    }

    return {
      status: true,
      message: "Company role fetched successfully",
      companyroles,
    };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

module.exports = {
  createCompanyRole,
  updateCompanyRole,
  deleteCompanyRole,
  getAllCompanyRoles,
  getOneCompanyRole,
  searchCompanyRoles,
};
