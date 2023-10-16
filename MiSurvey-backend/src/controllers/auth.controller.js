const { authService } = require('../services');

const superAdminLoginController = async (req, res) => {
    console.log(
        `auth.controller | superAdminLoginController | ${req?.originalUrl}`
    );

    try {
      const result = await authService.superAdminLogin(req.body.username, req.body.password);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

module.exports = {
    superAdminLoginController,
};