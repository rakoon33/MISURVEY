const {
    createUserPackageController,
} = require("../userPackage.controller");
  
const userPackageService = require("../../services/userPackage.service");
jest.mock("../../services/userPackage.service", () => ({
    createUserPackage: jest.fn(),
}));

describe("Package Controller: createUserPackageController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully create a user package", async () => {
      const req = {
        body: {
          CompanyID: "1",
          PackageID: "101",
          StartDate: new Date(),
          EndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          IsActive: true
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockNewUserPackage = {
        status: true,
        message: "User Package created successfully",
        userPackage: {
          CompanyID: "1",
          PackageID: "101",
          IsActive: true
        },
      };
  
      userPackageService.createUserPackage.mockResolvedValue(mockNewUserPackage);
  
      await createUserPackageController(req, res);
  
      expect(userPackageService.createUserPackage).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(mockNewUserPackage);
    });
  
    it("should return a 400 status code on failure", async () => {
      const req = {
        body: {
          CompanyID: "1",
          PackageID: "102",
          StartDate: new Date(),
          EndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          IsActive: true
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockError = {
        status: false,
        message: "Failed to create user package",
        error: "Database error"
      };
  
      userPackageService.createUserPackage.mockRejectedValue(new Error(mockError.message));
  
      await createUserPackageController(req, res);
  
      expect(userPackageService.createUserPackage).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
    });
});