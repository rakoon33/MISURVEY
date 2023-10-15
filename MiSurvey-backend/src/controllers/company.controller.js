const { companyService } = require('../services'); 

const adminAddCompanyController = async (req, res) => {
  try {
    const result = await companyService.addCompany(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const adminUpdateCompanyController = async (req, res) => {
  try {
    const result = await companyService.updateCompany(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const adminDeleteCompanyController = async (req, res) => {
  try {
    const result = await companyService.deleteCompany(req.body.CompanyID); // Assuming the ID is passed in the body
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  adminAddCompanyController,
  adminUpdateCompanyController,
  adminDeleteCompanyController
};