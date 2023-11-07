const jwt = require('jsonwebtoken');

const generateToken = (id, username, role) => {

    return token = jwt.sign(
        { id: id, username: username, role: role }, 
        process.env.JWT_SECRET, { expiresIn: '30d' }
    );
}

module.exports = {
    generateToken
};
  