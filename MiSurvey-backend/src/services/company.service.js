const {
  Company,
  User,
  CompanyUser,
  IndividualPermission,
  SurveyDetail,
  Survey,
  SurveyPage,
  SurveyQuestion,
  SurveyResponse,
} = require("../models");


// Super-Admin services
const createCompanyBySuperAdmin = async (companyData) => {
  try {
    const adminID = companyData.AdminID;
    const user = await User.findOne({
      where: {
        UserID: adminID
      }
    });

    if (!user) {
      return {
        status: false,
        message: "AdminID does not exist in Users table"
      };
    }

    if (user.UserRole !== "Admin") {
      return {
        status: false,
        message: "Only Admin can own their company"
      };
    }

    const existingCompany = await Company.findOne({
      where: {
        AdminID: adminID
      }
    });

    if (existingCompany) {
      return {
        status: false,
        message: "This AdminID already has a company"
      };
    }

    const newCompany = await Company.create(companyData);

    return {
      status: true,
      message: "Company created successfully by SuperAdmin",
      data: newCompany
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

      if (user.UserRole != "Admin") {
        return {
          status: false,
          message: "SuperAdmin or Supervisor cannot be Admin of the company",
        };
      }
    }

    await company.update(updatedData);

    return {
      status: true,
      message: "Company updated successfully",
      data: company
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Update company failed",
      error: error?.toString()
    };
  }
};

