const { getCompanyDataController } = require('../company.controller');
const companyService = require('../../services/company.service');

jest.mock('../../services/company.service', () => ({
    getCompanyData: jest.fn(),
}));

describe('Controller: getCompanyDataController', () => {
    it('should return 200 and company data for a valid request', async () => {

        const req = {
            user: {
                companyID: 1,
                role: 'Admin',
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        companyService.getCompanyData.mockResolvedValue({
        status: true,
        companyDetails: {
            CompanyID: 1,
            CompanyName: "Company One",
            CompanyDomain: "companyone.com",
            CreatedAt: "2024-02-03T12:58:05.000Z",
            AdminID: 2
        }
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
                AdminID: 2
            }
        });
    });

});