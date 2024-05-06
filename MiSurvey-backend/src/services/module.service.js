const { Module, IndividualPermission, RolePermission } = require("../models");
const { Op } = require("sequelize");
const {createLogActivity} = require ("./userActivityLog.service");
const db = require("../config/database");

const createModule = async (moduleData, udata) => {
  try {
    const module = await Module.create(moduleData);
    await createLogActivity(udata.id, 'INSERT', `Module created with ID: ${module.ModuleID}`, 'Modules', udata.companyID);
    return { status: true, message: "Module created successfully", module };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const updateModule = async (id, moduleData, udata) => {
  try {
    const module = await Module.findByPk(id);
    if (!module) {
      return {
        status: false,
        message: "Module not found",
      };
    }

    const [updatedRows] = await Module.update(moduleData, {
      where: { ModuleID: id },
    });
    if (updatedRows === 0) {
      return { status: false, message: "No module updated" };
    }
    await createLogActivity(udata.id, 'UPDATE', `Module updated with ID: ${id}`, 'Modules', udata.companyID);
    return { status: true, message: "Module updated successfully" };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const deleteModule = async (id, udata) => {
  try {
    const transaction = await db.sequelize.transaction();

    const module = await Module.findByPk(id, { transaction });

    if (!module) {
      await transaction.rollback();
      return { status: false, message: "Module not found" };
    }

    // Retrieve and delete individual permissions associated with the module
    const individualPermissions = await IndividualPermission.findAll({
      where: { ModuleID: id },
      transaction
    });
    for (const permission of individualPermissions) {
      // Perform additional operations if needed, e.g., logging
      await permission.destroy({ transaction });
    }

    // Retrieve and delete role permissions associated with the module
    const rolePermissions = await RolePermission.findAll({
      where: { ModuleID: id },
      transaction
    });
    for (const permission of rolePermissions) {
      // Perform additional operations if needed, e.g., logging
      await permission.destroy({ transaction });
    }

    // Delete the module
    await Module.destroy({ where: { ModuleID: id }, transaction });

    // Log the deletion
    await createLogActivity(udata.id, 'DELETE', `Module deleted with ID: ${id}`, 'Modules', udata.companyID, transaction);

    await transaction.commit();
    return { status: true, message: "Module and all related permissions deleted successfully" };
  } catch (error) {
    await transaction.rollback();
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
