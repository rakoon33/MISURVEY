const { companyRoleService } = require('../services');

const createCompanyRoleController = async (req, res) => {
    const { roleData, permissionData } = req.body; // Use permissionData (singular) here if changing the code

    if (!roleData || !permissionData) { // Check for permissionData (singular) if changing the code
        return res.status(400).json({
            status: false,
            message: "roleData and permissionData are required."
        });
    }

    try {
        const result = await companyRoleService.createCompanyRole(roleData, permissionData); // Use permissionData (singular) here if changing the code
        res.json(result);
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

const updateCompanyRoleController = async (req, res) => {
    console.log(req.body);
    console.log("RoleID:", req.params.CompanyRoleID);

    try {
        const result = await companyRoleService.updateCompanyRole(req.params.CompanyRoleID, req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteCompanyRoleController = async (req, res) => {
    try {
        const result = await companyRoleService.deleteCompanyRole(req.params.CompanyRoleID);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllCompanyRolesController = async (req, res) => {
    try {
        const result = await companyRoleService.getAllCompanyRoles();
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getOneCompanyRoleController = async (req, res) => {
    try {
        const result = await companyRoleService.getOneCompanyRole(req.params.CompanyRoleID);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const searchCompanyRolesController = async (req, res) => {
    try {
        const { name } = req.query;
        const result = await companyRoleService.searchCompanyRoles(name);
        res.json(result);
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
    searchCompanyRolesController
};
