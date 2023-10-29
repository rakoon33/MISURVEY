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
    const result = await companyService.getAllCompaniesBySuperAdmin(numberOfCompanies);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const searchCompanyBySuperAdminController = async (req, res) => {
  try {
    const { companyName, adminID } = req.query;
    const result = await companyService.searchCompaniesBySuperAdmin(companyName, adminID);
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

const updateCompanyByAdminController = async (req, res) => {
  try {
    const { AdminID } = req.params;
    const updatedData = req.body;
    const result = await companyService.updateCompanyByAdmin(AdminID, updatedData);
    res.json(result);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

const deleteCompanyByAdminController = async (req, res) => {
  try {
    const { CompanyID } = req.params;
    const { CurrentAdminID } = req.body;
    const result = await companyService.deleteCompanyByAdmin(CompanyID, CurrentAdminID);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCompanyByAdminController = async (req, res) => {
  try {
    const { AdminID } = req.params;
    const result = await companyService.getCompanyByAdmin(AdminID);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin & SuperAdmin controller
const getOneCompanyController = async (req, res) => {
  try {
    const { CompanyID } = req.params;
    const result = await companyService.getOneCompany(CompanyID);
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
  searchCompanyBySuperAdminController,
  getOneCompanyController,
  createCompanyByAdminController,
  updateCompanyByAdminController,
  deleteCompanyByAdminController,
  getCompanyByAdminController,
};