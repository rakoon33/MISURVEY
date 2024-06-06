const {
  Company,
  User,
  CompanyUser,
  IndividualPermission,
  SurveyDetail,
  Survey,
  SurveyQuestion,
  SurveyResponse,
  RolePermission,
  Module,
  UserActivityLog,
  Notification,
  UserPackage,
  CompanyRole,
} = require("../models");
const { Op } = require("sequelize");
const db = require("../config/database");
const {createLogActivity} = require ("./userActivityLog.service");

const createCompany = async (companyData, udata) => {
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


    // Add Admin as a CompanyUser
    await CompanyUser.create(
      {
        UserID: AdminID,
        CompanyID: newCompany.CompanyID
      },
      { transaction }
    );

    await transaction.commit();

    await createLogActivity(udata.id, 'INSERT', `Company created with ID: ${newCompany.CompanyID}`, 'Company', udata.companyID);
    return {
      status: true,
      message: "Company and Admin CompanyUser created successfully",
      data: newCompany,
    };
  } catch (error) {
    /*await transaction.rollback();*/
    return {
      status: false,
      message: error.message || "Failed to create company",
      error: error.toString(),
    };
  }
};

const updateCompany = async (CompanyID, updatedData, udata) => {
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
    await createLogActivity(udata.id, 'UPDATE', `Company updated with ID: ${CompanyID}`, 'Company', udata.companyID);

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

// Assuming `deleteUser` is imported from another module

const deleteCompany = async (CompanyID, udata) => {
  try {
    const company = await Company.findByPk(CompanyID);

    if (!company) {
      return {
        status: false,
        message: "Company not found",
      };
    }

    // Retrieve the AdminID (UserID) associated with the company
    const adminID = company.AdminID;

    const transaction = await db.sequelize.transaction();
  try {
    // Find and delete all notifications for the user
    await Notification.destroy({
      where: { CompanyID: company.CompanyID},
      transaction
    });


    // Find all surveys created by the user
    const surveys = await Survey.findAll({
      where: { UserID: adminID },
      transaction
    });

    // For each survey, delete survey details and survey questions
    for (const survey of surveys) {
      const questions = await SurveyQuestion.findAll({
        where: { SurveyID: survey.SurveyID },
        transaction,
      });
  
      for (const question of questions) {
  
        await SurveyResponse.destroy({
          where: { QuestionID: question.QuestionID },
          transaction,
        });
      }
      await SurveyQuestion.destroy({
        where: { SurveyID: survey.SurveyID },
        transaction
      });

      await SurveyDetail.destroy({
        where: { SurveyID: survey.SurveyID },
        transaction
      });

      await Survey.destroy({
        where: { SurveyID: survey.SurveyID },
        transaction
      });
    }

    // Find and delete all user packages
    await UserPackage.destroy({
      where: { CompanyID: company.CompanyID },
      transaction
    });

    // Find all company user records associated with the user
    const companyUsers = await CompanyUser.findAll({
      where: { UserID: adminID },
      transaction
    });

    await UserActivityLog.destroy({
      where: { CompanyID: CompanyID },
      transaction
    });

    for (const companyUser of companyUsers) {
      const companyID = companyUser.CompanyID;
      const companyUserID = companyUser.CompanyUserID;

      // Delete related records in IndividualPermission
      await IndividualPermission.destroy({
        where: { CompanyUserID: companyUserID },
        transaction
      });

      // Delete the company user record
      await CompanyUser.destroy({
        where: { CompanyUserID: companyUserID },
        transaction
      });

      // If the user is an admin, delete the company and its associated records

      const companyroles = await CompanyRole.findAll({ where: { CompanyID: companyID } });
        for (const companyrole of companyroles) {
           await RolePermission.destroy({
             where: { CompanyRoleID: companyrole.CompanyRoleID },
           });

           await CompanyUser.destroy({
            where: {
              CompanyRoleID: companyrole.CompanyRoleID
            }
          });
        }
      await CompanyRole.destroy({ where: { CompanyID: companyID } });
    }

    await Company.destroy({where: { CompanyID: CompanyID },transaction});
    // Delete the user
    const deletedUser = await User.destroy({
      where: { UserID: adminID },
      transaction
    });

    // Commit all deletions if successful
    if (deletedUser) {
      await transaction.commit();
      await createLogActivity(
        udata.id,
        "DELETE",
        `User deleted with ID: ${adminID}`,
        "Users",
        udata.companyID
      );
      return {
        status: true,
        message: "Company and all related records deleted successfully",
      };
    } else {
      throw new Error("User deletion failed");
    }
  } catch (error) {
    // Rollback if any deletions fail
    await transaction.rollback();
    return {
      status: false,
      message: "Failed to delete user and related data.",
      error: error.toString()
    };
  }
  } catch (error) {
    return {
      status: false,
      message: error.message || "Delete company failed",
      error: error.toString(),
    };
  }
};





const getAllCompanies = async (
  requestingUserRole,
  requestingUserCompanyId,
) => {
  try {

    let queryOptions = {
      attributes: [
        "CompanyID",
        "CompanyLogo",
        "CompanyName",
        "CompanyDomain",
        "AdminID",
      ],
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

    const {rows: companies } = await Company.findAndCountAll(
      queryOptions
    );
    return { status: true, data: companies };
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
