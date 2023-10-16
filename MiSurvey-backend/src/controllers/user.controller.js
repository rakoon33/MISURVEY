const { userService } = require('../services');

const createUserSuperAdminController = async (req, res) => {
    console.log(`SuperAdmin.controller | createUserSuperAdminController | ${req?.originalUrl}`);
    console.log(req.body)
    try {
        const newUser = await userService.createUserBySuperAdmin(req.body);
        res.json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateUserSuperAdminController = async (req, res) => {
    console.log(`SuperAdmin.controller | updateUserSuperAdminController | ${req?.originalUrl}`);
    console.log(req.body);
    console.log("ID:", req.params.id);

    try {
        const result = await userService.updateUserBySuperAdmin(req.params.id, req.body);  
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteUserSuperAdminController = async (req, res) => {
    console.log(`SuperAdmin.controller | deleteUserSuperAdminController | ${req?.originalUrl}`);
    try {
        const result = await userService.deleteUserBySuperAdmin(req.params.id);  
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createUserSuperAdminController,
    updateUserSuperAdminController,
    deleteUserSuperAdminController
};
