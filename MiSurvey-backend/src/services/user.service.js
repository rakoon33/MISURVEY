const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const {
  User,
  CompanyUser,
  Company,
  IndividualPermission,
  RolePermission,
  Module,
  UserActivityLog,
  Survey,
  SurveyDetail,
  UserPackage,
  Notification,
  SurveyQuestion,
  SurveyResponse,
  CompanyRole,
  ServicePackage,
} = require("../models");
const companyService = require("../services");
const db = require("../config/database");
const { createLogActivity } = require("./userActivityLog.service");

const getUserData = async (userId, userRole) => {
  try {
    // Fetch user details
    const userDetails = await User.findByPk(userId);
    if (!userDetails) {
      return { status: false, message: "User not found" };
    }

    const { UserPassword, ...userDetailsWithoutPassword } =
      userDetails.dataValues;
    let response = { status: true, userDetails: userDetailsWithoutPassword };

    let companyUser;
    let activePackage;

    switch (userRole) {
      case "SuperAdmin":
        return response;

      case "Admin":
        companyUser = await CompanyUser.findOne({
          where: { UserID: userId },
        });

        if (!companyUser) {
          return { status: false, message: "Company not found" };
        }

        activePackage = await UserPackage.findOne({
          where: {
            CompanyID: companyUser.CompanyID,
            IsActive: true,
          },
          include: [
            { model: ServicePackage, as: "servicePackage", required: true },
          ],
        });

        if (
          activePackage &&
          activePackage.EndDate &&
          new Date(activePackage.EndDate) < new Date()
        ) {
          activePackage.IsActive = false;
          await activePackage.save();
        } else if (!activePackage) {
          let freePackage = await UserPackage.findOne({
            where: {
              "$servicePackage.PackageName$": "Free",
              CompanyID: companyUser.CompanyID,
              IsActive: false,
            },
            include: [
              { model: ServicePackage, as: "servicePackage", required: true },
            ],
          });

          if (!freePackage) {

            const freeServicePackage = await ServicePackage.findOne({
              where: {
                PackageName: "Free"
              }
            });

            const freeUserPackage = await UserPackage.create({
              PackageID: freeServicePackage.PackageID, 
              StartDate: new Date(),
              IsActive: true, 
              CompanyID: companyUser.CompanyID 
            });
          }

          if (freePackage) {
            freePackage.IsActive = true;
            await freePackage.save();
            activePackage = freePackage; 
          }
        }
        if (activePackage) {
          response.packages = activePackage;
        }
        return response;

      case "Supervisor":
        companyUser = await CompanyUser.findOne({
          where: { UserID: userId },
        });

        if (!companyUser) {
          return { status: false, message: "Company not found" };
        }

        activePackage = await UserPackage.findOne({
          where: {
            CompanyID: companyUser.CompanyID,
            IsActive: true,
          },
          include: [
            { model: ServicePackage, as: "servicePackage", required: true },
          ],
        });

        if (
          activePackage &&
          activePackage.EndDate &&
          new Date(activePackage.EndDate) < new Date()
        ) {
          activePackage.IsActive = false;
          await activePackage.save();
        } else if (!activePackage) {
          let freePackage = await UserPackage.findOne({
            where: {
              "$servicePackage.PackageName$": "Free",
              CompanyID: companyUser.CompanyID,
              IsActive: false,
            },
            include: [
              { model: ServicePackage, as: "servicePackage", required: true },
            ],
          });

          if (!freePackage) {

            const freeServicePackage = await ServicePackage.findOne({
              where: {
                PackageName: "Free"
              }
            });

            const freeUserPackage = await UserPackage.create({
              PackageID: freeServicePackage.PackageID, 
              StartDate: new Date(),
              IsActive: true, 
              CompanyID: companyUser.CompanyID 
            });
          }

          if (freePackage) {
            freePackage.IsActive = true;
            await freePackage.save();
            activePackage = freePackage; 
          }
        }
        if (activePackage) {
          response.packages = activePackage;
        }

        // Permissions logic
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
        response.permissions = mergedPermissions;
        break;

      // Default case to handle other roles (if any)
      default:
        return { status: false, message: "Invalid user role" };
    }

    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch user data");
  }
};

const createUser = async (userData, udata) => {
  try {
    console.log(userData);
    userData.UserPassword = await bcrypt.hash(userData.UserPassword, 10); // Hash password before saving
    const newUser = await User.create(userData);
    await createLogActivity(
      udata.id,
      "INSERT",
      `User created with ID: ${newUser.UserID}`,
      "Users",
      udata.companyID
    );
    return {
      status: true,
      message: "User created successfully",
      userID: newUser.UserID,
    };
  } catch (error) {
    console.error("Error details:", error);
    return {
      status: false,
      message: error.message || "User creation failed",
      error: error.errors
        ? error.errors.map((e) => e.message).join(", ")
        : error.toString(),
    };
  }
};

const updateUser = async (UserID, userData, udata) => {
  try {
    console.log(UserID);
    console.log(userData);
    if (userData.UserPassword) {
      userData.UserPassword = await bcrypt.hash(userData.UserPassword, 10);
    }
    const [updatedRows] = await User.update(userData, {
      where: { UserID: UserID },
    });

    const updatedUser = await User.findOne({ where: { UserID: UserID } });
    await createLogActivity(
      udata.id,
      "UPDATE",
      `User updated with ID: ${UserID}`,
      "Users",
      udata.companyID
    );

    return {
      status: true,
      message: "User updated successfully",
      data: {
        user: updatedUser,
      },
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "User update failed",
      error: error?.toString(),
    };
  }
};

