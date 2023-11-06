const { companyRoleService } = require('../services');

const createCompanyRoleController = async (req, res) => {
    console.log(req.body);
    try {
        const newRole = await companyRoleService.createCompanyRole(req.body);
        res.json(newRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
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

module.exports = {
    createCompanyRoleController,
    updateCompanyRoleController,
    deleteCompanyRoleController
};
