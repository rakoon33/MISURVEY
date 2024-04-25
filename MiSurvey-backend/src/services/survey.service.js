const db = require("../config/database");
const {
  Survey,
  SurveyQuestion,
  SurveyType,
  User,
  Company,
  SurveyDetail,
  SurveyResponse,
  Customer,
} = require("../models");
const {
  createSurveyQuestion,
  updateSurveyQuestion,
} = require("./surveyQuestion.service");
const {createLogActivity} = require ("./userActivityLog.service");
const { sequelize } = require("../config/database");
const { Op } = require("sequelize");
let nanoid;
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "propie034@gmail.com", // Địa chỉ email của bạn
    pass: "ttsq hrvk lvgp aaca", // App Password của bạn
  },
});

const createSurvey = async (data, udata) => {
  if (!nanoid) {
    nanoid = (await import("nanoid")).nanoid;
  }

  const transaction = await sequelize.transaction();

  try {
    // Create the survey
    const survey = await Survey.create(
      {
        UserID: data.UserID,
        CompanyID: data.CompanyID,
        Title: data.Title,
        SurveyDescription: data.SurveyDescription,
        SurveyImages: data.SurveyImages,
        InvitationMethod: data.InvitationMethod,
        SurveyStatus: data.SurveyStatus,
        Customizations: data.Customizations,
        CreatedBy: data.CreatedBy,
        Approve: data.Approve,
        SurveyStatus: data.SurveyStatus
      },
      { transaction }
    );

    data.SurveyLink = await nanoid();
    await Survey.update(
      { SurveyLink: data.SurveyLink },
      {
        where: { SurveyID: survey.SurveyID },
        transaction,
      }
    );

    // Create survey questions
    for (const questionData of data.SurveyQuestions) {
      questionData.SurveyID = survey.SurveyID;
      await createSurveyQuestion(questionData, transaction);
    }
    await createLogActivity(udata.id, 'INSERT', `Survey created with ID: ${survey.SurveyID}`, 'Surveys', udata.companyID);
    await transaction.commit();
    return { status: true, message: "Survey created successfully", survey };
  } catch (error) {
    await transaction.rollback();
    return { status: false, message: error.message, error: error.toString() };
  }
};

