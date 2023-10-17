const { Company, User } = require("../models");

const addCompanyBySuperAdmin = async (companyData) => {
  try {
    // Check if AdminID exists in the Users table
    const adminID = companyData.AdminID;
    const user = await User.findOne({
      where: {
        UserID: adminID,
      },
    });

    if (!user) {
      return {
        status: false,
        message: "AdminID does not exist in Users table",
      };
    }

    if (user.UserRole != "SuperAdmin" && user.UserRole != "Admin") {
      return {
        status: false,
        message: "Supervisor cannot be Admin of the company",
      };
    }

    // If AdminID is valid, create a new company record in the database
    const newCompany = await Company.create(companyData);

    return {
      status: true,
      message: "Company created successfully",
      data: newCompany,
    };
  } catch (error) {
    return {
      status: false,
      message: "Create company failed",
      error: error?.toString(),
    };
  }
};

const updateCompanyBySuperAdmin = async (CompanyID, updatedData) => {
  try {
    const company = await Company.findByPk(CompanyID);

    if (!company) {
      return {
        status: false,
        message: "Company not found",
      };
    }

    if (updatedData.AdminID) {
      const user = await User.findByPk(updatedData.AdminID);
      if (!user) {
        return {
          status: false,
          message: "AdminID does not exist in Users table",
        };
      }
  
      if (user.UserRole != "SuperAdmin" && user.UserRole != "Admin") {
        return {
          status: false,
          message: "Supervisor cannot be Admin of the company",
        };
      }
    }

    await company.update(updatedData);

    return {
      status: true,
      message: "Company updated successfully",
      data: company,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Update company failed",
      error: error?.toString(),
    };
  }
};

const deleteCompanyBySuperAdmin = async (CompanyID) => {
  try {
    const company = await Company.findByPk(CompanyID);

    if (!company) {
      return { 
        status: false, 
        message: "Company not found"
      };
    }

    await company.destroy();
    return {
      status: true,
      message: "Company deleted successfully",
    };

  } catch (error) {
    return {
      status: false,
      message: error.message || "Delete company failed",
      error: error?.toString(),
    };
  }
};

const getAllCompanies = async (adminID, numberOfCompanies) => {
  try {
    // Check if the number of companies is valid
    if (isNaN(numberOfCompanies) || numberOfCompanies < 0) {
      return { status: false, message: "Invalid number" };
    }

    const user = await User.findOne({
      where: {
        UserID: adminID,
      },
    });

    if (!user) {
      return {
        status: false,
        message: "AdminID does not exist in Users table",
      };
    }

    if (user.UserRole !== "SuperAdmin" && user.UserRole !== "Admin") {
      return {
        status: false,
        message: "You are restricted from viewing the company list",
      };
    }

    // Nếu Superadmin thì không cần điều kiện (thấy full list company)
    // Nếu Admin thì cần điều kiện (chỉ xem đc company của admin đó)
    let condition = user.UserRole === "SuperAdmin" ? {} : { AdminID: adminID };
    
    const companies = await Company.findAll({
      where: condition,
      attributes: ['CompanyID', 'CompanyName'],  
      limit: numberOfCompanies 
    });

    if (companies.length === 0) {
      return { status: false, message: user.UserRole === "SuperAdmin" ? "No companies found" : "No companies found for the given AdminID." };
    }

    return {
      status: true,
      data: companies,
    };

  } catch (error) {
    return {
      status: false,
      message: error.message || "Failed to fetch companies",
      error: error?.toString(),
    };
  }
};


module.exports = {
  addCompanyBySuperAdmin,
  updateCompanyBySuperAdmin,
  deleteCompanyBySuperAdmin,
  getAllCompanies
};
