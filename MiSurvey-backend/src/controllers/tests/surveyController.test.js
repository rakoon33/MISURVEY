const {
    createSurveyController,
    getOneSurveyWithDataController,
    getOneSurveyWithoutDataController,
    getAllSurveyController,
    updateSurveyController,
    deleteSurveyController,
    searchSurveyController,
    getOneSurveyWithDataByLinkController,
    sendSurveyEmailController,
    getSurveySummaryController,
} = require("../survey.controller");

const surveyService = require("../../services/survey.service");
jest.mock("../../services/survey.service", () => ({
    createSurvey: jest.fn(),
    getOneSurveyWithData: jest.fn(),
    getOneSurveyWithoutData: jest.fn(),
    getAllSurvey: jest.fn(),
    updateSurvey: jest.fn(),
    deleteSurvey: jest.fn(),
    searchSurvey: jest.fn(),
    getOneSurveyWithDataByLink: jest.fn(),
    sendEmail: jest.fn(),
    getSurveySummary: jest.fn(),
}));

describe("Survey controller: createSurveyController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully create a survey and return a success message", async () => {
      const req = {
        body: {
          Title: "Survey Title",
          SurveyDescription: "Description",
          SurveyQuestions: [{ QuestionText: "Question 1" }],
        },
        user: {
          id: "1",
          companyID: "1",
          role: "Admin",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Survey created successfully",
        survey: {
          SurveyID: "1",
          Title: "Survey Title",
        },
      };
  
      surveyService.createSurvey.mockResolvedValue(mockResponse);
  
      await createSurveyController(req, res);
  
      expect(surveyService.createSurvey).toHaveBeenCalledWith(expect.any(Object), req.user);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 if the user is not found", async () => {
      const req = {
        body: {
          Title: "Survey Title",
          SurveyDescription: "Description",
          SurveyQuestions: [{ QuestionText: "Question 1" }],
        },
        user: null,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      await createSurveyController(req, res);
  
      expect(surveyService.createSurvey).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        body: {
          Title: "Survey Title",
          SurveyDescription: "Description",
          SurveyQuestions: [{ QuestionText: "Question 1" }],
        },
        user: {
          id: "1",
          companyID: "1",
          role: "Admin",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyService.createSurvey.mockRejectedValue(new Error("Service error"));
  
      await createSurveyController(req, res);
  
      expect(surveyService.createSurvey).toHaveBeenCalledWith(expect.any(Object), req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Survey controller: getOneSurveyWithDataController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch a survey and return the survey data", async () => {
      const req = {
        params: { SurveyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        survey: {
          SurveyID: "1",
          Title: "Survey Title",
        },
      };
  
      surveyService.getOneSurveyWithData.mockResolvedValue(mockResponse);
  
      await getOneSurveyWithDataController(req, res);
  
      expect(surveyService.getOneSurveyWithData).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the survey is not found", async () => {
      const req = {
        params: { SurveyID: "invalidSurveyID" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyService.getOneSurveyWithData.mockResolvedValue({
        status: false,
        message: "Survey not found",
      });
  
      await getOneSurveyWithDataController(req, res);
  
      expect(surveyService.getOneSurveyWithData).toHaveBeenCalledWith("invalidSurveyID");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Survey not found" });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        params: { SurveyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyService.getOneSurveyWithData.mockRejectedValue(new Error("Service error"));
  
      await getOneSurveyWithDataController(req, res);
  
      expect(surveyService.getOneSurveyWithData).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Survey controller: getOneSurveyWithoutDataController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch a survey without data and return the survey data", async () => {
      const req = {
        params: { SurveyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        survey: {
          SurveyID: "1",
          Title: "Survey Title",
        },
      };
  
      surveyService.getOneSurveyWithoutData.mockResolvedValue(mockResponse);
  
      await getOneSurveyWithoutDataController(req, res);
  
      expect(surveyService.getOneSurveyWithoutData).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the survey is not found", async () => {
      const req = {
        params: { SurveyID: "invalidSurveyID" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyService.getOneSurveyWithoutData.mockResolvedValue({
        status: false,
        message: "Survey not found",
      });
  
      await getOneSurveyWithoutDataController(req, res);
  
      expect(surveyService.getOneSurveyWithoutData).toHaveBeenCalledWith("invalidSurveyID");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Survey not found" });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        params: { SurveyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyService.getOneSurveyWithoutData.mockRejectedValue(new Error("Service error"));
  
      await getOneSurveyWithoutDataController(req, res);
  
      expect(surveyService.getOneSurveyWithoutData).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Survey controller: getAllSurveyController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully fetch all surveys and return the surveys data", async () => {
      const req = {
        user: {
          role: "Admin",
          companyID: "1",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Surveys fetched successfully",
        surveys: [
          { SurveyID: "1", Title: "Survey 1" },
          { SurveyID: "2", Title: "Survey 2" },
        ],
      };
  
      surveyService.getAllSurvey.mockResolvedValue(mockResponse);
  
      await getAllSurveyController(req, res);
  
      expect(surveyService.getAllSurvey).toHaveBeenCalledWith(req.user);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        user: {
          role: "Admin",
          companyID: "1",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyService.getAllSurvey.mockRejectedValue(new Error("Service error"));
  
      await getAllSurveyController(req, res);
  
      expect(surveyService.getAllSurvey).toHaveBeenCalledWith(req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Survey controller: updateSurveyController", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  
    it("should successfully update a survey and return a success message", async () => {
      const req = {
        params: { SurveyID: "1" },
        body: {
          Title: "Updated Survey Title",
          SurveyQuestions: [{ QuestionID: "1", QuestionText: "Updated Question 1" }],
        },
        user: { id: "1", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResponse = {
        status: true,
        message: "Survey updated successfully",
      };
  
      surveyService.updateSurvey.mockResolvedValue(mockResponse);
  
      await updateSurveyController(req, res);
  
      expect(surveyService.updateSurvey).toHaveBeenCalledWith("1", req.body, req.user);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return 400 and an error message if the survey is not found", async () => {
      const req = {
        params: { SurveyID: "invalidSurveyID" },
        body: {
          Title: "Updated Survey Title",
          SurveyQuestions: [{ QuestionID: "1", QuestionText: "Updated Question 1" }],
        },
        user: { id: "1", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyService.updateSurvey.mockResolvedValue({
        status: false,
        message: "Survey not found",
      });
  
      await updateSurveyController(req, res);
  
      expect(surveyService.updateSurvey).toHaveBeenCalledWith("invalidSurveyID", req.body, req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Survey not found" });
    });
  
    it("should return 400 and an error message on service error", async () => {
      const req = {
        params: { SurveyID: "1" },
        body: {
          Title: "Updated Survey Title",
          SurveyQuestions: [{ QuestionID: "1", QuestionText: "Updated Question 1" }],
        },
        user: { id: "1", companyID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyService.updateSurvey.mockRejectedValue(new Error("Service error"));
  
      await updateSurveyController(req, res);
  
      expect(surveyService.updateSurvey).toHaveBeenCalledWith("1", req.body, req.user);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});