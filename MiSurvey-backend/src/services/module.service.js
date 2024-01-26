const { Module } = require("../models");
const { Op } = require("sequelize");

const createModule = async (moduleData) => {
  try {
    const module = await Module.create(moduleData);
    return { status: true, message: "Module created successfully", module };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const updateModule = async (id, moduleData) => {
  try {
    const [updatedRows] = await Module.update(moduleData, {
      where: { ModuleID: id },
    });
    if (updatedRows === 0) {
      return { status: false, message: "No module updated" };
    }
    return { status: true, message: "Module updated successfully" };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const deleteModule = async (id) => {
  try {
    await Module.destroy({ where: { ModuleID: id } });
    return { status: true, message: "Module deleted successfully" };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const getAllModules = async () => {
  try {
    const modules = await Module.findAll();
    return { status: true, message: "Modules fetched successfully", modules };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const getOneModule = async (id) => {
  try {
    const module = await Module.findByPk(id);
    if (!module) {
      return { status: false, message: "Module not found" };
    }
    return { status: true, message: "Module fetched successfully", module };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const searchModules = async (query) => {
  try {
    console.log("Searching modules');", query);
    const modules = await Module.findAll({
      where: {
        ModuleName: {
          [Op.like]: "%" + query + "%",
        },
      },
    });

    if (modules.length === 0) {
      return { status: false, message: "No modules found" };
    }

    return { status: true, message: "Modules fetched successfully", modules };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

module.exports = {
  createModule,
  updateModule,
  deleteModule,
  getAllModules,
  getOneModule,
  searchModules,
};
