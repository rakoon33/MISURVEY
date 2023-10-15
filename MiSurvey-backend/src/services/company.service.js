const { Company, User } = require("../models");

const addCompany = async (companyData) => {
  try {
    // Check if AdminID exists in the Users table
    const adminID = companyData.AdminID;
    const user = await User.findOne({
      where: {
        UserID: adminID,
      },
    });

    if (!user) {
      throw new Error("AdminID does not exist in Users table");
    }

    if (user.Role !== "Superadmin") {
      throw new Error("Access denied");
    }

    // If AdminID is valid, create a new company record in the database
    const newCompany = await Company.create(companyData);

    return {
      status: true,
      message: "Company updated successfully",
      data: newCompany,
    };
  } catch (error) {
    if (error.message === "AdminID does not exist in Users table") {
      return {
        status: false,
        message: error.message,
      };
    } else if (error.message === "Access denied") {
      return {
        status: false,
        message: error.message,
      };
    }

    return {
      status: false,
      message: "Create company failed",
      error: error?.toString(),
    };
  }
};

const updateCompany = async (CompanyID, updatedData) => {
  try {
    const company = await Company.findByPk(CompanyID);

    if (!company) {
      throw new Error("Company not found");
    }

    if (updatedData.AdminID) {
      const user = await User.findByPk(updatedData.AdminID);
      if (!user) {
        throw new Error("AdminID does not exist in Users table");
      }
      if (user.Role !== "Superadmin") {
        throw new Error("Access denied");
      }
    }

    await company.update(updatedData);

    return {
      status: true,
      message: "Company updated successfully",
      data: company,
    };
  } catch (error) {
    if (error.message === "AdminID does not exist in Users table") {
      return {
        status: false,
        message: error.message,
      };
    } else if (error.message === "Access denied") {
      return {
        status: false,
        message: error.message,
      };
    }

    return {
      status: false,
      message: error.message || "Update company failed",
      error: error?.toString(),
    };
  }
};

const deleteCompany = async (CompanyID, AdminID) => {
  try {
    const company = await Company.findByPk(CompanyID);
    const user = await User.findOne({
      where: {
        UserID: AdminID,
      },
    });

    if (!user) {
      throw new Error("AdminID does not exist in Users table");
    }

    if (user.Role !== "Superadmin") {
      console.log("user.Role: ", user.Role)
      throw new Error("Access denied");
    }

    if (!company) {
      throw new Error("Company not found");
    }

    await company.destroy();

    return {
      status: true,
      message: "Company deleted successfully",
    };
  } catch (error) {
    if (error.message === "Access denied") {
      return {
        status: false,
        message: error.message,
      };
    }

    return {
      status: false,
      message: error.message || "Delete company failed",
      error: error?.toString(),
    };
  }
};

module.exports = {
  addCompany,
  updateCompany,
  deleteCompany,
};
