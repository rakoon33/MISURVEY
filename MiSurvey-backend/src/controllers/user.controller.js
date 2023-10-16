const { superAdminCreateUser, superAdminUpdateUser, superAdminDeleteUser } = require('../services/user.service');

const superAdminCreateUserController = async (req, res) => {
    console.log(`SuperAdmin.controller | superAdminCreateUserController | ${req?.originalUrl}`);
    console.log(req.body)
    try {
        const newUser = await superAdminCreateUser(req.body);
        res.json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const superAdminUpdateUserController = async (req, res) => {
    console.log(`SuperAdmin.controller | superAdminUpdateUserController | ${req?.originalUrl}`);
    console.log(req.body);
    console.log("ID:", req.params.id);

    try {
        const result = await superAdminUpdateUser(req.params.id, req.body);  
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const superAdminDeleteUserController = async (req, res) => {
    console.log(`SuperAdmin.controller | superAdminDeleteUserController | ${req?.originalUrl}`);
    try {
        const result = await superAdminDeleteUser(req.params.id);  
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    superAdminCreateUserController,
    superAdminUpdateUserController,
    superAdminDeleteUserController
};
