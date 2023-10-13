const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');  


const adminLogin = async (username, password) => {
  
  console.log(`auth.service | adminLogin`);

  try {
    const user = await User.findOne({ where: { Username: username } });

    if (user) {
      if (user.Role !== 'SuperAdmin') {
        throw new Error('Access denied');
      }

      console.log("Entered password:", password.trim());
      console.log("Stored hash:", user.Password);

      const isPasswordVerified = await bcrypt.compare(password.trim(), user.Password);

      console.log("bcrypt.compare result:", isPasswordVerified);
      
      if (isPasswordVerified) {
        const token = jwt.sign({ id: user.UserID, username: user.Username, role: user.Role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return {
          status: true,
          message: "User login successful",
          data: token
        };
      } else {
          return {
              status: false,
              message: "Incorrect password"
          };
      }
    } else {
        return {
            status: false,
            message: "No user found"
        };
    }
  } catch (error) {
    console.log(error);   
        return {
            status: false,
            message: "User login failed",
            error: error?.toString()
        } 
  }
};

module.exports = {
  adminLogin,
  // ...other exported functions
};