const {
    createIndividualPermissionController,
    updateIndividualPermissionController,
    deleteIndividualPermissionController,
    getOneIndividualPermissionController,
    getAllIndividualPermissionsController,
    searchIndividualPermissionsController,
} = require("../individualPermission.controller");

const individualPermissionService = require("../../services/individualPermission.service");
jest.mock("../../services/individualPermission.service", () => ({
    createIndividualPermission: jest.fn(),
    updateIndividualPermission: jest.fn(),
    deleteIndividualPermission: jest.fn(),
    getOneIndividualPermission: jest.fn(),
    getAllIndividualPermissions: jest.fn(),
    searchIndividualPermissions: jest.fn(),
}));

describe("IndividualPermission controller: createIndividualPermissionController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully create an individual permission and return a success message", async () => {
      const req = {
        body: {
          CompanyUserID: "1",
          ModuleID: "1",
          canRead: true,
          canWrite: false,
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Individual Permission created successfully",
        permission: {
          PermissionID: "1",
          CompanyUserID: "1",
          ModuleID: "1",
          canRead: true,
          canWrite: false,
        },
      };
  
      individualPermissionService.createIndividualPermission.mockResolvedValue(mockResponse);
  
      await createIndividualPermissionController(req, res);
  
      expect(individualPermissionService.createIndividualPermission).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the permission already exists", async () => {
      const req = {
        body: {
          CompanyUserID: "1",
          ModuleID: "1",
          canRead: true,
          canWrite: false,
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      individualPermissionService.createIndividualPermission.mockResolvedValue({
        status: false,
        message: "Individual Permission with this CompanyUserID and ModuleID already exists",
      });
  
      await createIndividualPermissionController(req, res);
  
      expect(individualPermissionService.createIndividualPermission).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Individual Permission with this CompanyUserID and ModuleID already exists",
      });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        body: {
          CompanyUserID: "1",
          ModuleID: "1",
          canRead: true,
          canWrite: false,
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      individualPermissionService.createIndividualPermission.mockRejectedValue(new Error("Service error"));
  
      await createIndividualPermissionController(req, res);
  
      expect(individualPermissionService.createIndividualPermission).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("IndividualPermission controller: updateIndividualPermissionController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully update an individual permission and return a success message", async () => {
      const req = {
        params: {
          companyUserId: "1",
          moduleId: "1",
        },
        body: {
          canRead: true,
          canWrite: false,
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Individual Permission updated successfully",
      };
  
      individualPermissionService.updateIndividualPermission.mockResolvedValue(mockResponse);
  
      await updateIndividualPermissionController(req, res);
  
      expect(individualPermissionService.updateIndividualPermission).toHaveBeenCalledWith(
        "1",
        "1",
        req.body
      );
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the permission does not exist", async () => {
      const req = {
        params: {
          companyUserId: "invalidUserId",
          moduleId: "invalidModuleId",
        },
        body: {
          canRead: true,
          canWrite: false,
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      individualPermissionService.updateIndividualPermission.mockResolvedValue({
        status: false,
        message: "Individual Permission with this CompanyUserID or ModuleID not exists",
      });
  
      await updateIndividualPermissionController(req, res);
  
      expect(individualPermissionService.updateIndividualPermission).toHaveBeenCalledWith(
        "invalidUserId",
        "invalidModuleId",
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Individual Permission with this CompanyUserID or ModuleID not exists",
      });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        params: {
          companyUserId: "1",
          moduleId: "1",
        },
        body: {
          canRead: true,
          canWrite: false,
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      individualPermissionService.updateIndividualPermission.mockRejectedValue(new Error("Service error"));
  
      await updateIndividualPermissionController(req, res);
  
      expect(individualPermissionService.updateIndividualPermission).toHaveBeenCalledWith(
        "1",
        "1",
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("IndividualPermission controller: deleteIndividualPermissionController", () => {
    beforeEach(() => {
      jest.resetAllMocks(); // Reset mocks between tests
    });
  
    it("should successfully delete an individual permission and return a success message", async () => {
      const req = {
        params: {
          companyUserId: "1",
          moduleId: "1",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Individual Permission deleted successfully",
      };
  
      individualPermissionService.deleteIndividualPermission.mockResolvedValue(mockResponse);
  
      await deleteIndividualPermissionController(req, res);
  
      expect(individualPermissionService.deleteIndividualPermission).toHaveBeenCalledWith("1", "1");
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the permission does not exist", async () => {
      const req = {
        params: {
          companyUserId: "invalidUserId",
          moduleId: "invalidModuleId",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      individualPermissionService.deleteIndividualPermission.mockResolvedValue({
        status: false,
        message: "Individual Permission with this CompanyUserID or ModuleID not exists",
      });
  
      await deleteIndividualPermissionController(req, res);
  
      expect(individualPermissionService.deleteIndividualPermission).toHaveBeenCalledWith(
        "invalidUserId",
        "invalidModuleId"
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Individual Permission with this CompanyUserID or ModuleID not exists",
      });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        params: {
          companyUserId: "1",
          moduleId: "1",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      individualPermissionService.deleteIndividualPermission.mockRejectedValue(new Error("Service error"));
  
      await deleteIndividualPermissionController(req, res);
  
      expect(individualPermissionService.deleteIndividualPermission).toHaveBeenCalledWith("1", "1");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("IndividualPermission controller: getOneIndividualPermissionController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch an individual permission and return a success message", async () => {
      const req = {
        params: {
          companyUserId: "1",
          moduleId: "1",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Individual Permission fetched successfully",
        permission: {
          PermissionID: "1",
          CompanyUserID: "1",
          ModuleID: "1",
          canRead: true,
          canWrite: false,
        },
      };
  
      individualPermissionService.getOneIndividualPermission.mockResolvedValue(mockResponse);
  
      await getOneIndividualPermissionController(req, res);
  
      expect(individualPermissionService.getOneIndividualPermission).toHaveBeenCalledWith("1", "1");
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the permission does not exist", async () => {
      const req = {
        params: {
          companyUserId: "invalidUserId",
          moduleId: "invalidModuleId",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      individualPermissionService.getOneIndividualPermission.mockResolvedValue({
        status: false,
        message: "Individual Permission with this CompanyUserID or ModuleID not exists",
      });
  
      await getOneIndividualPermissionController(req, res);
  
      expect(individualPermissionService.getOneIndividualPermission).toHaveBeenCalledWith(
        "invalidUserId",
        "invalidModuleId"
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Individual Permission with this CompanyUserID or ModuleID not exists",
      });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        params: {
          companyUserId: "1",
          moduleId: "1",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      individualPermissionService.getOneIndividualPermission.mockRejectedValue(new Error("Service error"));
  
      await getOneIndividualPermissionController(req, res);
  
      expect(individualPermissionService.getOneIndividualPermission).toHaveBeenCalledWith("1", "1");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("IndividualPermission controller: getAllIndividualPermissionsController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch all individual permissions and return a success message", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Individual Permissions fetched successfully",
        permissions: [
          { PermissionID: "1", CompanyUserID: "1", ModuleID: "1", canRead: true, canWrite: false },
          { PermissionID: "2", CompanyUserID: "2", ModuleID: "2", canRead: true, canWrite: true },
        ],
      };
  
      individualPermissionService.getAllIndividualPermissions.mockResolvedValue(mockResponse);
  
      await getAllIndividualPermissionsController(req, res);
  
      expect(individualPermissionService.getAllIndividualPermissions).toHaveBeenCalledWith();
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if no individual permissions are found", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      individualPermissionService.getAllIndividualPermissions.mockResolvedValue({
        status: false,
        message: "No individual permissions found",
      });
  
      await getAllIndividualPermissionsController(req, res);
  
      expect(individualPermissionService.getAllIndividualPermissions).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "No individual permissions found" });
    });
  
    it("should return 500 and an error message on service error", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      individualPermissionService.getAllIndividualPermissions.mockRejectedValue(new Error("Service error"));
  
      await getAllIndividualPermissionsController(req, res);
  
      expect(individualPermissionService.getAllIndividualPermissions).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("IndividualPermission controller: searchIndividualPermissionsController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully search individual permissions and return a success message", async () => {
      const req = {
        params: { companyUserId: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Individual Permissions found",
        permissions: [
          { PermissionID: "1", CompanyUserID: "1", ModuleID: "1", canRead: true, canWrite: false },
          { PermissionID: "2", CompanyUserID: "1", ModuleID: "2", canRead: true, canWrite: true },
        ],
      };
  
      individualPermissionService.searchIndividualPermissions.mockResolvedValue(mockResponse);
  
      await searchIndividualPermissionsController(req, res);
  
      expect(individualPermissionService.searchIndividualPermissions).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if no matching permissions are found", async () => {
      const req = {
        params: { companyUserId: "invalidUserId" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      individualPermissionService.searchIndividualPermissions.mockResolvedValue({
        status: false,
        message: "No matching individual permissions found",
      });
  
      await searchIndividualPermissionsController(req, res);
  
      expect(individualPermissionService.searchIndividualPermissions).toHaveBeenCalledWith("invalidUserId");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "No matching individual permissions found" });
    });
  
    it("should return 500 and an error message on service error", async () => {
      const req = {
        params: { companyUserId: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      individualPermissionService.searchIndividualPermissions.mockRejectedValue(new Error("Service error"));
  
      await searchIndividualPermissionsController(req, res);
  
      expect(individualPermissionService.searchIndividualPermissions).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});