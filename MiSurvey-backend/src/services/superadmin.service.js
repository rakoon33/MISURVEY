const { User } = require('../models');
const bcrypt = require('bcrypt');

// Create Superadmin
const createSuperadmin = async (userData) => {
    try {
      userData.Password = await bcrypt.hash(userData.Password, 10); // Hash password before saving
      const newUser = await User.create(userData);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  // Update Superadmin
  const updateSuperadmin = async (id, userData) => {
    try {
      if (userData.Password) {
        userData.Password = await bcrypt.hash(userData.Password, 10); 
      }
      const [updatedRows] = await User.update(userData, { where: { UserID: id} });
      if (updatedRows === 0) {
        throw new Error('No rows updated');
    }
      return { message: "User updated successfully" };
    } catch (error) {
      throw error;
    }
  };
  
  // Delete Superadmin
  const deleteSuperadmin = async (id) => {
    try {
      await User.destroy({ where: { UserID: id } });
      return { message: "User deleted successfully" };
    } catch (error) {
      throw error;
    }
  };
  
  module.exports = {
    createSuperadmin,
    updateSuperadmin,
    deleteSuperadmin
  };
  