const { User } = require('../models');
const bcrypt = require('bcrypt');

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
const getUserDetailsByID = async (id) => {
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
const getAllUsers = async () => {
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


module.exports = {
    createUserBySuperAdmin,
    updateUserBySuperAdmin,
    deleteUserBySuperAdmin,
    getUserDetailsByID,
    getAllUsers
};
