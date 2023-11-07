const { CompanyRole, RolePermissions } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Create CompanyRole by SuperAdmin
const createCompanyRole = async (roleData, permissionsData) => {
    const transaction = await sequelize.transaction(); // Begin a transaction

    try {
        // Create the company role
        const newRole = await CompanyRole.create(roleData, { transaction });

        // Attach the CompanyRoleID to the permissions object
        permissionsData.CompanyRoleID = newRole.CompanyRoleID;

        // Create the role permissions
        const newPermission = await RolePermissions.create(permissionsData, { transaction });

        await transaction.commit(); // Commit the transaction if all goes well.

        return {
            status: true,
            message: "Company Role and Role Permissions created successfully",
            data: {
                role: newRole,
                permissions: newPermission // Send back the created permissions object.
            }
        };
    } catch (error) {
        await transaction.rollback(); // Rollback the transaction on error.

        return {
            status: false,
            message: error.message || "Company Role creation failed",
            error: error?.toString()
        };
    }
};

// Update CompanyRole by SuperAdmin
const updateCompanyRole = async (id, roleData) => {
    try {
        const [updatedRows] = await CompanyRole.update(roleData, { where: { CompanyRoleID: id } });
        if (updatedRows === 0) {
            return { status: false, message: "No rows updated" };
        }

        // Fetch the updated role
        const updatedRole = await CompanyRole.findOne({ where: { CompanyRoleID: id } });

        return {
            status: true,
            message: "Company Role updated successfully",
            data: {
                role: updatedRole
            }
        };
    } catch (error) {
        return {
            status: false,
            message: error.message || "Company Role update failed",
            error: error?.toString()
        };
    }
};

// Delete CompanyRole by SuperAdmin
const deleteCompanyRole = async (id) => {
    const transaction = await sequelize.transaction(); // Begin a transaction

    try {
        // Check if the role exists
        const role = await CompanyRole.findByPk(id, { transaction });
        if (!role) {
            await transaction.rollback(); // If no role, rollback the transaction
            return {
                status: false,
                message: "Company Role not found"
            };
        }

        // Delete associated role permissions first
        await RolePermissions.destroy({
            where: { CompanyRoleID: id },
            transaction
        });

        // Delete the company role
        await CompanyRole.destroy({
            where: { CompanyRoleID: id },
            transaction
        });

        await transaction.commit(); // Commit the transaction if all goes well

        return {
            status: true,
            message: "Company Role and its permissions deleted successfully"
        };
    } catch (error) {
        await transaction.rollback(); // Rollback the transaction on error
        return {
            status: false,
            message: error.message || "Company Role deletion failed",
            error: error?.toString()
        };
    }
};

const getAllCompanyRoles = async () => {
    try {
        const roles = await CompanyRole.findAll();
        return {
            status: true,
            message: "Company Roles fetched successfully",
            data: {
                roles: roles
            }
        };
    } catch (error) {
        return {
            status: false,
            message: error.message || "Failed to fetch company roles",
            error: error?.toString()
        };
    }
};

const getOneCompanyRole = async (id) => {
    try {
        const role = await CompanyRole.findByPk(id);
        if (!role) {
            return {
                status: false,
                message: "Company Role not found"
            };
        }
        return {
            status: true,
            message: "Company Role fetched successfully",
            data: {
                role: role
            }
        };
    } catch (error) {
        return {
            status: false,
            message: error.message || "Failed to fetch company role",
            error: error?.toString()
        };
    }
};

const searchCompanyRoles = async (query) => {
    try {
      console.log("Searching company roles');", query);
      const companyroles = await CompanyRole.findAll({
        where: {
          CompanyRoleName: {
            [Op.like]: '%' + query + '%'
          }
        }
      });
  
      if (companyroles.length === 0) {
        return { status: false, message: "No company role found" };
      }
  
      return { status: true, message: "Company role fetched successfully", companyroles };
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
    searchCompanyRoles
};
