const { createSuperadmin, updateSuperadmin, deleteSuperadmin } = require('../services/superadmin.service');

const createSuperadminController = async (req, res) => {
    console.log(`Superadmin.controller | createSuperadminController | ${req?.originalUrl}`);
    console.log(req.body)
    try {
        const newUser = await createSuperadmin(req.body);
        res.json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateSuperadminController = async (req, res) => {
    console.log(`Superadmin.controller | updateSuperadminController | ${req?.originalUrl}`);
    console.log(req.body);
    console.log("ID:", req.params.id);

    try {
        const result = await updateSuperadmin(req.params.id, req.body);  
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSuperadminController = async (req, res) => {
    console.log(`Superadmin.controller | deleteSuperadminController | ${req?.originalUrl}`);
    try {
        const result = await deleteSuperadmin(req.params.id);  
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createSuperadminController,
    updateSuperadminController,
    deleteSuperadminController
};
