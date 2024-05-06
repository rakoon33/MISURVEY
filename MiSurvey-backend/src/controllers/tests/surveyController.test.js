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

describe("Survey controller: deleteSurveyController", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should successfully delete a survey and return a success message", async () => {
    const req = {
      params: { SurveyID: "1" },
      user: { id: "1", companyID: "1" },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const mockResponse = {
      status: true,
      message: "Survey deleted successfully",
    };

    surveyService.deleteSurvey.mockResolvedValue(mockResponse);

    await deleteSurveyController(req, res);

    expect(surveyService.deleteSurvey).toHaveBeenCalledWith("1", req.user);
    expect(res.json).toHaveBeenCalledWith(mockResponse);
  });

  it("should return 400 and an error message if the survey is not found", async () => {
    const req = {
      params: { SurveyID: "invalidSurveyID" },
      user: { id: "1", companyID: "1" },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    surveyService.deleteSurvey.mockResolvedValue({
      status: false,
      message: "Survey not found",
    });

    await deleteSurveyController(req, res);

    expect(surveyService.deleteSurvey).toHaveBeenCalledWith("invalidSurveyID", req.user);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Survey not found" });
  });

  it("should return 400 and an error message on service error", async () => {
    const req = {
      params: { SurveyID: "1" },
      user: { id: "1", companyID: "1" },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    surveyService.deleteSurvey.mockRejectedValue(new Error("Service error"));

    await deleteSurveyController(req, res);

    expect(surveyService.deleteSurvey).toHaveBeenCalledWith("1", req.user);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
  });
});

describe("Survey controller: searchSurveyController", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should successfully return surveys matching the search criteria", async () => {
    const req = {
      query: {
        column: "Title",
        searchTerm: "Survey Title",
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const mockResponse = {
      status: true,
      data: [
        { SurveyID: "1", Title: "Survey Title" },
        { SurveyID: "2", Title: "Another Survey Title" },
      ],
    };

    surveyService.searchSurvey.mockResolvedValue(mockResponse);

    await searchSurveyController(req, res);

    expect(surveyService.searchSurvey).toHaveBeenCalledWith("Title", "Survey Title");
    expect(res.json).toHaveBeenCalledWith(mockResponse);
  });

  it("should return 400 if column or searchTerm query parameters are missing", async () => {
    const req = {
      query: {},
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await searchSurveyController(req, res);

    expect(surveyService.searchSurvey).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Both column and searchTerm are required as query parameters.",
    });
  });

  it("should return 500 and an error message on service error", async () => {
    const req = {
      query: {
        column: "Title",
        searchTerm: "Survey Title",
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    surveyService.searchSurvey.mockRejectedValue(new Error("Service error"));

    await searchSurveyController(req, res);

    expect(surveyService.searchSurvey).toHaveBeenCalledWith("Title", "Survey Title");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Service error",
    });
  });
});

describe("Survey controller: getOneSurveyWithDataByLinkController", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should successfully fetch a survey with data using the survey link", async () => {
    const req = {
      params: { SurveyLink: "link123" },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const mockResponse = {
      status: true,
      survey: {
        SurveyID: "1",
        SurveyLink: "link123",
        Title: "Survey Title",
        SurveyQuestions: [{ QuestionID: "1", QuestionText: "Question 1" }],
      },
    };

    surveyService.getOneSurveyWithDataByLink.mockResolvedValue(mockResponse);

    await getOneSurveyWithDataByLinkController(req, res);

    expect(surveyService.getOneSurveyWithDataByLink).toHaveBeenCalledWith("link123");
    expect(res.json).toHaveBeenCalledWith(mockResponse);
  });

  it("should return 400 and an error message if the survey is not found", async () => {
    const req = {
      params: { SurveyLink: "invalidLink" },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    surveyService.getOneSurveyWithDataByLink.mockResolvedValue({
      status: false,
      message: "Survey not found",
    });

    await getOneSurveyWithDataByLinkController(req, res);

    expect(surveyService.getOneSurveyWithDataByLink).toHaveBeenCalledWith("invalidLink");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Survey not found" });
  });

  it("should return 400 and an error message on service error", async () => {
    const req = {
      params: { SurveyLink: "link123" },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    surveyService.getOneSurveyWithDataByLink.mockRejectedValue(new Error("Service error"));

    await getOneSurveyWithDataByLinkController(req, res);

    expect(surveyService.getOneSurveyWithDataByLink).toHaveBeenCalledWith("link123");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
  });
});

