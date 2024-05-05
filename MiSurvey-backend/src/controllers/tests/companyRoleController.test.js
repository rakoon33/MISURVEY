const {
    createCompanyRoleController,
    updateCompanyRoleController,
    deleteCompanyRoleController,
    getAllCompanyRolesController,
    getOneCompanyRoleController,
    searchCompanyRolesController
} = require("../companyrole.controller");

const companyRoleService = require("../../services/companyrole.service");
jest.mock("../../services/companyrole.service", () => ({
    createCompanyRole: jest.fn(),
    updateCompanyRole: jest.fn(),
    deleteCompanyRole: jest.fn(),
    getAllCompanyRoles: jest.fn(),
    getOneCompanyRole: jest.fn(),
    searchCompanyRoles: jest.fn(),
}));

describe("CompanyRole controller: createCompanyRoleController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully create a company role and return a success message", async () => {
      const req = {
        body: {
          roleData: { RoleName: "Manager", Description: "Manages teams" },
          permissionsData: [
            { Permission: "read" },
            { Permission: "write" },
          ],
        },
        user: { companyID: "1", id: "2" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Company Role and Role Permissions created successfully",
        data: {
          role: { CompanyRoleID: "3", RoleName: "Manager", Description: "Manages teams" },
          permissions: [
            { Permission: "read" },
            { Permission: "write" },
          ],
        },
      };
  
      companyRoleService.createCompanyRole.mockResolvedValue(mockResponse);
  
      await createCompanyRoleController(req, res);
  
      expect(companyRoleService.createCompanyRole).toHaveBeenCalledWith(
        req.body.roleData,
        req.body.permissionsData,
        req.user.companyID,
        req.user
      );
      expect(res.status).not.toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return a 400 status and error message on service error", async () => {
      const req = {
        body: {
          roleData: { RoleName: "Manager", Description: "Manages teams" },
          permissionsData: [
            { Permission: "read" },
            { Permission: "write" },
          ],
        },
        user: { companyID: "1", id: "2" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      companyRoleService.createCompanyRole.mockRejectedValue(new Error("Service error"));
  
      await createCompanyRoleController(req, res);
  
      expect(companyRoleService.createCompanyRole).toHaveBeenCalledWith(
        req.body.roleData,
        req.body.permissionsData,
        req.user.companyID,
        req.user
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("CompanyRole controller: updateCompanyRoleController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should return 400 if roleData or permissionsData are missing", async () => {
      const req = {
        body: {},
        params: {},
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      await updateCompanyRoleController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: "roleData and permissionsData are required.",
      });
    });
  
    it("should return 400 if CompanyRoleID is missing", async () => {
      const req = {
        body: { roleData: {}, permissionsData: [] },
        params: {}, // No CompanyRoleID
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      await updateCompanyRoleController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: "CompanyRoleID is required.",
      });
    });
  
    it("should successfully update a company role and return a success message", async () => {
      const req = {
        body: {
          roleData: { CompanyRoleName: "Manager" },
          permissionsData: [{ ModuleID: 1, Permission: "read" }],
        },
        params: { CompanyRoleID: "1" },
        user: { id: "2", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Company Role and Permissions updated successfully",
        data: {
          role: {
            CompanyRoleID: "1",
            CompanyRoleName: "Manager",
            permissions: [{ ModuleID: 1, Permission: "read" }],
          },
        },
      };
  
      companyRoleService.updateCompanyRole.mockResolvedValue(mockResponse);
  
      await updateCompanyRoleController(req, res);
  
      expect(companyRoleService.updateCompanyRole).toHaveBeenCalledWith(
        "1",
        req.body.roleData,
        req.body.permissionsData,
        req.user
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return a 500 status and error message on service error", async () => {
      const req = {
        body: {
          roleData: { CompanyRoleName: "Manager" },
          permissionsData: [{ ModuleID: 1, Permission: "read" }],
        },
        params: { CompanyRoleID: "1" },
        user: { id: "2", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      companyRoleService.updateCompanyRole.mockRejectedValue(new Error("Service error"));
  
      await updateCompanyRoleController(req, res);
  
      expect(companyRoleService.updateCompanyRole).toHaveBeenCalledWith(
        "1",
        req.body.roleData,
        req.body.permissionsData,
        req.user
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: "Service error",
      });
    });
});

describe("CompanyRole controller: deleteCompanyRoleController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully delete a company role and return a success message", async () => {
      const req = {
        params: { CompanyRoleID: "1" },
        user: { id: "2", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Company Role and all associated data deleted successfully",
      };
  
      companyRoleService.deleteCompanyRole.mockResolvedValue(mockResponse);
  
      await deleteCompanyRoleController(req, res);
  
      expect(companyRoleService.deleteCompanyRole).toHaveBeenCalledWith("1", req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if company role is not found", async () => {
      const req = {
        params: { CompanyRoleID: "invalidRoleId" },
        user: { id: "2", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      companyRoleService.deleteCompanyRole.mockResolvedValue({
        status: false,
        message: "Company Role not found",
      });
  
      await deleteCompanyRoleController(req, res);
  
      expect(companyRoleService.deleteCompanyRole).toHaveBeenCalledWith("invalidRoleId", req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Company Role not found",
      });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        params: { CompanyRoleID: "1" },
        user: { id: "2", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      companyRoleService.deleteCompanyRole.mockRejectedValue(new Error("Service error"));
  
      await deleteCompanyRoleController(req, res);
  
      expect(companyRoleService.deleteCompanyRole).toHaveBeenCalledWith("1", req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Service error",
      });
    });
});

describe("CompanyRole controller: getAllCompanyRolesController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch all company roles and return a success message", async () => {
      const req = {
        user: { companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Company Roles fetched successfully",
        data: {
          roles: [
            { CompanyRoleID: 1, CompanyRoleName: "Manager" },
            { CompanyRoleID: 2, CompanyRoleName: "Supervisor" },
          ],
        },
      };
  
      companyRoleService.getAllCompanyRoles.mockResolvedValue(mockResponse);
  
      await getAllCompanyRolesController(req, res);
  
      expect(companyRoleService.getAllCompanyRoles).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        user: { companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      companyRoleService.getAllCompanyRoles.mockRejectedValue(new Error("Service error"));
  
      await getAllCompanyRolesController(req, res);
  
      expect(companyRoleService.getAllCompanyRoles).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Service error",
      });
    });
});

describe("CompanyRole controller: getOneCompanyRoleController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch a single company role with permissions and return a success message", async () => {
      const req = {
        params: { CompanyRoleID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Company Role and its permissions fetched successfully",
        data: {
          CompanyRoleID: "1",
          CompanyRoleName: "Manager",
          permissions: [
            { Permission: "read" },
            { Permission: "write" },
          ],
        },
      };
  
      companyRoleService.getOneCompanyRole.mockResolvedValue(mockResponse);
  
      await getOneCompanyRoleController(req, res);
  
      expect(companyRoleService.getOneCompanyRole).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the company role is not found", async () => {
      const req = {
        params: { CompanyRoleID: "invalidRoleID" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      companyRoleService.getOneCompanyRole.mockResolvedValue({
        status: false,
        message: "Company Role not found",
      });
  
      await getOneCompanyRoleController(req, res);
  
      expect(companyRoleService.getOneCompanyRole).toHaveBeenCalledWith("invalidRoleID");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Company Role not found",
      });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        params: { CompanyRoleID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      companyRoleService.getOneCompanyRole.mockRejectedValue(new Error("Service error"));
  
      await getOneCompanyRoleController(req, res);
  
      expect(companyRoleService.getOneCompanyRole).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Service error",
      });
    });
});

describe("CompanyRole controller: searchCompanyRolesController", () => {
    beforeEach(() => {
      jest.resetAllMocks(); // Reset mocks between tests
    });
  
    it("should successfully search and return matching company roles", async () => {
      const req = {
        query: { name: "Manager" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Company role fetched successfully",
        companyroles: [
          { CompanyRoleID: "1", CompanyRoleName: "Manager" },
        ],
      };
  
      companyRoleService.searchCompanyRoles.mockResolvedValue(mockResponse);
  
      await searchCompanyRolesController(req, res);
  
      expect(companyRoleService.searchCompanyRoles).toHaveBeenCalledWith("Manager");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if no company role is found", async () => {
      const req = {
        query: { name: "NonExistentRole" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      companyRoleService.searchCompanyRoles.mockResolvedValue({
        status: false,
        message: "No company role found",
      });
  
      await searchCompanyRolesController(req, res);
  
      expect(companyRoleService.searchCompanyRoles).toHaveBeenCalledWith("NonExistentRole");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "No company role found",
      });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        query: { name: "Manager" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      companyRoleService.searchCompanyRoles.mockRejectedValue(new Error("Service error"));
  
      await searchCompanyRolesController(req, res);
  
      expect(companyRoleService.searchCompanyRoles).toHaveBeenCalledWith("Manager");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Service error",
      });
    });
});