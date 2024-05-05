const {
  getCompanyDataController,
  getCompanyProfileController,
  searchCompanyController,
  getAllCompaniesController,
  createCompanyController,
  deleteCompanyController,
  getOneCompanyController,
  updateCompanyController,
} = require("../company.controller");

const companyService = require("../../services/company.service");
jest.mock("../../services/company.service", () => ({
  getCompanyData: jest.fn(),
  getOneCompany: jest.fn(),
  searchCompanies: jest.fn(),
  getAllCompanies: jest.fn(),
  createCompany: jest.fn(),
  deleteCompany: jest.fn(),
  updateCompany: jest.fn(),
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
  it("should create a user and return success message with company data", async () => {
    const req = {
      body: {
        CompanyName: "company6",
        CompanyDomain: "nhuphan123453r4633@sgma3il.com",
        AdminID: "6",
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.createCompany.mockResolvedValue({
      status: true,
      message: "Company and Admin CompanyUser created successfully",
      data: [
        {
          CompanyID: 1,
          CompanyLogo: null,
          CompanyName: "company6",
          CompanyDomain: "nhuphan123453r4633@sgma3il.com",
          AdminID: 6,
        },
      ],
    });

    await createCompanyController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      message: "Company and Admin CompanyUser created successfully",
      data: [
        {
          CompanyID: 1,
          CompanyLogo: null,
          CompanyName: "company6",
          CompanyDomain: "nhuphan123453r4633@sgma3il.com",
          AdminID: 6,
        },
      ],
    });
  });

  // Test for case AdminID is not found
  it("should not create a company if AdminID is not found", async () => {
    const req = {
      body: {
        CompanyName: "company6",
        CompanyDomain: "nhuphan123453r4633@sgma3il.com",
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.createCompany.mockResolvedValue({
      status: false,
      message: "Admin user not found",
    });

    await createCompanyController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Admin user not found",
    });
  });

  // Test for case user is not Admin
  it("should not create a company if AdminID is not an Admin", async () => {
    const req = {
      body: {
        CompanyName: "company7",
        CompanyDomain: "email@example.com",
        AdminID: "Supervisor",
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.createCompany.mockResolvedValue({
      status: false,
      message: "Only Admin users can create companies",
    });

    await createCompanyController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Only Admin users can create companies",
    });
  });

  // Test for case Admin already owns their company
  it("should not create a company if Admin already owns a company", async () => {
    const req = {
      body: {
        CompanyName: "company8",
        CompanyDomain: "anotheremail@example.com",
        AdminID: "8",
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.createCompany.mockResolvedValue({
      status: false,
      message: "Admin already owns a company",
    });

    await createCompanyController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Admin already owns a company",
    });
  });
});

describe("Company controller: deleteCompany", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // Happy case
  it("should successfully delete a company and return a success message", async () => {
    const req = {
      params: { CompanyID: "1" },
      user: { id: "adminID", companyID: "companyID" }
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.deleteCompany.mockResolvedValue({
      status: true,
      message: "Company deleted successfully",
    });

    await deleteCompanyController(req, res);

    expect(companyService.deleteCompany).toHaveBeenCalledWith("1", req.user);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      message: "Company deleted successfully",
    });
  });

  // Test for case company not found
  it("should return an error message when the company is not found", async () => {
    const req = {
      params: { CompanyID: "nonexistent" },
      user: { id: "adminID", companyID: "companyID" }
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.deleteCompany.mockResolvedValue({
      status: false,
      message: "Company not found",
    });

    await deleteCompanyController(req, res);

    expect(companyService.deleteCompany).toHaveBeenCalledWith(
      "nonexistent",
      req.user
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Company not found",
    });
  });
});

describe("Company controller: getOneCompany", () => {
  // Happy case
  it("should retrieve a company successfully and return the company data", async () => {
    const req = {
      params: { CompanyID: "2" },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.getOneCompany.mockResolvedValue({
      status: true,
      data: {
        CompanyID: "2",
        CompanyName: "Test Company",
        CompanyDomain: "test.com",
      },
    });

    await getOneCompanyController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      data: {
        CompanyID: "2",
        CompanyName: "Test Company",
        CompanyDomain: "test.com",
      },
    });
  });

  // Test for case Company not found
  it("should return a 'Company not found' message when the company does not exist", async () => {
    const req = {
      params: { CompanyID: "invalid" },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.getOneCompany.mockResolvedValue({
      status: false,
      message: "Company not found",
    });

    await getOneCompanyController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(companyService.getOneCompany).toHaveBeenCalledWith("invalid");
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Company not found",
    });
  });
});

describe("Company controller: updateCompany", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // Happy case
  it("should successfully update a company and return success message", async () => {
    const req = {
      params: { CompanyID: "1" },
      body: { CompanyName: "Updated Company", AdminID: "2" },
      user: { id: "1", companyID: "1" }
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.updateCompany.mockResolvedValue({
      status: true,
      message: "Company updated successfully",
      data: { ...req.body },
    });

    await updateCompanyController(req, res);

    expect(companyService.updateCompany).toHaveBeenCalledWith(
      "1",
      req.body,
      req.user
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      message: "Company updated successfully",
      data: expect.any(Object),
    });
  });

  // Test for case company does not exist
  it("should return an error message when the company does not exist", async () => {
    const req = {
      params: { CompanyID: "nonexistent" },
      body: { CompanyName: "Nonexistent Company" },
      user: { id: "1", companyID: "1" }
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    companyService.updateCompany.mockResolvedValue({
      status: false,
      message: "Company not found",
    });

    await updateCompanyController(req, res);

    expect(companyService.updateCompany).toHaveBeenCalledWith(
      "nonexistent",
      req.body,
      req.user
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Company not found",
    });
  });
});