describe("Survey controller: sendSurveyEmailController", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should successfully send survey emails and return a success message", async () => {
    const req = {
      body: {
        SurveyID: "1",
        EmailData: "test1@example.com,test2@example.com",
      },
      user: { id: "1", companyID: "1" },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const mockResponse = {
      status: true,
      message: "Emails sent successfully",
      info: {},
    };

    surveyService.sendEmail.mockResolvedValue(mockResponse);

    await sendSurveyEmailController(req, res);

    expect(surveyService.sendEmail).toHaveBeenCalledWith("1", req.body.EmailData, "1", "1");
    expect(res.json).toHaveBeenCalledWith(mockResponse);
  });

  it("should return 400 and an error message if the survey is not found", async () => {
    const req = {
      body: {
        SurveyID: "invalidSurveyID",
        EmailData: "test1@example.com,test2@example.com",
      },
      user: { id: "1", companyID: "1" },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    surveyService.sendEmail.mockResolvedValue({
      status: false,
      message: "Survey not found",
    });

    await sendSurveyEmailController(req, res);

    expect(surveyService.sendEmail).toHaveBeenCalledWith("invalidSurveyID", req.body.EmailData, "1", "1");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Survey not found" });
  });

  it("should return 400 and an error message on service error", async () => {
    const req = {
      body: {
        SurveyID: "1",
        EmailData: "test1@example.com,test2@example.com",
      },
      user: { id: "1", companyID: "1" },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    surveyService.sendEmail.mockRejectedValue(new Error("Service error"));

    await sendSurveyEmailController(req, res);

    expect(surveyService.sendEmail).toHaveBeenCalledWith("1", req.body.EmailData, "1", "1");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
  });
});

describe("Survey controller: getSurveySummaryController", () => {
  beforeEach(() => {
    jest.resetAllMocks(); // Reset mocks between tests
  });

  it("should successfully fetch survey summary and return the summary data", async () => {
    const req = {
      params: { surveyID: "1" },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const mockResponse = {
      status: true,
      summary: [
        {
          question: "Question 1",
          type: "Stars",
          averageScore: 4.5,
          countResponses: 10,
          evaluation: "Good",
          responses: [
            {
              customerID: "1",
              customerName: "Customer One",
              customerEmail: "customer1@example.com",
              responseValue: "5",
              evaluation: "Good",
            },
          ],
        },
      ],
    };

    surveyService.getSurveySummary.mockResolvedValue(mockResponse);

    await getSurveySummaryController(req, res);

    expect(surveyService.getSurveySummary).toHaveBeenCalledWith("1");
    expect(res.json).toHaveBeenCalledWith(mockResponse);
  });

  it("should return 400 and an error message if no questions found for the survey", async () => {
    const req = {
      params: { surveyID: "1" },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    surveyService.getSurveySummary.mockResolvedValue({
      status: false,
      message: "No questions found for this survey.",
    });

    await getSurveySummaryController(req, res);

    expect(surveyService.getSurveySummary).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "No questions found for this survey." });
  });

  it("should return 400 and an error message on service error", async () => {
    const req = {
      params: { surveyID: "1" },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    surveyService.getSurveySummary.mockRejectedValue(new Error("Service error"));

    await getSurveySummaryController(req, res);

    expect(surveyService.getSurveySummary).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
  });
});