const deleteCompanyBySuperAdmin = async (CompanyID) => {
  try {
    const company = await Company.findByPk(CompanyID);

    if (!company) {
      return {
        status: false,
        message: "Company not found",
      };
    }

    // 1. Delete related survey details first
    await SurveyDetail.destroy({ where: { CompanyID } });

    // 2. Fetch all surveys related to the company
    const relatedSurveys = await Survey.findAll({ where: { CompanyID } });

    // 3. For each survey, first fetch its associated survey pages
    for (const survey of relatedSurveys) {
      const surveyPages = await SurveyPage.findAll({
        where: { SurveyID: survey.SurveyID },
      });

      // 3.1 For each survey page, delete associated survey questions first
      for (const page of surveyPages) {

        // 3.1.1 Fetch all questions for the current page
        const questions = await SurveyQuestion.findAll({
          where: { PageID: page.PageID },
        });

        // 3.1.2 For each question, delete its associated survey responses first
        for (const question of questions) {
          await SurveyResponse.destroy({
            where: { QuestionID: question.QuestionID },
          });
        }

        // 3.1.3 After deleting all associated responses, delete the question
        await SurveyQuestion.destroy({ where: { PageID: page.PageID } });
      }

      // 3.2 Then delete the survey pages themselves
      await SurveyPage.destroy({ where: { SurveyID: survey.SurveyID } });
    }

    // 4. Delete related surveys
    await Survey.destroy({ where: { CompanyID } });

    // 5. Fetch all CompanyUsers related to the company
    const companyUsers = await CompanyUser.findAll({ where: { CompanyID } });

    // 6. For each CompanyUser, delete all related IndividualPermissions
    for (const user of companyUsers) {
      await IndividualPermission.destroy({
        where: { CompanyUserID: user.CompanyUserID }
      });
    }

    // 7. After all IndividualPermissions are deleted, delete all CompanyUsers
    await CompanyUser.destroy({ where: { CompanyID } });

    // 8. Finally, delete the company itself
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

const getAllCompaniesBySuperAdmin = async (numberOfCompanies) => {
  try {
    if (isNaN(numberOfCompanies) || numberOfCompanies < 0) {
      return { status: false, message: "Invalid number" };
    }

    const companies = await Company.findAll({
      attributes: ["CompanyID", "CompanyName"],
      limit: numberOfCompanies
    });

    if (companies.length === 0) {
      return {
        status: false,
        message: "No companies found",
      };
    }

    return {
      status: true,
      data: companies
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Failed to fetch companies",
      error: error?.toString()
    };
  }
};

const searchCompaniesBySuperAdmin = async (query) => {
  try {
    let whereConditions = {};

    if (query.CompanyName) {
      whereConditions.CompanyName = {
        [db.Sequelize.Op.like]: `%${query.CompanyName}%`,
      };
    }
    if (query.CompanyDomain) {
      whereConditions.CompanyDomain = {
        [db.Sequelize.Op.like]: `%${query.CompanyDomain}%`,
      };
    }

    const companies = await Company.findAll({
      where: whereConditions
    });

    if (companies.length === 0) {
      return {
        status: false,
        message: "No companies found based on search criteria"
      };
    }
    return {
      status: true,
      data: companies,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Failed to search for companies",
      error: error?.toString()
    };
  }
};


// Admin services
const createCompanyByAdmin = async (AdminID, companyData) => {
  try {
    const user = await User.findOne({
      where: {
        UserID: AdminID
      }
    });

    if (!user) {
      return {
        status: false,
        message: "AdminID does not exist in Users table"
      };
    }

    if (user.UserRole !== "Admin") {
      return {
        status: false,
        message: "Only Admin can create a company for themselves"
      };
    }

    const existingCompany = await Company.findOne({
      where: {
        AdminID: AdminID
      }
    });

    if (existingCompany) {
      return {
        status: false,
        message: "This AdminID already has a company"
      };
    }

    if (companyData.AdminID !== AdminID) {
      return {
        status: false,
        message: "You don't have permission to create company for another admin"
      };
    }

    const newCompany = await Company.create(companyData);

    return {
      status: true,
      message: "Company created successfully by Admin",
      data: newCompany
    };
  } catch (error) {
    return {
      status: false,
      message: "Create company failed",
      error: error?.toString(),
    };
  }
};

const updateCompanyByAdmin = async (AdminID, updatedData) => {
  try {
    const admin = await User.findByPk(AdminID);
    if (!admin || admin.UserRole !== "Admin") {
      return {
        status: false,
        message: "Unauthorized"
      };
    }

    if (updatedData.AdminID !== AdminID) {
      return {
        status: false,
        message: "You don't have permission to update company for another admin"
      };
    }

    const company =  await Company.findOne({
      where: {
        AdminID: AdminID
      }
    });
    
    if (!company) {
      return {
        status: false,
        message: "Company not found"
      };
    }

    await company.update(updatedData);

    return {
      status: true,
      message: "Company updated successfully",
      data: company
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Update company failed",
      error: error?.toString()
    };
  }
};

const deleteCompanyByAdmin = async (CompanyID, CurrentAdminID) => {
  try {
    const company = await Company.findByPk(CompanyID);

    if (!company) {
      return {
        status: false,
        message: "Company not found",
      };
    }

    // Check if the company's AdminID matches the ID of the current admin.
    if (company.AdminID !== Number(CurrentAdminID)) {
      return {
        status: false,
        message: "You can only delete your own company",
      };
    }    

    const result = await deleteCompanyBySuperAdmin(CompanyID);
    
    return result;

  } catch (error) {
    return {
      status: false,
      message: error.message || "Delete company failed",
      error: error?.toString(),
    };
  }
};

const getCompanyByAdmin = async (AdminID) => {
  try {
    const user = await User.findOne({
      where: {
        UserID: AdminID,
      },
    });

    if (!user) {
      return {
        status: false,
        message: "AdminID does not exist in Users table",
      };
    }

    if (user.UserRole !== "Admin") {
      return {
        status: false,
        message: "You are restricted from viewing the company list",
      };
    }

    const companies = await Company.findAll({
      where: { AdminID: AdminID },
      attributes: ["CompanyID", "CompanyName"]
    });

    if (companies.length === 0) {
      return {
        status: false,
        message: "No companies found for the given AdminID.",
      };
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


// Admin & SuperAdmin services
const getOneCompany = async (CompanyID) => {
  try {
    const company = await Company.findByPk(CompanyID);
    if (!company) {
      return {
        status: false,
        message: "Company not found",
      };
    }
    return {
      status: true,
      data: company,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Failed to fetch company",
      error: error?.toString(),
    };
  }
};


module.exports = {
  createCompanyBySuperAdmin,
  updateCompanyBySuperAdmin,
  deleteCompanyBySuperAdmin,
  getAllCompaniesBySuperAdmin,
  searchCompaniesBySuperAdmin,
  getOneCompany,
  createCompanyByAdmin,
  updateCompanyByAdmin,
  deleteCompanyByAdmin,
  getCompanyByAdmin,
};
