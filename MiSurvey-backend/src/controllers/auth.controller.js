const { authService } = require('../services');

const loginBySuperAdminController = async (req, res) => {
    console.log(
        `auth.controller | loginBySuperAdminController | ${req?.originalUrl}`
    );

    try {
      const result = await authService.loginBySuperAdmin(req.body.username, req.body.password);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

module.exports = {
    loginBySuperAdminController,
};