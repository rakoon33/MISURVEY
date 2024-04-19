const { surveyService } = require("../services");

const createSurveyController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User not found" });
    }

    const surveyData = {
      ...req.body,
      UserID: req.user.id,
      CompanyID: req.user.companyID,
      CreatedBy: req.user.id,
      CreatedAt: new Date(),
      Approve: req.user.role === "Supervisor" ? "Pending" : "Yes",
    };

    const newSurvey = await surveyService.createSurvey(surveyData);

    res.json(newSurvey);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const sendSurveyEmailController = async (req, res) => {
  try {
    const { SurveyID, EmailData } = req.body;
    const result = await surveyService.sendEmail(SurveyID,EmailData,req.user.companyID);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const getOneSurveyWithDataController = async (req, res) => {
  try {
    const result = await surveyService.getOneSurveyWithData(
      req.params.SurveyID
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOneSurveyWithDataByLinkController = async (req, res) => {
  try {
    const result = await surveyService.getOneSurveyWithDataByLink(
      req.params.SurveyLink
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOneSurveyWithoutDataController = async (req, res) => {
  try {
    const result = await surveyService.getOneSurveyWithoutData(
      req.params.SurveyID
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllSurveyController = async (req, res) => {
  try {
    // Truyền req.user vào hàm getAllSurvey để sử dụng thông tin người dùng
    const result = await surveyService.getAllSurvey(req.user);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSurveyController = async (req, res) => {
  try {
    const result = await surveyService.updateSurvey(
      req.params.SurveyID,
      req.body
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSurveyController = async (req, res) => {
  try {
    const result = await surveyService.deleteSurvey(req.params.SurveyID);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const searchSurveyController = async (req, res) => {
  try {
    const { column, searchTerm } = req.query;

    if (!column || !searchTerm) {
      return res.status(400).json({
        message: "Both column and searchTerm are required as query parameters.",
      });
    }
    const result = await surveyService.searchSurvey(column, searchTerm);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to search surveys." });
  }
};

const getSurveySummaryController = async (req, res) => {
  try {
    const surveyID = req.params.surveyID;
    const result = await surveyService.getSurveySummary(surveyID);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = {
  createSurveyController,
  getOneSurveyWithDataController,
  getOneSurveyWithoutDataController,
  getAllSurveyController,
  updateSurveyController,
  deleteSurveyController,
  searchSurveyController,
  getOneSurveyWithDataByLinkController,
  sendSurveyEmailController,
  getSurveySummaryController
};
