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

describe("CompanyUser controller: createCompanyUserController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should return 400 if company user data or user data are missing", async () => {
      const req = {
        body: {},
        user: { companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      await createCompanyUserController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: "Both company user data and user data are required",
      });
    });
  
    it("should successfully create a company user and return a success message", async () => {
      const req = {
        body: {
          companyUserData: { CompanyRoleID: "2" },
          userData: { Username: "john_doe", Email: "john.doe@example.com" },
        },
        user: { companyID: "1", id: "admin" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Company User and associated User account created successfully",
        companyUser: { CompanyUserID: "1", CompanyRoleID: "2", CompanyID: "1" },
      };
  
      companyUserService.createCompanyUser.mockResolvedValue(mockResponse);
  
      await createCompanyUserController(req, res);
  
      expect(companyUserService.createCompanyUser).toHaveBeenCalledWith(
        { CompanyRoleID: "2", CompanyID: "1" },
        { Username: "john_doe", Email: "john.doe@example.com", UserAvatar: "./assets/img/avatars/avt_default.png" },
        req.user
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        body: {
          companyUserData: { CompanyRoleID: "2" },
          userData: { Username: "john_doe", Email: "john.doe@example.com" },
        },
        user: { companyID: "1", id: "admin" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      companyUserService.createCompanyUser.mockRejectedValue(new Error("Service error"));
  
      await createCompanyUserController(req, res);
  
      expect(companyUserService.createCompanyUser).toHaveBeenCalledWith(
        { CompanyRoleID: "2", CompanyID: "1" },
        { Username: "john_doe", Email: "john.doe@example.com", UserAvatar: "./assets/img/avatars/avt_default.png" },
        req.user
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: "Service error",
      });
    });
});

describe("CompanyUser controller: deleteCompanyUserController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully delete a company user and return a success message", async () => {
      const req = {
        params: { companyUserId: "1" },
        user: { id: "2", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Company User deleted successfully",
      };
  
      companyUserService.deleteCompanyUser.mockResolvedValue(mockResponse);
  
      await deleteCompanyUserController(req, res);
  
      expect(companyUserService.deleteCompanyUser).toHaveBeenCalledWith("1", req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the company user is not found", async () => {
      const req = {
        params: { companyUserId: "invalidUserId" },
        user: { id: "2", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      companyUserService.deleteCompanyUser.mockResolvedValue({
        status: false,
        message: "Company User not found",
      });
  
      await deleteCompanyUserController(req, res);
  
      expect(companyUserService.deleteCompanyUser).toHaveBeenCalledWith("invalidUserId", req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: "Company User not found",
      });
    });
  
    it("should return 500 and an error message on service error", async () => {
      const req = {
        params: { companyUserId: "1" },
        user: { id: "2", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      companyUserService.deleteCompanyUser.mockRejectedValue(new Error("Service error"));
  
      await deleteCompanyUserController(req, res);
  
      expect(companyUserService.deleteCompanyUser).toHaveBeenCalledWith("1", req.user);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: "Service error",
      });
    });
});

describe("CompanyUser controller: getOneCompanyUserController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch a single company user and return a success message", async () => {
      const req = {
        params: { companyUserId: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Company User fetched successfully",
        companyUser: {
          CompanyUserID: "1",
          User: { UserID: "1", Username: "john_doe" },
          Company: { CompanyID: "1", CompanyName: "Company A" },
          CompanyRole: { CompanyRoleID: "1", CompanyRoleName: "Manager" },
        },
      };
  
      companyUserService.getOneCompanyUser.mockResolvedValue(mockResponse);
  
      await getOneCompanyUserController(req, res);
  
      expect(companyUserService.getOneCompanyUser).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the company user is not found", async () => {
      const req = {
        params: { companyUserId: "invalidUserId" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      companyUserService.getOneCompanyUser.mockResolvedValue({
        status: false,
        message: "Company User not found",
      });
  
      await getOneCompanyUserController(req, res);
  
      expect(companyUserService.getOneCompanyUser).toHaveBeenCalledWith("invalidUserId");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Company User not found",
      });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        params: { companyUserId: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      companyUserService.getOneCompanyUser.mockRejectedValue(new Error("Service error"));
  
      await getOneCompanyUserController(req, res);
  
      expect(companyUserService.getOneCompanyUser).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Service error",
      });
    });
});

describe("CompanyUser controller: getAllCompanyUsersController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch all company users and return a success message", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "All Company Users fetched successfully",
        companyUsers: [
          {
            CompanyUserID: "1",
            User: { UserID: "1", Username: "john_doe" },
            Company: { CompanyID: "1", CompanyName: "Company A" },
            CompanyRole: { CompanyRoleID: "1", CompanyRoleName: "Manager" },
          },
          {
            CompanyUserID: "2",
            User: { UserID: "2", Username: "jane_doe" },
            Company: { CompanyID: "2", CompanyName: "Company B" },
            CompanyRole: { CompanyRoleID: "2", CompanyRoleName: "Supervisor" },
          },
        ],
      };
  
      companyUserService.getAllCompanyUsers.mockResolvedValue(mockResponse);
  
      await getAllCompanyUsersController(req, res);
  
      expect(companyUserService.getAllCompanyUsers).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      companyUserService.getAllCompanyUsers.mockRejectedValue(new Error("Service error"));
  
      await getAllCompanyUsersController(req, res);
  
      expect(companyUserService.getAllCompanyUsers).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Service error",
      });
    });
});