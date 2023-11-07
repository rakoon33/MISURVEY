const { CompanyRole } = require('../models');

// Create CompanyRole by SuperAdmin
const createCompanyRole = async (roleData) => {
    try {
        const newRole = await CompanyRole.create(roleData);
        return {
            status: true,
            message: "Company Role created successfully",
            data: {
                role: newRole
            }
        };
    } catch (error) {
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
    try {
        const deletedRole = await CompanyRole.findOne({ where: { CompanyRoleID: id } });

        if (!deletedRole) {
            return {
                status: false,
                message: "Company Role not found"
            };
        }

        await CompanyRole.destroy({ where: { CompanyRoleID: id } });

        return {
            status: true,
            message: "Company Role deleted successfully",
            data: {
                role: deletedRole
            }
        };
    } catch (error) {
        return {
            status: false,
            message: error.message || "Company Role deletion failed",
            error: error?.toString()
        };
    }
};

module.exports = {
    createCompanyRole,
    updateCompanyRole,
    deleteCompanyRole
};
