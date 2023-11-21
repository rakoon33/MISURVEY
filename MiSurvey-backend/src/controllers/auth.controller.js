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

const registerUserController = async (req, res) => {
  try {
      const userData = req.body; // Get the entire request body as userData
      const result = await authService.registerUser(userData); // Pass userData as a single object
      res.status(201).json(result);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};


module.exports = {
  loginController,
  registerUserController,
  logoutController
};