const { companyRoleService } = require('../services');

const createCompanyRoleSuperAdminController = async (req, res) => {
    console.log(`SuperAdmin.controller | createCompanyRoleSuperAdminController | ${req?.originalUrl}`);
    console.log(req.body);
    try {
        const newRole = await companyRoleService.createCompanyRoleBySuperAdmin(req.body);
        res.json(newRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateCompanyRoleSuperAdminController = async (req, res) => {
    console.log(`SuperAdmin.controller | updateCompanyRoleSuperAdminController | ${req?.originalUrl}`);
    console.log(req.body);
    console.log("RoleID:", req.params.id);

    try {
        const result = await companyRoleService.updateCompanyRoleBySuperAdmin(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteCompanyRoleSuperAdminController = async (req, res) => {
    console.log(`SuperAdmin.controller | deleteCompanyRoleSuperAdminController | ${req?.originalUrl}`);
    try {
        const result = await companyRoleService.deleteCompanyRoleBySuperAdmin(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createCompanyRoleSuperAdminController,
    updateCompanyRoleSuperAdminController,
    deleteCompanyRoleSuperAdminController
};
