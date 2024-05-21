const { Customer, SurveyResponse, Survey } = require("../models");
const { Op } = require("sequelize");
const db = require("../config/database");

const createCustomer = async (customerData) => {
  try {
    const customer = await Customer.create(customerData);
    return { status: true, message: "Customer created successfully", customer };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const updateCustomer = async (id, customerData) => {
  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return {
        status: false,
        message: "Customer not found",
      };
    }

    const [updatedRows] = await Customer.update(customerData, {
      where: { CustomerID: id },
    });
    if (updatedRows === 0) {
      return { status: false, message: "No customer updated" };
    }
    return { status: true, message: "Customer updated successfully" };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const deleteCustomer = async (id) => {
  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return { status: false, message: "Customer not found" };
    }

    const transaction = await db.sequelize.transaction();
    const responses = await SurveyResponse.findAll({
      where: { CustomerID: id },
      transaction,
    });
    for (const response of responses) {
      await SurveyResponse.destroy({
        where: { ResponseID: response.ResponseID },
        transaction,
      });
    }
    await Customer.destroy({ where: { CustomerID: id }, transaction });
    await transaction.commit();

    return { status: true, message: "Customer deleted successfully" };
  } catch (error) {
    await transaction.rollback();
    return { status: false, message: error.message, error: error.toString() };
  }
};

const getAllCustomers = async (page, pageSize, userData) => {
  try {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const customers = await Customer.findAll({
      include: [
        {
          model: SurveyResponse,
          as: "Responses",
          include: [
            {
              model: Survey,
              as: "Survey",
              where: { CompanyID: userData.companyID },
            },
          ],
        },
      ],
      order: [["CreatedAt", "DESC"]],
      limit: limit,
      offset: offset,
    });

    customerCount = customers.length;
    return {
      status: true,
      message: "Customers fetched successfully",
      customers,
      total: customerCount,
    };
  } catch (error) {
    console.error("Error fetching customers: ", error);
    return { status: false, message: error.message, error: error.toString() };
  }
};

const getOneCustomer = async (id) => {
  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return { status: false, message: "Customer not found" };
    }

    return { status: true, message: "Customer fetched successfully", customer };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const searchCustomers = async (query) => {
  try {
    console.log("Searching customers", query);
    const customers = await Customer.findAll({
      where: {
        FullName: {
          [Op.like]: "%" + query + "%",
        },
      },
    });

    if (customers.length === 0) {
      return { status: false, message: "No customers found" };
    }

    return {
      status: true,
      message: "Customers fetched successfully",
      customers,
    };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

module.exports = {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getAllCustomers,
  getOneCustomer,
  searchCustomers,
};