const sendEmail = async (surveyID, emailData, companyID) => {
  console.log(surveyID);
  console.log(emailData);
  try {
    const survey = await Survey.findOne({
      where: { CompanyID: companyID },
      include: [{
        model: Company,
        as: 'Company'
      }]
    });

    if (!survey) {
      return { status: false, message: "Survey not found" };
    }

    const surveylink = await Survey.findOne({
      where: { SurveyID: surveyID },
    });

    const surveyLink = `http://localhost:8082/#/c/f/${surveylink.SurveyLink}`;
    const surveyCreator = survey.Company.CompanyName;
    const mailOptions = {
      from: "propie034@gmail.com",
      to: emailData,
      subject: "Survey from MiSurvey",
      text: `Hello 👬,
    
      A survey has been created by ${surveyCreator}. 🌈🌈🌈
    
      Please participate using the following link: ${surveyLink} 🔗🔗🔗
    
      Sincerely, 
      The MiSurvey Team`,
    };

    let info = await transporter.sendMail(mailOptions);

    // Log the email send action into SurveyDetails
    const recipientCount = emailData.split(",").length;
    await SurveyDetail.create({
      SurveyID: surveyID,
      SentBy: survey.UserID, // Assuming Survey model has UserID for who created it
      SentAt: new Date(), // This could also default at DB level
      RecipientCount: recipientCount,
      Recipients: emailData,
      CompanyID: companyID,
    });

    return { status: true, message: "Emails sent successfully", info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { status: false, message: error.message, error: error.toString() };
  }
};

const getOneSurveyWithData = async (surveyID) => {
  try {
    const survey = await Survey.findByPk(surveyID, {
      include: [
        {
          model: SurveyQuestion,
          as: "SurveyQuestions",
          // Include other nested models or attributes if necessary
        },
      ],
      // Exclude any attributes if necessary
      attributes: {
        exclude: [
          "SurveyDescription",
          "SurveyImages",
          "CreatedAt",
          "ResponseRate",
          "CreatedBy",
          "UpdatedAt",
          "UpdatedBy",
        ],
      },
    });
    if (!survey) {
      return { status: false, message: "Survey not found" };
    }

    return { status: true, survey: survey };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const getOneSurveyWithDataByLink = async (link) => {
  try {
    const survey = await Survey.findOne({
      where: { SurveyLink: link },
      include: [
        {
          model: SurveyQuestion,
          as: "SurveyQuestions",
          // Include other nested models or attributes if necessary
        },
      ],
      attributes: {
        exclude: [
          "SurveyDescription",
          "SurveyImages",
          "CreatedAt",
          "ResponseRate",
          "CreatedBy",
          "UpdatedAt",
          "UpdatedBy",
        ],
      },
    });

    if (!survey) {
      return { status: false, message: "Survey not found" };
    }

    return { status: true, survey: survey };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const getOneSurveyWithoutData = async (surveyID) => {
  try {
    const survey = await Survey.findByPk(surveyID);

    if (!survey) {
      return { status: false, message: "Survey not found" };
    }

    return { status: true, survey };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const getAllSurvey = async (user) => {
  try {
    // Xác định điều kiện lọc dựa trên vai trò người dùng
    let whereCondition = {};
    if (user.role !== "SuperAdmin") {
      whereCondition.CompanyID = user.companyID;
    }

    const surveys = await Survey.findAll({
      where: whereCondition,
      attributes: {
        exclude: [
          "CreatedAt",
          "ResponseRate",
          "CreatedBy",
          "UpdatedAt",
          "UpdatedBy",
        ],
      },
    });
    return { status: true, message: "Surveys fetched successfully", surveys };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const updateSurvey = async (surveyID, updateData, udata) => {
  const transaction = await sequelize.transaction();

  try {
    // Check if the survey exists
    const survey = await Survey.findByPk(surveyID);
    if (!survey) {
      await transaction.rollback();
      return { status: false, message: "Survey not found" };
    }

    // Update the survey
    await Survey.update(updateData, {
      where: { SurveyID: surveyID },
      transaction,
    });

    // Update or create survey questions
    for (const questionData of updateData.SurveyQuestions || []) {
      if (questionData.QuestionID) {
        // Update existing question
        await updateSurveyQuestion(
          questionData.QuestionID,
          questionData,
          transaction
        );
      } else {
        // Create new question
        questionData.SurveyID = surveyID;
        await createSurveyQuestion(questionData, transaction);
        await createLogActivity(udata.id, 'UPDATE', `Survey updated with ID: ${surveyID}`, 'Surveys', udata.companyID);
      }
    }

    await transaction.commit();
    return { status: true, message: "Survey updated successfully" };
  } catch (error) {
    await transaction.rollback();
    return { status: false, message: error.message, error: error.toString() };
  }
};

const deleteSurvey = async (surveyID, udata) => {
  const transaction = await sequelize.transaction();

  try {
    const survey = await Survey.findByPk(surveyID);
    if (!survey) {
      return { status: false, message: "Survey not found" };
    }

    // First, delete responses linked to each question in the survey
    const questions = await SurveyQuestion.findAll({
      where: { SurveyID: surveyID },
      transaction
    });

    for (const question of questions) {
      await SurveyResponse.destroy({
        where: { QuestionID: question.QuestionID },
        transaction
      });
    }

    // Now, delete the questions
    await SurveyQuestion.destroy({
      where: { SurveyID: surveyID },
      transaction
    });

    // Finally, delete the survey
    await Survey.destroy({
      where: { SurveyID: surveyID },
      transaction
    });

    await createLogActivity(udata.id, 'DELETE', `Survey deleted with ID: ${surveyID}`, 'Surveys', udata.companyID);
    await transaction.commit();
    return { status: true, message: "Survey deleted successfully" };
  } catch (error) {
    await transaction.rollback();
    return { status: false, message: error.message, error: error.toString() };
  }
};

const searchSurvey = async (column, searchTerm) => {
  console.log(column, searchTerm);
  try {
    const validColumns = ["Title", "SurveyDescription", "InvitationMethod"];
    if (!validColumns.includes(column) && column !== "Fullname") {
      return {
        status: false,
        message: "Invalid search column",
      };
    }

    let whereClause;
    if (column === "Fullname") {
      // Split names by spaces, hyphens, or capital letters
      let names = searchTerm.split(/\s|-/).map((name) => name.trim());

      // If it's a single string like "NancyMiller", split it further using capital letters
      if (names.length === 1 && names[0].length > 1) {
        names = searchTerm.split(/(?=[A-Z])/).map((name) => name.trim());
      }

      if (names.length === 1) {
        whereClause = {
          [Op.or]: [
            { FirstName: { [Op.like]: `%${names[0]}%` } },
            { LastName: { [Op.like]: `%${names[0]}%` } },
          ],
        };
      } else {
        whereClause = {
          [Op.or]: [
            {
              [Op.and]: [
                { FirstName: { [Op.like]: `%${names[0]}%` } },
                { LastName: { [Op.like]: `%${names[1]}%` } },
              ],
            },
            {
              [Op.and]: [
                { FirstName: { [Op.like]: `%${names[1]}%` } },
                { LastName: { [Op.like]: `%${names[0]}%` } },
              ],
            },
          ],
        };
      }
    } else {
      whereClause = { [column]: { [Op.like]: `%${searchTerm}%` } };
    }

    const users = await Survey.findAll({ where: whereClause });

    if (!users || users.length === 0) {
      return {
        status: false,
        message: "No surveys found for the given search criteria",
      };
    }

    return {
      status: true,
      data: users,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Failed to search survey",
      error: error?.toString(),
    };
  }
};

const getEmoticonsEvaluation = (responses) => {
  const ratingCounts = responses.reduce((acc, { ResponseValue }) => {
    acc[ResponseValue] = (acc[ResponseValue] || 0) + 1;
    return acc;
  }, {});

  const totalRatings = responses.length;
  const positiveRatings =
    (ratingCounts["good"] || 0) + (ratingCounts["very-good"] || 0);
  const negativeRatings =
    (ratingCounts["bad"] || 0) + (ratingCounts["very-bad"] || 0);

  if (positiveRatings / totalRatings > 0.6) return "Good"; // ví dụ: hơn 60% là phản hồi tích cực
  if (negativeRatings / totalRatings > 0.6) return "Bad"; // ví dụ: hơn 60% là phản hồi tiêu cực
  return "Neutral"; // nếu không có tỷ lệ áp đảo nào
};

const calculateNPS = (responses) => {
  let promoters = 0;
  let detractors = 0;
  responses.forEach((response) => {
    const value = parseInt(response.ResponseValue, 10);
    if (value >= 9) promoters++;
    if (value <= 6) detractors++;
  });
  return ((promoters - detractors) / responses.length) * 100; // Trả về giá trị phần trăm NPS
};

const calculateCSAT = (responses) => {
  const satisfiedCustomers = responses.filter(
    (response) => parseInt(response.ResponseValue, 10) >= 4
  ).length;
  return (satisfiedCustomers / responses.length) * 100; // Trả về giá trị phần trăm CSAT
};

const getEvaluationForStars = (averageScore) => {
  if (averageScore <= 2) return "Bad";
  if (averageScore <= 3) return "Neutral";
  if (averageScore < 4) return "Good";
  return "Very Good";
};

const getNPSClassification = (npsScore) => {
  if (npsScore <= 0) return "Bad";
  if (npsScore <= 50) return "Neutral";
  if (npsScore <= 70) return "Good";
  return "Very Good";
};

const getCSATClassification = (csatScore) => {
  if (csatScore <= 40) return "Bad";
  if (csatScore <= 60) return "Neutral";
  if (csatScore <= 80) return "Good";
  return "Very Good";
};

const evaluateResponse = (responseValue, surveyType) => {
  // Xử lý cho Emoticons
  if (surveyType === "Emoticons") {
    switch (responseValue) {
      case "very-bad":
      case "bad":
        return "Bad";
      case "meh":
        return "Neutral";
      case "good":
      case "very-good":
        return "Good";
      default:
        return "Undefined";
    }
  }
  // Xử lý cho Stars
  if (surveyType === "Stars") {
    const value = parseInt(responseValue, 10);
    if (value <= 2) return "Bad";
    if (value === 3) return "Neutral";
    if (value >= 4) return "Good";
  }

  // Xử lý cho Thumbs
  if (surveyType === "Thumbs") {
    return responseValue === "true" ? "Good" : "Bad";
  }

  // Xử lý cho NPS
  if (surveyType === "NPS") {
    const value = parseInt(responseValue, 10);
    if (value >= 0 && value <= 6) return "Bad";
    if (value === 7 || value === 8) return "Neutral";
    if (value === 9 || value === 10) return "Good";
  }

  // Xử lý cho CSAT
  if (surveyType === "CSAT") {
    const value = parseInt(responseValue, 10);
    if (value >= 1 && value <= 2) return "Bad";
    if (value === 3) return "Neutral";
    if (value >= 4) return "Good";
  }

  // Xử lý cho Text
  if (surveyType === "Text") {
    return "Received"; // Phản hồi dạng văn bản không cần đánh giá
  }

  return "Undefined"; // Nếu không khớp với bất kỳ loại khảo sát nào
};

const getSurveySummary = async (surveyID) => {
  try {
    const questions = await SurveyQuestion.findAll({
      where: { SurveyID: surveyID },
      include: [
        {
          model: SurveyType,
          as: "SurveyType",
        },
        {
          model: SurveyResponse,
          as: "Responses",
          include: [
            {
              model: Customer,
              as: "Customer",
            },
          ],
        },
      ],
      order: [["PageOrder", "ASC"]],
    });

    if (!questions || questions.length === 0) {
      return { status: false, message: "No questions found for this survey." };
    }

    const summary = questions.map((question) => {
      const countResponses = question.Responses.length;
      let averageScore = null; // Default to null
      let evaluation = "Undefined"; // Default evaluation

      switch (question.SurveyType.SurveyTypeName) {
        case "Stars":
          averageScore =
            question.Responses.reduce(
              (acc, { ResponseValue }) => acc + parseInt(ResponseValue, 10),
              0
            ) / countResponses;
          evaluation = getEvaluationForStars(averageScore);
          break;
        case "Emoticons":
          evaluation = getEmoticonsEvaluation(question.Responses);
          break;
        case "Thumbs":
          const thumbsUpCount = question.Responses.filter(
            ({ ResponseValue }) => ResponseValue === "true"
          ).length;
          evaluation = thumbsUpCount > countResponses / 2 ? "Good" : "Bad";
          break;
        case "NPS":
          averageScore = calculateNPS(question.Responses); // Tính giá trị trung bình NPS
          evaluation = getNPSClassification(averageScore); // Lấy đánh giá NPS dựa trên giá trị phần trăm
          break;

        case "CSAT":
          averageScore = calculateCSAT(question.Responses); // Tính giá trị trung bình CSAT
          evaluation = getCSATClassification(averageScore); // Lấy đánh giá CSAT dựa trên giá trị phần trăm
          break;
        case "Text":
          evaluation = "Received"; // Evaluation for text responses
          break;
      }

      return {
        question: question.QuestionText,
        type: question.SurveyType.SurveyTypeName,
        averageScore: averageScore, // Now defined and scoped correctly
        countResponses,
        evaluation,
        responses: question.Responses.map((response) => ({
          customerID: response.Customer.CustomerID,
          customerName: response.Customer.FullName,
          customerEmail: response.Customer.Email,
          responseValue: response.ResponseValue,
          evaluation: evaluateResponse(
            response.ResponseValue,
            question.SurveyType.SurveyTypeName
          ),
        })),
      };
    });

    return { status: true, summary: summary };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

module.exports = {
  createSurvey,
  getOneSurveyWithData,
  getOneSurveyWithoutData,
  getAllSurvey,
  updateSurvey,
  deleteSurvey,
  searchSurvey,
  getOneSurveyWithDataByLink,
  sendEmail,
  getSurveySummary,
};