const deleteUser = async (UserID, udata) => {
  const transaction = await db.sequelize.transaction();
  try {
    // Find and delete all notifications for the user
    await Notification.destroy({
      where: { UserID: UserID },
      transaction,
    });

    // Find all surveys created by the user
    const surveys = await Survey.findAll({
      where: { UserID: UserID },
      transaction,
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
        transaction,
      });

      await SurveyDetail.destroy({
        where: { SurveyID: survey.SurveyID },
        transaction,
      });

      await Survey.destroy({
        where: { SurveyID: survey.SurveyID },
        transaction,
      });
    }

    // Find and delete all user packages
    await UserPackage.destroy({
      where: { UserID: UserID },
      transaction,
    });

    // Find all company user records associated with the user
    const companyUsers = await CompanyUser.findAll({
      where: { UserID: UserID },
      transaction,
    });

    // Delete related entries in UserActivityLogs
    await UserActivityLog.destroy({
      where: { UserID: UserID },
      transaction,
    });

    for (const companyUser of companyUsers) {
      const companyID = companyUser.CompanyID;
      const companyUserID = companyUser.CompanyUserID;

      // Delete related records in IndividualPermission
      await IndividualPermission.destroy({
        where: { CompanyUserID: companyUserID },
        transaction,
      });

      // Delete the company user record
      await CompanyUser.destroy({
        where: { CompanyUserID: companyUserID },
        transaction,
      });

      // Check if the user is an admin of the company
      const company = await Company.findOne({
        where: { CompanyID: companyID, AdminID: UserID },
        transaction,
      });

      // If the user is an admin, delete the company and its associated records
      if (company) {
        const companyroles = await CompanyRole.findAll({
          where: { CompanyID: companyID },
        });
        for (const companyrole of companyroles) {
          await RolePermission.destroy({
            where: { CompanyRoleID: companyrole.CompanyRoleID },
          });
        }
        await CompanyRole.destroy({ where: { CompanyID: companyID } });
        await Company.destroy({
          where: { AdminID: UserID },
          transaction,
        });
      }
    }

    // Delete the user
    const deletedUser = await User.destroy({
      where: { UserID: UserID },
      transaction,
    });

    // Commit all deletions if successful
    if (deletedUser) {
      await transaction.commit();
      await createLogActivity(
        udata.id,
        "DELETE",
        `User deleted with ID: ${UserID}`,
        "Users",
        udata.companyID
      );
      return {
        status: true,
        message: "User and all related records deleted successfully",
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
      error: error.toString(),
    };
  }
};

const getOneUser = async (UserID) => {
  try {
    const user = await User.findOne({
      where: { UserID: UserID },
    });

    if (!user) {
      return { status: false, message: "User not found" };
    }

    if(user.UserRole !='SuperAdmin') {
      companyUser = await CompanyUser.findOne({
        where: { UserID: UserID },
      });
  
      if (companyUser) {
        return { status: true, data: user, hasData: true };
      }
    }

    return { status: true, data: user,  hasData: false };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Failed to retrieve user details",
      error: error?.toString(),
    };
  }
};

const getAllUsers = async (
  requestingUserRole,
  requestingUserCompanyId,
) => {
  try {

    let queryOptions = {
      attributes: [
        "UserID",
        "UserAvatar",
        "Username",
        "FirstName",
        "LastName",
        "Email",
        "UserRole",
        "IsActive",
      ],
    };

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

    const { rows: users } = await User.findAndCountAll(queryOptions);

    return { status: true, data: users };
  } catch (error) {
    console.error("Error in getAllUsers service: ", error);
    return {
      status: false,
      message: error.message || "Failed to retrieve users",
      error: error.toString(),
    };
  }
};

const searchUsers = async (column, searchTerm) => {
  try {
    const validColumns = [
      "Username",
      "Email",
      "PhoneNumber",
      "UserRole",
      "IsActive",
    ];
    if (!validColumns.includes(column) && column !== "Fullname") {
      return {
        status: false,
        message: "Invalid search column",
      };
    }

    let whereClause;
    if (column === "Fullname") {
      // Split names by spaces, hyphens, or capital letters
      let names = searchTerm.split(/\s|-/).map((name) => name.trim());

      // If it's a single string like "NancyMiller", split it further using capital letters
      if (names.length === 1 && names[0].length > 1) {
        names = searchTerm.split(/(?=[A-Z])/).map((name) => name.trim());
      }

      if (names.length === 1) {
        whereClause = {
          [Op.or]: [
            { FirstName: { [Op.like]: `%${names[0]}%` } },
            { LastName: { [Op.like]: `%${names[0]}%` } },
          ],
        };
      } else {
        whereClause = {
          [Op.or]: [
            {
              [Op.and]: [
                { FirstName: { [Op.like]: `%${names[0]}%` } },
                { LastName: { [Op.like]: `%${names[1]}%` } },
              ],
            },
            {
              [Op.and]: [
                { FirstName: { [Op.like]: `%${names[1]}%` } },
                { LastName: { [Op.like]: `%${names[0]}%` } },
              ],
            },
          ],
        };
      }
    } else {
      whereClause = { [column]: { [Op.like]: `%${searchTerm}%` } };
    }

    const users = await User.findAll({ where: whereClause });

    if (!users || users.length === 0) {
      return {
        status: false,
        message: "No users found for the given search criteria",
      };
    }

    return {
      status: true,
      data: users,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Failed to search users",
      error: error?.toString(),
    };
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getOneUser,
  getAllUsers,
  searchUsers,
  getUserData,
};
