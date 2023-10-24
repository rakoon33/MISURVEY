const { User } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

// Create user by SuperAdmin
const createUserBySuperAdmin = async (userData) => {
    try {
        userData.UserPassword = await bcrypt.hash(userData.UserPassword, 10); // Hash password before saving
        const newUser = await User.create(userData);
        return {
            status: true,
            message: "User created successfully",
            data: {
                user: newUser
            }
        };
    } catch (error) {
        return {
            status: false,
            message: error.message || "User creation failed",
            error: error?.toString()
        };
    }
};

// Update user by SuperAdmin
const updateUserBySuperAdmin = async (id, userData) => {
    try {
        if (userData.UserPassword) {
            userData.UserPassword = await bcrypt.hash(userData.UserPassword, 10);
        }
        const [updatedRows] = await User.update(userData, { where: { UserID: id } });
        if (updatedRows === 0) {
            return { status: false, message: "No rows updated" };
        }
        
        // Fetch the updated user
        const updatedUser = await User.findOne({ where: { UserID: id } });

        return {
            status: true,
            message: "User updated successfully",
            data: {
                user: updatedUser
            }
        };
    } catch (error) {
        return {
            status: false,
            message: error.message || "User update failed",
            error: error?.toString()
        };
    }
};

// Delete user by SuperAdmin
const deleteUserBySuperAdmin = async (id) => {
    try {
        const deletedUser = await User.findOne({ where: { UserID: id } });

        if (!deletedUser) {
            return {
                status: false,
                message: "User not found"
            };
        }

        await User.destroy({ where: { UserID: id } });

        return {
            status: true,
            message: "User deleted successfully",
            data: {
                user: deletedUser
            }
        };
    } catch (error) {
        return {
            status: false,
            message: error.message || "User deletion failed",
            error: error?.toString()
        };
    }
};

// API to retrieve all details of a specific user based on the UserID
const getOneUserDetailBySuperAdmin = async (id) => {
  try {
    const user = await User.findOne({
      where: { UserID: id }
      // All attributes will be fetched by default
    });

    if (!user) {
      return { status: false, message: "User not found" };
    }

    return { status: true, user };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Failed to retrieve user details",
      error: error?.toString(),
    };
  }
};

// API to retrieve a list of all users with their basic details
const getAllUsersBySuperAdmin = async () => {
  try {
    const users = await User.findAll({
      attributes: ['UserID', 'UserAvatar', 'Username', 'FirstName', 'LastName', 'Email', 'UserRole', 'IsActive']
    });

    if (!users || users.length === 0) {
      return { status: false, message: "No users found" };
    }

    return { status: true, users };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Failed to retrieve users",
      error: error?.toString(),
    };
  }
};

const searchUsersBySuperAdmin = async (column, searchTerm) => {
    try {
        const validColumns = ['Username', 'Email', 'PhoneNumber', 'UserRole', 'IsActive'];
        if (!validColumns.includes(column) && column !== "Fullname") {
            return {
                status: false,
                message: "Invalid search column"
            };
        }

        let whereClause;
        if (column === "Fullname") {
            // Split names by spaces, hyphens, or capital letters
            let names = searchTerm.split(/\s|-/).map(name => name.trim());
            
            // If it's a single string like "NancyMiller", split it further using capital letters
            if (names.length === 1 && names[0].length > 1) {
                names = searchTerm.split(/(?=[A-Z])/).map(name => name.trim());
            }

            if (names.length === 1) {
                whereClause = {
                    [Op.or]: [
                        { FirstName: { [Op.like]: `%${names[0]}%` } },
                        { LastName: { [Op.like]: `%${names[0]}%` } }
                    ]
                };
            } else {
                whereClause = {
                    [Op.or]: [
                        { [Op.and]: [{ FirstName: { [Op.like]: `%${names[0]}%` } }, { LastName: { [Op.like]: `%${names[1]}%` } }] },
                        { [Op.and]: [{ FirstName: { [Op.like]: `%${names[1]}%` } }, { LastName: { [Op.like]: `%${names[0]}%` } }] }
                    ]
                };
            }
        } else {
            whereClause = { [column]: { [Op.like]: `%${searchTerm}%` } };
        }

        const users = await User.findAll({ where: whereClause });

        if (!users || users.length === 0) {
            return {
                status: false,
                message: "No users found for the given search criteria"
            };
        }

        return {
            status: true,
            users
        };
    } catch (error) {
        return {
            status: false,
            message: error.message || "Failed to search users",
            error: error?.toString()
        };
    }
};


module.exports = {
    createUserBySuperAdmin,
    updateUserBySuperAdmin,
    deleteUserBySuperAdmin,
    getOneUserDetailBySuperAdmin,
    getAllUsersBySuperAdmin,
    searchUsersBySuperAdmin
};
