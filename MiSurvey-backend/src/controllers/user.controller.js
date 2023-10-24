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

const getUserDetailsByIDSuperAdminController = async (req, res) => {
    console.log(`SuperAdmin.controller | getUserDetailsByIDSuperAdminController | ${req?.originalUrl}`);
    try {
        const userDetails = await userService.getOneUserDetailBySuperAdmin(req.params.id);
        res.json(userDetails);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllUsersSuperAdminController = async (req, res) => {
    console.log(`SuperAdmin.controller | getAllUsersSuperAdminController | ${req?.originalUrl}`);
    try {
        const allUsers = await userService.getAllUsersBySuperAdmin();
        res.json(allUsers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const searchUserSuperAdminController = async (req, res) => {
    try {
        const { column, searchTerm } = req.query;

        if (!column || !searchTerm) {
            return res.status(400).json({ message: 'Both column and searchTerm are required as query parameters.' });
        }
        const result = await userService.searchUsersBySuperAdmin(column, searchTerm);

        if (result.status) {
            res.json(result.users);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to search users.' });
    }
};

module.exports = {
    createUserSuperAdminController,
    updateUserSuperAdminController,
    deleteUserSuperAdminController,
    getUserDetailsByIDSuperAdminController,
    getAllUsersSuperAdminController,
    searchUserSuperAdminController
};
