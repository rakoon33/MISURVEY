const { companyService } = require('../services'); 


const adminAddCompanyController = async (req, res) => {
    console.log(
        `Company.controller | adminAddCompanyController | ${req?.originalUrl}`
    );

    console.log(req.body);
    try {
      const result = await companyService.addCompany(req.body)
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

module.exports = {
    adminAddCompanyController,

};