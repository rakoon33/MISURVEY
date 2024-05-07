const {
    deleteSurveyQuestionController,
} = require("../surveyQuestion.controller");

const surveyQuestionService = require("../../services/surveyQuestion.service");
jest.mock("../../services/surveyQuestion.service", () => ({
    deleteSurveyQuestion: jest.fn(),
}));

describe("Survey Question Controller: deleteSurveyQuestionController", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should successfully delete a survey question", async () => {
      const req = {
        params: { questionID: "1" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      const mockResult = {
        status: true,
        message: "SurveyQuestion deleted successfully",
      };
  
      surveyQuestionService.deleteSurveyQuestion.mockResolvedValue(mockResult);
  
      await deleteSurveyQuestionController(req, res);
  
      expect(surveyQuestionService.deleteSurveyQuestion).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  
    it("should return a message when no survey question is found with the given ID", async () => {
      const req = {
        params: { questionID: "2" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyQuestionService.deleteSurveyQuestion.mockResolvedValue({
        status: false,
        message: "No survey question found with the given ID.",
      });
  
      await deleteSurveyQuestionController(req, res);
  
      expect(surveyQuestionService.deleteSurveyQuestion).toHaveBeenCalledWith("2");
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: "No survey question found with the given ID.",
      });
    });
  
    it("should return 400 and an error message on controller exception", async () => {
      const req = {
        params: { questionID: "3" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      surveyQuestionService.deleteSurveyQuestion.mockImplementation(() => {
        throw new Error("Unexpected error occurred");
      });
  
      await deleteSurveyQuestionController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Unexpected error occurred" });
    });
});