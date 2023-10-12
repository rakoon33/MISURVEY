const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');


const adminLogin = async (username, password) => {
  console.log(
    `auth.service | adminLogin`
);
  const user = await User.findOne({ where: { Username: username } });
  if (!user || !bcrypt.compare(password, user.Password)) {
    throw new Error('Invalid username or password');
  }
  if (user.Role !== 'Superadmin') {
    throw new Error('Access denied');
  }
  const token = jwt.sign({ id: user.UserID, role: user.Role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return token;
};

module.exports = {
  adminLogin,
  // ...other exported functions
};