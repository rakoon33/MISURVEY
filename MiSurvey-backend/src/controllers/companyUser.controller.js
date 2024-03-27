const { companyUserService } = require("../services");

const createCompanyUserController = async (req, res) => {
  try {
    const { companyUserData, userData } = req.body;

    if (!companyUserData || !userData) {
      return res.status(400).json({
        status: false,
        message: "Both company user data and user data are required",
      });
    }

    const companyUserData2 = {
      ...companyUserData,
      CompanyID: req.user.companyID,
    };
    const userData2 = {
      ...userData,
      UserAvatar: "./assets/img/avatars/avt_default.png"
    };

    const result = await companyUserService.createCompanyUser(
      companyUserData2,
      userData2
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message || "Error occurred while creating company user",
    });
  }
};

const deleteCompanyUserController = async (req, res) => {
  try {
    const result = await companyUserService.deleteCompanyUser(
      req.params.companyUserId
    );

    if (result.status) {
      res.json({ status: true, message: result.message });
    } else {
      res.status(400).json({ status: false, message: result.message });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getOneCompanyUserController = async (req, res) => {
  try {
    const result = await companyUserService.getOneCompanyUser(
      req.params.companyUserId
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllCompanyUsersController = async (req, res) => {
  try {
    const result = await companyUserService.getAllCompanyUsers();
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCompanyUserController,
  deleteCompanyUserController,
  getOneCompanyUserController,
  getAllCompanyUsersController,
};
