const {
    createServicePackageController,
    getAllServicePackagesController
} = require("../servicePackage.controller");
  
const servicePackageService = require("../../services/servicePackage.service");
jest.mock("../../services/servicePackage.service", () => ({
    createServicePackage: jest.fn(),
    getAllServicePackages: jest.fn(),
}));

describe("Package Controller: createServicePackageController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully create a service package and return it", async () => {
      const req = {
        body: {
          Name: "Premium",
          Description: "Premium package with extra features",
          Price: 299
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockNewServicePackage = {
        status: true,
        message: "Package created successfully",
        servicePackage: {
          Name: "Premium",
          Description: "Premium package with extra features",
          Price: 299
        },
      };
  
      servicePackageService.createServicePackage.mockResolvedValue(mockNewServicePackage);
  
      await createServicePackageController(req, res);
  
      expect(servicePackageService.createServicePackage).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(mockNewServicePackage);
    });
  
    it("should handle errors and return a 400 status with an error message", async () => {
      const req = {
        body: {
          Name: "Basic",
          Description: "Basic package",
          Price: 99
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockError = {
        status: false,
        message: "Failed to create package",
        error: "Database error"
      };
  
      servicePackageService.createServicePackage.mockRejectedValue(new Error(mockError.message));
  
      await createServicePackageController(req, res);
  
      expect(servicePackageService.createServicePackage).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
    });
});

describe("Package Controller: getAllServicePackagesController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should retrieve all service packages and return them", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockPackages = [
        { id: 1, name: "Basic", price: 100 },
        { id: 2, name: "Premium", price: 200 }
      ];
  
      servicePackageService.getAllServicePackages.mockResolvedValue(mockPackages);
  
      await getAllServicePackagesController(req, res);
  
      expect(servicePackageService.getAllServicePackages).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockPackages);
    });
  
    it("should handle errors and return a 500 status with an error message", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const errorMessage = "Failed to retrieve packages";
      servicePackageService.getAllServicePackages.mockRejectedValue(new Error(errorMessage));
  
      await getAllServicePackagesController(req, res);
  
      expect(servicePackageService.getAllServicePackages).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});