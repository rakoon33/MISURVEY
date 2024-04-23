const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const {
  User,
  CompanyUser,
  Company,
  IndividualPermission,
  RolePermission,
  Module,
  UserActivityLog
} = require("../models");
const db = require("../config/database");
const {createLogActivity} = require ("./userActivityLog.service");

const getUserData = async (userId, userRole) => {
  try {
    const userDetails = await User.findByPk(userId);
    if (!userDetails) {
      return {
        status: false,
        message: "User not found",
      };
    }
    const { UserPassword, ...userDetailsWithoutPassword } =
      userDetails.dataValues;

    if (userRole === "SuperAdmin" || userRole === "Admin") {
      return {
        status: true,
        userDetails: userDetailsWithoutPassword,
      };
    }

    const companyUser = await CompanyUser.findOne({
      where: { UserID: userId },
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
      userDetails: userDetailsWithoutPassword,
      permissions: mergedPermissions,
    };
  } catch (error) {
    throw new Error(error.message || "Failed to fetch permissions");
  }
};

const createUser = async (userData, udata) => {
  try {
    userData.UserPassword = await bcrypt.hash(userData.UserPassword, 10); // Hash password before saving
    const newUser = await User.create(userData);
    await createLogActivity(udata.id, 'INSERT', `User created with ID: ${newUser.UserID}`, 'Users', udata.companyID);
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
    if (updatedRows === 0) {
      return { status: false, message: "No rows updated" };
    }

    const updatedUser = await User.findOne({ where: { UserID: UserID } });
    await createLogActivity(udata.id, 'UPDATE', `User updated with ID: ${UserID}`, 'Users', udata.companyID);

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

/*const deleteUser = async (UserID) => {
  try {
    const deletedUser = await User.findOne({ where: { UserID: UserID } });

    if (!deletedUser) {
      return {
        status: false,
        message: "User not found",
      };
    }

    await User.destroy({ where: { UserID: UserID } });

    return {
      status: true,
      message: "User deleted successfully",
      data: {
        user: deletedUser,
      },
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "User deletion failed",
      error: error?.toString(),
    };
  }
};*/

const deleteUser = async (UserID, udata) => {
  const transaction = await db.sequelize.transaction();
  try {
    // Find companies administered by the given admin ID
    const companies = await Company.findAll({
      where: { AdminID: UserID },
      transaction
    });

    for (const company of companies) {
      // Delete related entries in UserActivityLogs
      await UserActivityLog.destroy({
        where: { CompanyID: company.CompanyID },
        transaction
      });

      // Delete related CompanyUser records
      await CompanyUser.destroy({
        where: { CompanyID: company.CompanyID },
        transaction
      });

      // Delete the company
      await Company.destroy({
        where: { CompanyID: company.CompanyID },
        transaction
      });
    }

    const deletedUser = await User.destroy({
      where: { UserID: UserID },
      transaction
    });

    // Commit all deletions if successful
    if (deletedUser) {
      await transaction.commit();
      await createLogActivity(udata.id, 'DELETE', `User deleted with ID: ${UserID}`, 'Users', udata.companyID);
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
      message: "Failed to delete companies and related data.",
      error: error.toString()
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

    return { status: true, data: user };
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
  page,
  pageSize
) => {
  try {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

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
      offset,
      limit,
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

    const { count, rows: users } = await User.findAndCountAll(queryOptions);

    return { status: true, data: users, total: count };
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
