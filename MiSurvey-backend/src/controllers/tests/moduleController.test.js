const {
    createModuleController,
    updateModuleController,
    deleteModuleController,
    getAllModulesController,
    getOneModuleController,
    searchModulesController,
} = require("../module.controller");

const moduleService = require("../../services/module.service");
jest.mock("../../services/module.service", () => ({
    createModule: jest.fn(),
    updateModule: jest.fn(),
    deleteModule: jest.fn(),
    getAllModules: jest.fn(),
    getOneModule: jest.fn(),
    searchModules: jest.fn(),
}));

describe("Module controller: createModuleController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully create a module and return a success message", async () => {
      const req = {
        body: {
          moduleName: "New Module",
          description: "This is a new module",
        },
        user: {
          id: "1",
          companyID: "1",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Module created successfully",
        module: {
          ModuleID: "1",
          moduleName: "New Module",
          description: "This is a new module",
        },
      };
  
      moduleService.createModule.mockResolvedValue(mockResponse);
  
      await createModuleController(req, res);
  
      expect(moduleService.createModule).toHaveBeenCalledWith(req.body, req.user);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        body: {
          moduleName: "New Module",
          description: "This is a new module",
        },
        user: {
          id: "1",
          companyID: "1",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      moduleService.createModule.mockRejectedValue(new Error("Service error"));
  
      await createModuleController(req, res);
  
      expect(moduleService.createModule).toHaveBeenCalledWith(req.body, req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Module controller: updateModuleController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully update a module and return a success message", async () => {
      const req = {
        params: { ModuleID: "1" },
        body: {
          moduleName: "Updated Module",
          description: "Updated description",
        },
        user: { id: "1", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Module updated successfully",
      };
  
      moduleService.updateModule.mockResolvedValue(mockResponse);
  
      await updateModuleController(req, res);
  
      expect(moduleService.updateModule).toHaveBeenCalledWith("1", req.body, req.user);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the module is not found", async () => {
      const req = {
        params: { ModuleID: "invalidModuleID" },
        body: {
          moduleName: "Updated Module",
          description: "Updated description",
        },
        user: { id: "1", companyID: "1" }, // Mock user information
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      moduleService.updateModule.mockResolvedValue({
        status: false,
        message: "Module not found",
      });
  
      await updateModuleController(req, res);
  
      expect(moduleService.updateModule).toHaveBeenCalledWith("invalidModuleID", req.body, req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Module not found" });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        params: { ModuleID: "1" },
        body: {
          moduleName: "Updated Module",
          description: "Updated description",
        },
        user: { id: "1", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      moduleService.updateModule.mockRejectedValue(new Error("Service error"));
  
      await updateModuleController(req, res);
  
      expect(moduleService.updateModule).toHaveBeenCalledWith("1", req.body, req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Module controller: deleteModuleController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully delete a module and return a success message", async () => {
      const req = {
        params: { ModuleID: "1" },
        user: { id: "1", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Module and all related permissions deleted successfully",
      };
  
      moduleService.deleteModule.mockResolvedValue(mockResponse);
  
      await deleteModuleController(req, res);
  
      expect(moduleService.deleteModule).toHaveBeenCalledWith("1", req.user);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the module is not found", async () => {
      const req = {
        params: { ModuleID: "invalidModuleID" },
        user: { id: "1", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      moduleService.deleteModule.mockResolvedValue({
        status: false,
        message: "Module not found",
      });
  
      await deleteModuleController(req, res);
  
      expect(moduleService.deleteModule).toHaveBeenCalledWith("invalidModuleID", req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Module not found" });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        params: { ModuleID: "1" },
        user: { id: "1", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      moduleService.deleteModule.mockRejectedValue(new Error("Service error"));
  
      await deleteModuleController(req, res);
  
      expect(moduleService.deleteModule).toHaveBeenCalledWith("1", req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Module controller: getAllModulesController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch all modules and return a success message", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Modules fetched successfully",
        modules: [
          { ModuleID: "1", ModuleName: "Module 1" },
          { ModuleID: "2", ModuleName: "Module 2" },
        ],
      };
  
      moduleService.getAllModules.mockResolvedValue(mockResponse);
  
      await getAllModulesController(req, res);
  
      expect(moduleService.getAllModules).toHaveBeenCalledWith();
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      moduleService.getAllModules.mockRejectedValue(new Error("Service error"));
  
      await getAllModulesController(req, res);
  
      expect(moduleService.getAllModules).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Module controller: getOneModuleController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch a module and return a success message", async () => {
      const req = {
        params: { ModuleID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Module fetched successfully",
        module: { ModuleID: "1", ModuleName: "Module 1" },
      };
  
      moduleService.getOneModule.mockResolvedValue(mockResponse);
  
      await getOneModuleController(req, res);
  
      expect(moduleService.getOneModule).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the module is not found", async () => {
      const req = {
        params: { ModuleID: "invalidModuleID" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      moduleService.getOneModule.mockResolvedValue({
        status: false,
        message: "Module not found",
      });
  
      await getOneModuleController(req, res);
  
      expect(moduleService.getOneModule).toHaveBeenCalledWith("invalidModuleID");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Module not found" });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        params: { ModuleID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      moduleService.getOneModule.mockRejectedValue(new Error("Service error"));
  
      await getOneModuleController(req, res);
  
      expect(moduleService.getOneModule).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Module controller: searchModulesController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch modules and return a success message", async () => {
      const req = {
        query: { name: "Sample Module" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Modules fetched successfully",
        modules: [
          { ModuleID: "1", ModuleName: "Sample Module 1" },
          { ModuleID: "2", ModuleName: "Sample Module 2" },
        ],
      };
  
      moduleService.searchModules.mockResolvedValue(mockResponse);
  
      await searchModulesController(req, res);
  
      expect(moduleService.searchModules).toHaveBeenCalledWith("Sample Module");
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if no modules are found", async () => {
      const req = {
        query: { name: "Nonexistent Module" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      moduleService.searchModules.mockResolvedValue({
        status: false,
        message: "No modules found",
      });
  
      await searchModulesController(req, res);
  
      expect(moduleService.searchModules).toHaveBeenCalledWith("Nonexistent Module");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "No modules found" });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        query: { name: "Sample Module" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      moduleService.searchModules.mockRejectedValue(new Error("Service error"));
  
      await searchModulesController(req, res);
  
      expect(moduleService.searchModules).toHaveBeenCalledWith("Sample Module");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});