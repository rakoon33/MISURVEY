const {
  getCompanyDataController,
  getCompanyProfileController,
  searchCompanyController,
  getAllCompaniesController,
  createCompanyController,
} = require("../company.controller");
const companyService = require("../../services/company.service");

jest.mock("../../services/company.service", () => ({
  getCompanyData: jest.fn(),
  getOneCompany: jest.fn(),
  searchCompanies: jest.fn(),
  getAllCompanies: jest.fn(),
  createCompany: jest.fn(),
}));

describe("Company controller: getCompanyDataController", () => {
  it("should return 200 and company data for a valid request", async () => {
    const req = {
      user: {
        companyID: 1,
        role: "Admin",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    companyService.getCompanyData.mockResolvedValue({
      status: true,
      companyDetails: {
        CompanyID: 1,
        CompanyName: "Company One",
        CompanyDomain: "companyone.com",
        CreatedAt: "2024-02-03T12:58:05.000Z",
        AdminID: 2,
      },
    });

    await getCompanyDataController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).not.toHaveBeenCalledWith(400);
    expect(res.status).not.toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      companyDetails: {
        CompanyID: 1,
        CompanyName: "Company One",
        CompanyDomain: "companyone.com",
        CreatedAt: "2024-02-03T12:58:05.000Z",
        AdminID: 2,
      },
    });
  });
});

describe("Company controller: getCompanyProfileController", () => {
  // Happy case
  it("should return the company profile data for a valid request", async () => {
    const req = {
      user: {
        companyID: 1,
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.getOneCompany.mockResolvedValue({
      status: true,
      data: {
        CompanyID: 1,
        CompanyName: "Company One",
        CompanyDomain: "companyone.com",
        CreatedAt: "2024-02-03T12:58:05.000Z",
        AdminID: 2,
      },
    });

    await getCompanyProfileController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      data: {
        CompanyID: 1,
        CompanyName: "Company One",
        CompanyDomain: "companyone.com",
        CreatedAt: "2024-02-03T12:58:05.000Z",
        AdminID: 2,
      },
    });
  });

  // Test for company not found
  it("should handle company not found error", async () => {
    const req = {
      user: {
        companyID: "invalidCompanyID",
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.getOneCompany.mockResolvedValue({
      status: false,
      message: "Company not found",
    });

    await getCompanyProfileController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Company not found",
    });
  });
});

describe("Company controller: searchCompanyController", () => {
  // Happy case 1
  it("should return companies based on companyName search", async () => {
    const req = {
      query: {
        companyName: "Test Company",
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.searchCompanies.mockResolvedValue({
      status: true,
      message: "Companies fetched successfully",
      companies: [
        {
          CompanyID: 1,
          CompanyName: "Test Company",
          CompanyDomain: "testcompany.com",
          AdminID: 2,
        },
      ],
    });

    await searchCompanyController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      message: "Companies fetched successfully",
      companies: expect.any(Array),
    });
  });

  // Happy case 2
  it("should return companies based on adminID search", async () => {
    const req = {
      query: {
        adminID: "2",
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.searchCompanies.mockResolvedValue({
      status: true,
      message: "Companies fetched successfully",
      companies: [
        {
          CompanyID: 1,
          CompanyName: "Test Company",
          CompanyDomain: "testcompany.com",
          AdminID: 2,
        },
      ],
    });

    await searchCompanyController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      message: "Companies fetched successfully",
      companies: expect.any(Array),
    });
  });

  // Test for companies not found
  it("should return a no companies found message if no matches", async () => {
    const req = {
      query: {
        companyName: "Nonexistent Company",
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.searchCompanies.mockResolvedValue({
      status: false,
      message: "No companies found",
    });

    await searchCompanyController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "No companies found",
    });
  });
});

describe("Company controller: getAllCompaniesController", () => {
  // Happy case
  it("should return all companies for SuperAdmin without filtering", async () => {
    const req = {
      user: {
        role: "SuperAdmin",
      },
      query: {
        page: "1",
        pageSize: "10",
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.getAllCompanies.mockResolvedValue({
      status: true,
      data: [
        {
          CompanyID: 1,
          CompanyLogo: null,
          CompanyName: "Company One",
          CompanyDomain: "companyone.com",
          AdminID: 2,
        },
        {
          CompanyID: 2,
          CompanyLogo: null,
          CompanyName: "Company One",
          CompanyDomain: "companyone.com",
          AdminID: 3,
        },
        {
          CompanyID: 2,
          CompanyLogo: null,
          CompanyName: "Company One",
          CompanyDomain: "companyone.com",
          AdminID: 4,
        },
      ],
      total: 3,
    });

    await getAllCompaniesController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      data: expect.any(Array),
      total: 3,
    });
  });

  // Test for non-SuperAdmin user case
  it("should apply filters for non-SuperAdmin users", async () => {
    const req = {
      user: {
        role: "Admin",
        companyID: "1",
      },
      query: {
        page: "1",
        pageSize: "10",
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.getAllCompanies.mockResolvedValue({
      status: true,
      data: [
        {
          CompanyID: 1,
          CompanyLogo: null,
          CompanyName: "Company One",
          CompanyDomain: "companyone.com",
          AdminID: 2,
        },
      ],
      total: 3,
    });

    await getAllCompaniesController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      data: expect.any(Array),
      total: 3,
    });
  });
});

describe("Company controller: createCompany", () => {
  // Happy case
  it("should create a user and return success message with userID", async () => {
    const req = {
      body: {
        UserAvatar: "./assets/img/avatars/2.jpg",
        Username: "admin3",
        FirstName: "Admin456",
        LastName: "ABC",
        Gender: "Male",
        Email: "supervisor@example.com",
        PhoneNumber: "0123456789",
        UserPassword: "Admin123#",
        UserRole: "Admin",
        IsActive: "1",
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.createCompany.mockResolvedValue({
      status: true,
      message: "User created successfully",
      userID: 9,
    });

    await createCompanyController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      message: "User created successfully",
      userID: 9,
    });
  });
});
