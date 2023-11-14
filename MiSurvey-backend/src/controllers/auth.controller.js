const { authService } = require('../services');

const loginController = async (req, res) => {
    try {
      const result = await authService.loginUser(res, req.body.username, req.body.password);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

const logoutController = async (req, res) => {
  try {
    const result = await authService.logoutUser(res);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  loginController,
  logoutController
};