const { companyService } = require("../services");

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

const getAllCompaniesController = async (req, res) => {
  try {
    const requestingUserRole = req.user.role;
    let requestingUserCompanyId = null;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // Chỉ thiết lập CompanyID nếu người dùng không phải là SuperAdmin
    if (requestingUserRole !== "SuperAdmin") {
      requestingUserCompanyId = req.user.companyID;
    }

    const allCompanies = await companyService.getAllCompanies(
      requestingUserRole,
      requestingUserCompanyId,
      page, pageSize
    );
    res.json(allCompanies);
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
    console.log(req.user.companyID);
    const result = await companyService.getOneCompany(req.user.companyID);
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
  getCompanyProfileController,
};
