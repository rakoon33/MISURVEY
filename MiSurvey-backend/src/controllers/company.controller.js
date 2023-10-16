const { companyService } = require('../services'); 

const addCompanyBySuperAdminController = async (req, res) => {
  try {
    const result = await companyService.addCompanyBySuperAdmin(req.body);
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
    const { AdminID } = req.body;
    const result = await companyService.deleteCompanyBySuperAdmin(CompanyID, AdminID);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addCompanyBySuperAdminController,
  updateCompanyBySuperAdminController,
  deleteCompanyBySuperAdminController
};