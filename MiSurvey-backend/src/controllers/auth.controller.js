const { authService } = require('../services');

const adminLoginController = async (req, res) => {
    console.log(
        `auth.controller | adminLoginController | ${req?.originalUrl}`
    );

    try {
      const result = await authService.adminLogin(req.body.username, req.body.password);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

module.exports = {
    adminLoginController,
};