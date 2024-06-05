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
const { createLogActivity } = require("./userActivityLog.service");
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
        SurveyStatus: data.SurveyStatus,
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
    await createLogActivity(
      udata.id,
      "INSERT",
      `Survey created with ID: ${survey.SurveyID}`,
      "Surveys",
      udata.companyID
    );
    await transaction.commit();
    return { status: true, message: "Survey created successfully", survey };
  } catch (error) {
    await transaction.rollback();
    return { status: false, message: error.message, error: error.toString() };
  }
};

const sendEmail = async (surveyID, emailData, companyID, sendBy) => {
  try {
    const survey = await Survey.findOne({
      where: { CompanyID: companyID },
      include: [
        {
          model: Company,
          as: "Company",
        },
      ],
    });

    if (!survey) {
      return { status: false, message: "Survey not found" };
    }

    const surveylink = await Survey.findOne({
      where: { SurveyID: surveyID },
    });

    const surveyLink = `${process.env.FRONTEND_URL}/#/c/f/${surveylink.SurveyLink}`;
    const surveyCreator = survey.Company.CompanyName;
    const mailOptions = {
      from: "propie034@gmail.com",
      to: emailData,
      subject: "Survey from MiSurvey",
      html: `
      <html>
        <body style="font-family: 'Arial', sans-serif; background-color: #f7fafc; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: url('https://example.com/email-background.jpg') no-repeat center center / cover; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h1 style="color: #5a67d8;">Hello,</h1>
            <p style="font-size: 16px; color: black;">A survey has been created by <strong>${surveyCreator}</strong>. We value your feedback and would love to hear from you!</p>
            <p><a href="${surveyLink}" style="color: #4299e1; text-decoration: none; font-weight: bold;">Click here to access the survey</a></p>
            <p style="color: #777;">Sincerely,<br>The MiSurvey Team</p>
          </div>
        </body>
      </html>
      `,
    };

    let info = await transporter.sendMail(mailOptions);

    // Log the email send action into SurveyDetails
    const existingDetails = await SurveyDetail.findOne({
      where: {
        SurveyID: surveyID
      }
    });

    // Filter out already sent emails to avoid duplicates
    const newEmails = emailData.split(',').filter(email => !existingDetails || !existingDetails.Recipients.includes(email.trim()));
    const recipientCount = newEmails.length;
    if (existingDetails && recipientCount > 0) {
      // Update existing details
      await existingDetails.update({
        SentBy: sendBy,
        SentAt: new Date(),
        RecipientCount: existingDetails.RecipientCount + recipientCount,
        Recipients: existingDetails.Recipients ? existingDetails.Recipients + ", " + newEmails.join(", ") : newEmails.join(", "),
      });
    } else if (!existingDetails) {
      // Create new details if no details exist
      await SurveyDetail.create({
        SurveyID: surveyID,
        SentBy: sendBy,
        SentAt: new Date(),
        RecipientCount: recipientCount,
        Recipients: newEmails.join(", "),
        CompanyID: companyID,
      });
    }

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
        await createLogActivity(
          udata.id,
          "UPDATE",
          `Survey updated with ID: ${surveyID}`,
          "Surveys",
          udata.companyID
        );
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
      transaction,
    });

    for (const question of questions) {
      await SurveyResponse.destroy({
        where: { QuestionID: question.QuestionID },
        transaction,
      });
    }

    // Now, delete the questions
    await SurveyQuestion.destroy({
      where: { SurveyID: surveyID },
      transaction,
    });

    // Now, delete the questions
    await SurveyDetail.destroy({
      where: { SurveyID: surveyID },
      transaction,
    });

    // Finally, delete the survey
    await Survey.destroy({
      where: { SurveyID: surveyID },
      transaction,
    });

    await createLogActivity(
      udata.id,
      "DELETE",
      `Survey deleted with ID: ${surveyID}`,
      "Surveys",
      udata.companyID
    );
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
  if (responses.length === 0) return "No Responses";

  const ratingCounts = responses.reduce((acc, { ResponseValue }) => {
    acc[ResponseValue] = (acc[ResponseValue] || 0) + 1;
    return acc;
  }, {});

  const totalRatings = responses.length;
  const positiveRatings =
    (ratingCounts["good"] || 0) + (ratingCounts["very-good"] || 0);
  const positivePercentage = (positiveRatings / totalRatings) * 100;

  // Evaluate based on positive percentage
  if (positivePercentage <= 35) {
    return "Highly Unsatisfied";
  } else if (positivePercentage <= 50) {
    return "Unsatisfied";
  } else if (positivePercentage <= 65) {
    return "Quite Satisfied";
  } else if (positivePercentage <= 80) {
    return "Satisfied";
  } else {
    return "Highly Satisfied";
  }
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
  if (isNaN(averageScore)) return "No Responses";
  if (averageScore <= 1) {
    return "Very Bad";
  } else if (averageScore <= 2) {
    return "Bad";
  } else if (averageScore <= 3) {
    return "Neutral";
  } else if (averageScore < 4.5) {
    return "Good";
  } else {
    return "Excellent";
  }
};

const getNPSClassification = (score) => {
  if (isNaN(score)) return "No Responses";
  if (score < 0) {
    return "Needs improvement";
  } else if (score <= 30) {
    return "Good";
  } else if (score <= 70) {
    return "Great";
  } else {
    return "Excellent";
  }
};

const getCSATClassification = (score) => {
  if (isNaN(score)) return "No Responses";
  if (score < 35) {
    return "Highly Unsatisfied";
  } else if (score <= 50) {
    return "Unsatisfied";
  } else if (score <= 65) {
    return "Quite Satisfied";
  } else if (score <= 80) {
    return "Satisfied";
  } else {
    return "Highly Satisfied";
  }
};

const evaluateThumbs = (responses) => {
  
  const thumbsUpCount = responses.filter(
    ({ ResponseValue }) => ResponseValue === "true"
  ).length;
  const thumbsDownCount = responses.filter(
    ({ ResponseValue }) => ResponseValue === "false"
  ).length;
  const totalResponses = thumbsUpCount + thumbsDownCount;

  // Ensure no division by zero
  if (totalResponses === 0) {
    return "No Responses";
  }

  const thumbsUpPercentage = (thumbsUpCount / totalResponses) * 100;

  // Determine the evaluation based on the percentage of thumbs up
  if (thumbsUpPercentage <= 35) {
    return "Highly Unsatisfied";
  } else if (thumbsUpPercentage <= 50) {
    return "Unsatisfied";
  } else if (thumbsUpPercentage <= 65) {
    return "Quite Satisfied";
  } else if (thumbsUpPercentage <= 80) {
    return "Satisfied";
  } else {
    return "Highly Satisfied";
  }
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
          evaluation = evaluateThumbs(question.Responses);
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
          responseID: response.ResponseID,
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


const getSurveyDetailsByResponseId = async (responseID) => {
  try {
    const response = await SurveyResponse.findByPk(responseID, {
      include: [
        {
          model: Survey,
          as: "Survey",
        },
        {
          model: SurveyQuestion,
          as: "SurveyQuestion", 
        },
      ],
    });

    if (!response) {
      return { status: false, message: "Response not found" };
    }

    const survey = response.Survey;
    const question = response.SurveyQuestion;

    if (!survey || !question) {
      return { status: false, message: "Survey or Question not found" };
    }

    return {
      status: true,
      surveyId: survey.SurveyID,
      questionIndex: question.PageOrder - 1,
    };
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
  getNPSClassification,
  getCSATClassification,
  getEvaluationForStars,
  getSurveyDetailsByResponseId,

};
