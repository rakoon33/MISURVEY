const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const {
  User,
  CompanyUser,
  Company,
  IndividualPermission,
  RolePermission,
  Module,
} = require("../models");
const db = require("../config/database");

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

const createUser = async (userData) => {
  try {
    userData.UserPassword = await bcrypt.hash(userData.UserPassword, 10); // Hash password before saving
    const newUser = await User.create(userData);
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

const updateUser = async (UserID, userData) => {
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

const deleteUser = async (UserID) => {
  const transaction = await db.sequelize.transaction();
  try {
    const user = await User.findOne({ where: { UserID: UserID } });

    if (!user) {
      return {
        status: false,
        message: "User not found",
      };
    }

    // Xóa tất cả các bản ghi CompanyUser liên quan đến UserID này
    const deletedCompanyUsers = await CompanyUser.destroy({
      where: { UserID: UserID },
      transaction
    });

    // Kiểm tra xem có bản ghi CompanyUser nào được xóa không
    console.log(`Deleted ${deletedCompanyUsers} CompanyUser records.`);

    // Xóa người dùng sau khi đã xóa các bản ghi CompanyUser liên quan
    const deletedUser = await User.destroy({
      where: { UserID: UserID },
      transaction
    });

    // Kiểm tra xem người dùng có được xóa không
    if (deletedUser) {
      await transaction.commit();
      return {
        status: true,
        message: "User and related CompanyUser records deleted successfully",
      };
    } else {
      throw new Error("User deletion failed");
    }
  } catch (error) {
    await transaction.rollback();
    return {
      status: false,
      message: error.message || "Failed to delete user and related company user records",
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
