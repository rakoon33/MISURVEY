const jwt = require('jsonwebtoken');

const generateToken = (id, username, role, companyID = null) => {
    const payload = { 
      id: id, 
      username: username, 
      role: role
    };
  
    // Chỉ thêm CompanyID vào payload nếu nó có giá trị
    if (companyID !== null) {
      payload.companyID = companyID;
    }
  
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  }
module.exports = {
    generateToken
};