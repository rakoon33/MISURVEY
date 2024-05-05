const { moduleService } = require("../services");

const createModuleController = async (req, res) => {
  console.log(req.body);
  try {
    const newUser = await moduleService.createModule(req.body, req.user);
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateModuleController = async (req, res) => {
  try {
    const result = await moduleService.updateModule(
      req.params.ModuleID,
      req.body,
      req.user
    );
    if (result.status) {
      res.json(result);
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteModuleController = async (req, res) => {
  try {
    const result = await moduleService.deleteModule(req.params.ModuleID, req.user);
    if (result.status) {
      res.json(result);
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const searchModulesController = async (req, res) => {
  try {
    const { name } = req.query;
    const result = await moduleService.searchModules(name);
    if (result.status) {
      res.json(result);
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOneModuleController = async (req, res) => {
  try {
    const result = await moduleService.getOneModule(req.params.ModuleID);
    if (result.status) {
      res.json(result);
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllModulesController = async (req, res) => {
  try {
    const result = await moduleService.getAllModules();
    if (result.status) {
      res.json(result);
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createModuleController,
  updateModuleController,
  deleteModuleController,
  getAllModulesController,
  getOneModuleController,
  searchModulesController,
};
