const { companyService } = require('../services'); 

// Super-Admin controller
const createCompanyBySuperAdminController = async (req, res) => {
  try {
    const result = await companyService.createCompanyBySuperAdmin(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCompanyBySuperAdminController = async (req, res) => {
  const { CompanyID } = req.params;
  const updatedData = req.body;
  
  try {
      const result = await companyService.updateCompanyBySuperAdmin(CompanyID, updatedData);
      res.json(result);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

const deleteCompanyBySuperAdminController = async (req, res) => {
  try {
    const { CompanyID } = req.params; 
    const result = await companyService.deleteCompanyBySuperAdmin(CompanyID);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllCompaniesBySuperAdminController = async (req, res) => {
  try {
    const { numberOfCompanies } = req.body;
    const { AdminID } = req.params;
    const result = await companyService.getAllCompanies(AdminID, numberOfCompanies);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin controller
const createCompanyByAdminController = async (req, res) => {
  try {
    const { AdminID } = req.params;
    const result = await companyService.createCompanyByAdmin(AdminID, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCompanyBySuperAdminController,
  updateCompanyBySuperAdminController,
  deleteCompanyBySuperAdminController, 
  getAllCompaniesBySuperAdminController,

  createCompanyByAdminController,
};