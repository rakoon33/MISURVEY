const { CompanyRole, RolePermission, CompanyUser, User } = require("../models");
const { sequelize } = require("../config/database");
const { Op } = require("sequelize");
const {createLogActivity} = require ("./userActivityLog.service");

const createCompanyRole = async (roleData, permissionsData, companyID, udata) => {
  roleData.CompanyID = companyID;
  const transaction = await sequelize.transaction();

  try {
    const newRole = await CompanyRole.create(roleData, { transaction });

    for (const permission of permissionsData) {
      permission.CompanyRoleID = newRole.CompanyRoleID;
      await RolePermission.create(permission, { transaction });
    }

    await transaction.commit(); 
    await createLogActivity(udata.id, 'INSERT', `CompanyRole created with ID: ${newRole.CompanyRoleID}`, 'CompanyRoles', udata.companyID);

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

const updateCompanyRole = async (id, roleData, permissionsData, udata) => {
  try {
    if (!id) {
      return {
        status: false,
        message: "Company Role not found",
      };
    }

    // Update company role
    await CompanyRole.update(roleData, {
      where: { CompanyRoleID: id }
    });

    // Update permissions
    for (const permission of permissionsData) {
      const existingPermission = await RolePermission.findOne({
        where: {
          CompanyRoleID: id,
          ModuleID: permission.ModuleID,
        },
      });

      if (!existingPermission) {
        throw new Error(`Permission with ModuleID ${permission.ModuleID} not found.`);
      }

      // Update only if there's a change in any of the permission fields
      const isPermissionChanged = Object.keys(permission).some(key => permission[key] !== existingPermission[key]);
      if (isPermissionChanged) {
        await RolePermission.update(permission, {
          where: {
            CompanyRoleID: id,
            ModuleID: permission.ModuleID,
          },
        });
      }
    }

    const updatedRole = await CompanyRole.findByPk(id, {
      include: [{
        model: RolePermission,
        as: "permissions",
      }],
    });

    await createLogActivity(udata.id, 'UPDATE', `CompanyRole updated with ID: ${id}`, 'CompanyRoles', udata.companyID);

    return {
      status: true,
      message: "Company Role and Permissions updated successfully",
      data: {
        role: updatedRole,
      },
    };
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return {
        status: false,
        message: "A company role with this name already exists. Please use a different name."
      };
    }
    return {
      status: false,
      message: error.message || "Company Role update failed",
      error: error?.toString(),
    };
  }
};

const deleteCompanyRole = async (roleId, udata) => {
  const transaction = await sequelize.transaction();

  try {
    const role = await CompanyRole.findByPk(roleId, { transaction });
    if (!role) {
      await transaction.rollback();
      return {
        status: false,
        message: "Company Role not found",
      };
    }

    // Delete Role Permissions associated with this role
    await RolePermission.destroy({
      where: { CompanyRoleID: roleId },
      transaction,
    });

    // Find all users associated with this role
    const companyUsers = await CompanyUser.findAll({
      where: { CompanyRoleID: roleId },
      transaction
    });

    // Delete all CompanyUser entries associated with this role
    for (const companyUser of companyUsers) {
      // Optionally, delete the user records as well from User table
      await User.destroy({
        where: { UserID: companyUser.UserID },
        transaction
      });

      await CompanyUser.destroy({
        where: { CompanyUserID: companyUser.CompanyUserID },
        transaction
      });
    }

    // Finally, delete the company role
    await CompanyRole.destroy({
      where: { CompanyRoleID: roleId },
      transaction,
    });

    await transaction.commit();
    await createLogActivity(udata.id, 'DELETE', `CompanyRole deleted with ID: ${roleId}`, 'CompanyRoles', udata.companyID);

    return {
      status: true,
      message: "Company Role and all associated data deleted successfully",
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
