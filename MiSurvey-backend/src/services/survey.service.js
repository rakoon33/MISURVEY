const db = require("../config/database");
const { Survey, SurveyQuestion, SurveyType, User, Company, SurveyDetail } = require("../models");
const {
  createSurveyQuestion,
  updateSurveyQuestion,
} = require("./surveyQuestion.service");
const { sequelize } = require("../config/database");
const { Op } = require("sequelize");
let nanoid;
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'propie034@gmail.com',  // Địa chỉ email của bạn
    pass: 'ttsq hrvk lvgp aaca'  // App Password của bạn
  }
});

const createSurvey = async (data) => {
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
    // Truy vấn lấy thông tin khảo sát
    const survey = await Survey.findByPk(companyID, {
      include: [{
        model: Company,
        as: "Company",  // Lấy tên người dùng để sử dụng trong email
      }]
    });

    if (!survey) {
      return { status: false, message: "Survey not found" };
    }

    const surveylink = await Survey.findOne({
      where: { SurveyID: surveyID }
    });

    const surveyLink = `http://localhost:8082/#/c/f/${surveylink.SurveyLink}`;
    const surveyCreator = survey.Company.CompanyName;  // Giả sử cột tên người dùng là Username

    // Cấu hình email
    const mailOptions = {
      from: 'propie034@gmail.com',
      to: emailData,  // Danh sách các email được cung cấp
      subject: 'Khảo sát từ MiSurvey',
      text: `Xin chào,

      Một khảo sát đã được tạo bởi ${surveyCreator}
      
      Xin hãy tham gia bằng đường dẫn sau: ${surveyLink}
      
      Trân trọng,
      Đội ngũ MiSurvey`
    };

    // Gửi email
    let info = await transporter.sendMail(mailOptions);

    // Log the email send action into SurveyDetails
    const recipientCount = emailData.split(',').length;
    await SurveyDetail.create({
      SurveyID: surveyID,
      SentBy: survey.UserID, // Assuming Survey model has UserID for who created it
      SentAt: new Date(),  // This could also default at DB level
      RecipientCount: recipientCount,
      Recipients: emailData,
      CompanyID: companyID
    });

    return { status: true, message: "Emails sent successfully", info };
  } catch (error) {
    console.error('Error sending email:', error);
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
          "InvitationMethod",
          "StartDate",
          "EndDate",
          "CreatedAt",
          "ResponseRate",
          "CreatedBy",
          "UpdatedAt",
          "UpdatedBy",
          "Approve",
          "SurveyStatus",
          "SurveyLink",
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
          "InvitationMethod",
          "StartDate",
          "EndDate",
          "CreatedAt",
          "ResponseRate",
          "CreatedBy",
          "UpdatedAt",
          "UpdatedBy",
          "Approve",
          "SurveyStatus",
          "SurveyLink",
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

const updateSurvey = async (surveyID, updateData) => {
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
      }
    }

    await transaction.commit();
    return { status: true, message: "Survey updated successfully" };
  } catch (error) {
    await transaction.rollback();
    return { status: false, message: error.message, error: error.toString() };
  }
};

const deleteSurvey = async (surveyID) => {
  const transaction = await sequelize.transaction();

  try {
    // Check if the survey exists
    const survey = await Survey.findByPk(surveyID);
    if (!survey) {
      return { status: false, message: "Survey not found" };
    }

    // Delete associated questions
    await SurveyQuestion.destroy({
      where: { SurveyID: surveyID },
      transaction,
    });

    // Delete the survey
    await Survey.destroy({
      where: { SurveyID: surveyID },
      transaction,
    });

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

module.exports = {
  createSurvey,
  getOneSurveyWithData,
  getOneSurveyWithoutData,
  getAllSurvey,
  updateSurvey,
  deleteSurvey,
  searchSurvey,
  getOneSurveyWithDataByLink,
  sendEmail
};
