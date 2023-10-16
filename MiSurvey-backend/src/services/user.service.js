const { User } = require('../models');
const bcrypt = require('bcrypt');

// Create user by SuperAdmin
const superAdminCreateUser = async (userData) => {
    try {
      userData.UserPassword = await bcrypt.hash(userData.UserPassword, 10); // Hash password before saving
      const newUser = await User.create(userData);
      return { status: true, message: "User created successfully" , newUser: newUser };
    } catch (error) {
      return { status: false, message: error?.message };
    }
  };

  // Update user by SuperAdmin
  const superAdminUpdateUser = async (id, userData) => {
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
      return { status: false, message: error?.message };
    }
  };

  // Delete user by SuperAdmin
  const superAdminDeleteUser = async (id) => {
    try {
      await User.destroy({ where: { UserID: id } });
      return { status: true, message: "User deleted successfully"};
    } catch (error) {
      return { status: false, message: error?.message };
    }
  };
  
  module.exports = {
    superAdminCreateUser,
    superAdminUpdateUser,
    superAdminDeleteUser
  };
  