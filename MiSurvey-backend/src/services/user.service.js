const User = require('../models/users');  // Adjust the path to your User model file

const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({
      where: {
        Username: username
      }
    });
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUserByUsername,
  // ...other exported functions
};
