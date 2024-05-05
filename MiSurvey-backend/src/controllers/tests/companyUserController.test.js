const {
    createCompanyUserController,
    deleteCompanyUserController,
    getOneCompanyUserController,
    getAllCompanyUsersController,
} = require("../companyUser.controller");

const companyUserService = require("../../services/companyUser.service");
jest.mock("../../services/companyUser.service", () => ({
    createCompanyUser: jest.fn(),
    deleteCompanyUser: jest.fn(),
    getOneCompanyUser: jest.fn(),
    getAllCompanyUsers: jest.fn(),
}));