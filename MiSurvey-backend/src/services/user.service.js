const { User } = require('../models');
const bcrypt = require('bcrypt');

// Create user by SuperAdmin
const createUserBySuperAdmin = async (userData) => {
    try {
      userData.UserPassword = await bcrypt.hash(userData.UserPassword, 10); // Hash password before saving
      const newUser = await User.create(userData);
      return { status: true, message: "User created successfully" , newUser: newUser };
    } catch (error) {
      return {
        status: false,
        message: error.message || "User created failed",
        error: error?.toString(),
      };
    }
  };

  // Update user by SuperAdmin
  const updateUserBySuperAdmin = async (id, userData) => {
    try {
      if (userData.UserPassword) {
        userData.UserPassword = await bcrypt.hash(userData.UserPassword, 10); 
      }
      const [updatedRows] = await User.update(userData, { where: { UserID: id} });
      if (updatedRows === 0) {
        return { status: false, message: "No rows updated" };
    }
      return { status: true, message: "User updated successfully" };
    } catch (error) {
      return {
        status: false,
        message: error.message || "User updated failed",
        error: error?.toString(),
      };
    }
  };

  // Delete user by SuperAdmin
  const deleteUserBySuperAdmin = async (id) => {
    try {
      await User.destroy({ where: { UserID: id } });
      return { status: true, message: "User deleted successfully"};
    } catch (error) {
      return {
        status: false,
        message: error.message || "User deleted failed",
        error: error?.toString(),
      };
    }
  };
  
  module.exports = {
    createUserBySuperAdmin,
    updateUserBySuperAdmin,
    deleteUserBySuperAdmin
  };
  