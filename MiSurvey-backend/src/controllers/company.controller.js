const { companyService } = require("../services");

const createCompanyController = async (req, res) => {
  try {
    const result = await companyService.createCompany(req.body, req.user);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCompanyController = async (req, res) => {
  const { CompanyID } = req.params;
  const updatedData = req.body;

  try {
    const result = await companyService.updateCompany(CompanyID, updatedData, req.user);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCompanyController = async (req, res) => {
  try {
    const { CompanyID } = req.params;
    const result = await companyService.deleteCompany(CompanyID, req.user);
    res.status(200).json(result);
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
      page,
      pageSize
    );
    res.status(200).json(allCompanies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const searchCompanyController = async (req, res) => {
  try {
    const { companyName, adminID } = req.query;
    const result = await companyService.searchCompanies(companyName, adminID);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOneCompanyController = async (req, res) => {
  try {
    const { CompanyID } = req.params;
    const result = await companyService.getOneCompany(CompanyID);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCompanyProfileController = async (req, res) => {
  try {
    console.log(req.user.companyID);
    const result = await companyService.getOneCompany(req.user.companyID);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCompanyDataController = async (req, res) => {
  try {
    const companyID = req.user.companyID;
    if (!companyID) {
      return res
        .status(400)
        .json({ message: "companyID is required as a query parameter." });
    }
    const result = await companyService.getCompanyData(
      companyID,
      req.user.role
    );
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to retrieve company data." });
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
  getCompanyDataController,
};
