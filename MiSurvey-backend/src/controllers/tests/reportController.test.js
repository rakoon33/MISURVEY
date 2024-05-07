const {
    getDashboardDataController,
    getActivityOverviewController,
    getSurveyTypeUsageController,
    getSurveyCountByDateRangeController,
    getSurveyQuestionDataController,
} = require("../report.controller");

const reportService = require("../../services/report.service");
jest.mock("../../services/report.service", () => ({
    getDashboardData: jest.fn(),
    getSurveyTypeUsage: jest.fn(),
    getActivityOverview: jest.fn(),
    getSurveyCountByDateRange: jest.fn(),
    getSurveyQuestionData: jest.fn(),
}));

describe("Report controller: getDashboardDataController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch dashboard data for a SuperAdmin", async () => {
      const req = {
        user: {
          role: "SuperAdmin",
          id: "adminID",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockData = {
        userCount: 10,
        companyCount: 5,
        surveyCount: 20,
      };
  
      reportService.getDashboardData.mockResolvedValue({
        status: true,
        data: mockData,
      });
  
      await getDashboardDataController(req, res);
  
      expect(reportService.getDashboardData).toHaveBeenCalledWith(req.user);
      expect(res.status).not.toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    it("should successfully fetch dashboard data scoped to the user's company", async () => {
      const req = {
        user: {
          role: "Admin",
          companyID: "1",
          id: "adminID",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockData = {
        userCount: 10,
        surveyCount: 20,
        companyRoleCount: 3,
        customerCount: 15,
      };
  
      reportService.getDashboardData.mockResolvedValue({
        status: true,
        data: mockData,
      });
  
      await getDashboardDataController(req, res);
  
      expect(reportService.getDashboardData).toHaveBeenCalledWith(req.user);
      expect(res.status).not.toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  
    it("should return 500 and an error message if dashboard data fetch fails", async () => {
      const req = {
        user: {
          role: "Admin",
          companyID: "1",
          id: "adminID",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      reportService.getDashboardData.mockResolvedValue({
        status: false,
        message: "Error fetching data",
      });
  
      await getDashboardDataController(req, res);
  
      expect(reportService.getDashboardData).toHaveBeenCalledWith(req.user);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error fetching data" });
    });
});

describe("Report controller: getActivityOverviewController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch activity overview data", async () => {
      const req = {
        query: {
          startDate: "2024-01-01",
          endDate: "2024-01-31",
        },
        user: {
          role: "Admin",
          companyID: "1",
          id: "adminID",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockData = {
        newUserCountByDate: [
          { date: "2024-01-01", count: 5 },
          { date: "2024-01-02", count: 3 },
        ],
      };
  
      reportService.getActivityOverview.mockResolvedValue({
        status: true,
        data: mockData,
      });
  
      await getActivityOverviewController(req, res);
  
      expect(reportService.getActivityOverview).toHaveBeenCalledWith("2024-01-01", "2024-01-31", req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        data: mockData,
      });
    });
  
    it("should return 500 and an error message if the activity overview data fetch fails", async () => {
      const req = {
        query: {
          startDate: "2024-01-01",
          endDate: "2024-01-31",
        },
        user: {
          role: "Admin",
          companyID: "1",
          id: "adminID",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      reportService.getActivityOverview.mockResolvedValue({
        status: false,
        message: "Error fetching data",
      });
  
      await getActivityOverviewController(req, res);
  
      expect(reportService.getActivityOverview).toHaveBeenCalledWith("2024-01-01", "2024-01-31", req.user);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: "Error fetching data",
      });
    });
  
    it("should return 500 and an error message for invalid date input", async () => {
      const req = {
        query: {
          startDate: "invalid-date",
          endDate: "2024-01-31",
        },
        user: {
          role: "Admin",
          companyID: "1",
          id: "adminID",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      reportService.getActivityOverview.mockResolvedValue({
        status: false,
        message: "Invalid date format provided.",
      });
  
      await getActivityOverviewController(req, res);
  
      expect(reportService.getActivityOverview).toHaveBeenCalledWith("invalid-date", "2024-01-31", req.user);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: "Invalid date format provided.",
      });
    });
});

describe("Report controller: getSurveyTypeUsageController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch survey type usage data", async () => {
      const req = {
        query: {
          startDate: "2024-01-01",
          endDate: "2024-01-31",
        },
        user: {
          role: "SuperAdmin",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockData = {
        usage: [
          { surveyType: "Stars", count: 5 },
          { surveyType: "Emoticons", count: 3 },
        ],
      };
  
      reportService.getSurveyTypeUsage.mockResolvedValue({
        status: true,
        data: mockData,
      });
  
      await getSurveyTypeUsageController(req, res);
  
      expect(reportService.getSurveyTypeUsage).toHaveBeenCalledWith("2024-01-01", "2024-01-31", req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        data: mockData,
      });
    });
  
    it("should return 500 and an error message if survey type usage fetch fails", async () => {
      const req = {
        query: {
          startDate: "2024-01-01",
          endDate: "2024-01-31",
        },
        user: {
          role: "SuperAdmin",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      reportService.getSurveyTypeUsage.mockResolvedValue({
        status: false,
        message: "Error fetching survey type usage data",
      });
  
      await getSurveyTypeUsageController(req, res);
  
      expect(reportService.getSurveyTypeUsage).toHaveBeenCalledWith("2024-01-01", "2024-01-31", req.user);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: "Error fetching survey type usage data",
      });
    });
  
    it("should return 500 and an error message for invalid date input", async () => {
      const req = {
        query: {
          startDate: "invalid-date",
          endDate: "2024-01-31",
        },
        user: {
          role: "Admin",
          companyID: "1",
          id: "adminID",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      reportService.getSurveyTypeUsage.mockResolvedValue({
        status: false,
        message: "Invalid date format provided.",
      });
  
      await getSurveyTypeUsageController(req, res);
  
      expect(reportService.getSurveyTypeUsage).toHaveBeenCalledWith("invalid-date", "2024-01-31", req.user);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: "Invalid date format provided.",
      });
    });
});

describe("Report controller: getSurveyCountByDateRangeController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch survey count by date range", async () => {
      const req = {
        query: {
          startDate: "2024-01-01",
          endDate: "2024-01-31",
        },
        user: {
          role: "SuperAdmin",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockData = [
        { date: "2024-01-01", count: 5 },
        { date: "2024-01-02", count: 3 },
      ];
  
      reportService.getSurveyCountByDateRange.mockResolvedValue({
        status: true,
        data: mockData,
        message: "Survey count fetched successfully for each day",
      });
  
      await getSurveyCountByDateRangeController(req, res);
  
      expect(reportService.getSurveyCountByDateRange).toHaveBeenCalledWith("2024-01-01", "2024-01-31", req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        data: mockData,
        message: "Survey count fetched successfully for each day",
      });
    });
  
    it("should return 500 and an error message if fetching survey count by date range fails", async () => {
      const req = {
        query: {
          startDate: "2024-01-01",
          endDate: "2024-01-31",
        },
        user: {
          role: "SuperAdmin",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      reportService.getSurveyCountByDateRange.mockResolvedValue({
        status: false,
        message: "Error fetching survey count",
      });
  
      await getSurveyCountByDateRangeController(req, res);
  
      expect(reportService.getSurveyCountByDateRange).toHaveBeenCalledWith("2024-01-01", "2024-01-31", req.user);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: "Error fetching survey count",
      });
    });
  
    it("should return 500 and an error message for invalid date input", async () => {
      const req = {
        query: {
          startDate: "invalid-date",
          endDate: "2024-01-31",
        },
        user: {
          role: "Admin",
          companyID: "1",
          id: "adminID",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      reportService.getSurveyCountByDateRange.mockResolvedValue({
        status: false,
        message: "Invalid date format provided.",
      });
  
      await getSurveyCountByDateRangeController(req, res);
  
      expect(reportService.getSurveyCountByDateRange).toHaveBeenCalledWith("invalid-date", "2024-01-31", req.user);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: "Invalid date format provided.",
      });
    });
});

describe('Survey controller: getSurveyQuestionDataController', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it('should successfully fetch survey question data', async () => {
      const req = {
        params: {
          surveyId: '1'
        }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };
  
      const mockData = {
        surveyQuestions: [
          {
            questionId: '1',
            questionText: 'What is your favorite color?',
            questionType: 'Multiple Choice',
            data: ['Blue', 'Green', 'Red'],
            responseRate: '100%'
          }
        ],
        recipientInfo: [
          {
            recipientCount: 3,
            recipients: 'test1@example.com, test2@example.com, test3@example.com'
          }
        ]
      };
  
      reportService.getSurveyQuestionData.mockResolvedValue({
        status: true,
        data: mockData
      });
  
      await getSurveyQuestionDataController(req, res);
  
      expect(reportService.getSurveyQuestionData).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: true, data: mockData });
    });
  
    it('should return 400 and an error message when the survey is not found', async () => {
      const req = {
        params: {
          surveyId: 'nonexistent'
        }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };
  
      reportService.getSurveyQuestionData.mockResolvedValue({
        status: false,
        message: 'Survey not found'
      });
  
      await getSurveyQuestionDataController(req, res);

      expect(reportService.getSurveyQuestionData).toHaveBeenCalledWith('nonexistent');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: false, message: 'Survey not found' });
    });
  
    it('should return 500 and an error message on internal error', async () => {
        const req = {
          params: {
            surveyId: '1',
          },
        };
        const res = {
          json: jest.fn(),
          status: jest.fn().mockReturnThis(),
        };
      
        reportService.getSurveyQuestionData.mockImplementation(() => {
          throw new Error('Internal server error');
        });
      
        await getSurveyQuestionDataController(req, res);
      
        expect(reportService.getSurveyQuestionData).toHaveBeenCalledWith('1');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          status: false,
          message: 'Internal server error',
        });
    });      
});