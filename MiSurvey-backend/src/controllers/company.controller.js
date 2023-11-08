const { companyService } = require('../services'); 

// Super-Admin controller
const createCompanyController = async (req, res) => {
  try {
    const result = await companyService.createCompany(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCompanyController = async (req, res) => {
  const { CompanyID } = req.params;
  const updatedData = req.body;
  
  try {
      const result = await companyService.updateCompany(CompanyID, updatedData);
      res.json(result);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

const deleteCompanyController = async (req, res) => {
  try {
    const { CompanyID } = req.params; 
    const result = await companyService.deleteCompany(CompanyID);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllCompaniesController = async (res) => {
  try {
    const result = await companyService.getAllCompanies();
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const searchCompanyController = async (req, res) => {
  try {
    const { companyName, adminID } = req.query;
    const result = await companyService.searchCompanies(companyName, adminID);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getOneCompanyController = async (req, res) => {
  try {
    const { CompanyID } = req.params;
    const result = await companyService.getOneCompany(CompanyID);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCompanyProfileController = async (req, res) => {
  try {
    const result = await companyService.getOneCompany(req.user.dataValues.CompanyID);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = {
  createCompanyController,
  updateCompanyController,
  deleteCompanyController, 
  getAllCompaniesController,
  searchCompanyController,
  getOneCompanyController,
  getCompanyProfileController
};