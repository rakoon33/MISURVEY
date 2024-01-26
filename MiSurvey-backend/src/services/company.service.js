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
  RolePermission,
  Module,
} = require("../models");
const { Op } = require("sequelize");
const db = require("../config/database");

const createCompany = async (companyData) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { AdminID } = companyData;

    // Validate if the user exists and is an Admin
    const user = await User.findOne({ where: { UserID: AdminID } });
    if (!user) {
      throw new Error("Admin user not found");
    }
    if (user.UserRole !== "Admin") {
      throw new Error("Only Admin users can create companies");
    }

    // Check if the Admin already owns a company
    const existingCompany = await Company.findOne({ where: { AdminID } });
    if (existingCompany) {
      throw new Error("Admin already owns a company");
    }

    // Create the company
    const newCompany = await Company.create(companyData, { transaction });

    // Set the CompanyRoleID for Admin as 1
    const adminRoleID = 1;

    // Add Admin as a CompanyUser
    await CompanyUser.create(
      {
        UserID: AdminID,
        CompanyID: newCompany.CompanyID,
        CompanyRoleID: adminRoleID,
      },
      { transaction }
    );

    await transaction.commit();

    return {
      status: true,
      message: "Company and Admin CompanyUser created successfully",
      data: newCompany,
    };
  } catch (error) {
    await transaction.rollback();
    return {
      status: false,
      message: error.message || "Failed to create company",
      error: error.toString(),
    };
  }
};

const updateCompany = async (CompanyID, updatedData) => {
  try {
    const company = await Company.findByPk(CompanyID);

    if (!company) {
      return {
        status: false,
        message: "Company not fo",
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

const deleteCompany = async (CompanyID) => {
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
        where: { CompanyUserID: user.CompanyUserID },
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

const getAllCompanies = async (
  requestingUserRole,
  requestingUserCompanyId,
  page,
  pageSize
) => {
  try {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    let queryOptions = {
      attributes: [
        "CompanyID",
        "CompanyLogo",
        "CompanyName",
        "CompanyDomain",
        "AdminID",
      ],
      offset,
      limit,
    };

    // Apply filtering based on CompanyID only when the user is not a SuperAdmin
    if (requestingUserRole !== "SuperAdmin") {
      queryOptions.include = [
        {
          model: CompanyUser,
          as: "CompanyUsers",
          attributes: [],
          where: { CompanyID: requestingUserCompanyId },
        },
      ];
    }

    const { count, rows: companies } = await Company.findAndCountAll(
      queryOptions
    );

    return { status: true, data: companies, total: count };
  } catch (error) {
    console.error("Error in getAllCompanies service: ", error);
    return {
      status: false,
      message: error.message || "Failed to retrieve companies",
      error: error.toString(),
    };
  }
};

const searchCompanies = async (companyName, adminID) => {
  try {
    const whereConditions = {};

    if (companyName) {
      whereConditions.CompanyName = {
        [Op.like]: `%${companyName}%`,
      };
    }

    if (adminID) {
      whereConditions.AdminID = adminID;
    }

    const companies = await Company.findAll({
      where: whereConditions,
    });

    if (companies.length === 0) {
      return { status: false, message: "No companies found" };
    }

    return {
      status: true,
      message: "Companies fetched successfully",
      companies,
    };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

// Admin services
const createCompanyByAdmin = async (AdminID, companyData) => {
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
        message: "Only Admin can create a company for themselves",
      };
    }

    const existingCompany = await Company.findOne({
      where: {
        AdminID: AdminID,
      },
    });

    if (existingCompany) {
      return {
        status: false,
        message: "This AdminID already has a company",
      };
    }

    if (companyData.AdminID !== AdminID) {
      return {
        status: false,
        message:
          "You don't have permission to create company for another admin",
      };
    }

    const newCompany = await Company.create(companyData);

    return {
      status: true,
      message: "Company created successfully by Admin",
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

const getCompanyData = async (companyID, userRole) => {
  try {
    const companyDetails = await Company.findByPk(companyID);
    if (!companyDetails) {
      return {
        status: false,
        message: "Company not found",
      };
    }

    if (userRole === "SuperAdmin" || userRole === "Admin") {
      return {
        status: true,
        companyDetails: companyDetails,
      };
    }

    const companyUser = await CompanyUser.findOne({
      where: { CompanyID: companyID },
    });
    if (!companyUser) {
      return {
        status: false,
        message: "Company not found",
      };
    }

    let permissionsMap = {};

    if (companyUser.CompanyUserID) {
      const individualPermissions = await IndividualPermission.findAll({
        where: { CompanyUserID: companyUser.CompanyUserID },
        include: [{ model: Module, as: "module", required: true }],
      });

      permissionsMap = individualPermissions.reduce((acc, permission) => {
        if (permission.module) {
          acc[permission.module.ModuleName] = permission;
        }
        return acc;
      }, {});
    }

    if (companyUser.CompanyRoleID) {
      const rolePermissions = await RolePermission.findAll({
        where: { CompanyRoleID: companyUser.CompanyRoleID },
        include: [{ model: Module, as: "module", required: true }],
      });

      rolePermissions.forEach((permission) => {
        if (
          permission.module &&
          !permissionsMap.hasOwnProperty(permission.module.ModuleName)
        ) {
          permissionsMap[permission.module.ModuleName] = permission;
        }
      });
    }

    const mergedPermissions = Object.values(permissionsMap);

    return {
      status: true,
      userDetails: userDetails,
      permissions: mergedPermissions,
    };
  } catch (error) {
    throw new Error(error.message || "Failed to fetch permissions");
  }
};

module.exports = {
  createCompany,
  updateCompany,
  deleteCompany,
  getAllCompanies,
  searchCompanies,
  getOneCompany,
  createCompanyByAdmin,
  getCompanyData,
};
