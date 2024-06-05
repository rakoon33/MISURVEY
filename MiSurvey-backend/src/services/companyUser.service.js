const { CompanyUser, User, Company, CompanyRole } = require("../models");
const { createUser } = require("./user.service");
const db = require("../config/database");
const {createLogActivity} = require ("./userActivityLog.service");

const nodemailer = require("nodemailer");

// Cấu hình transporter sử dụng Gmail SMTP với App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "propie034@gmail.com", // Thay thế bằng địa chỉ Gmail của bạn
    pass: "ttsq hrvk lvgp aaca", // Thay thế bằng App Password của bạn
  },
});

const createCompanyUser = async (companyUserData, userData, udata) => {
  const anotherstore = userData.UserPassword;
  const transaction = await db.sequelize.transaction();
  try {
    const { CompanyID, CompanyRoleID } = companyUserData;

    if (!CompanyID || !CompanyRoleID) {
      throw new Error("CompanyID and CompanyRoleID are required");
    }
    const newUser = await createUser(userData, udata);

    if (!newUser.status) {
      throw new Error(newUser.message);
    }

    const newCompanyUser = await CompanyUser.create(
      {
        UserID: newUser.userID,
        CompanyID,
        CompanyRoleID,
      },
      { transaction }
    );
    // Cấu hình và gửi email
    const mailOptions = {
      from: "propie034@gmail.com",
      to: userData.Email,
      subject: "Welcome to MiSurvey!",
      html: `
      <html>
        <body style="font-family: 'Arial', sans-serif; background-color: #f7fafc; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: url('https://example.com/email-background.jpg') no-repeat center center / cover; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h1 style="color: #5a67d8;">Hello,</h1>
            <p style="font-size: 16px; color: black;">Thank you for registering at MiSurvey! We are excited to have you join our growing community.</p>
            <p style="font-size: 16px; color: black;">Your login details for MiSurvey are as follows:</p>
            <ul style="list-style: none; padding: 0;">
              <li>- Username: ${userData.Username}</li>
              <li>- Password: ${anotherstore}</li>
            </ul>
            <p style="color: black;">Please visit the MiSurvey website at <a href="${process.env.FRONTEND_URL}">(click here)</a> and log in using the credentials provided above.</p>
            <p style="font-size: 16px; color: black;">At MiSurvey, you can:</p>
            <ul style="list-style: none; padding: 0;">
              <li style="color: black;>- Create surveys: Easily design online surveys with various question types, branching logic, and custom interfaces.</li>
              <li style="color: black;>- Gather data: Distribute your surveys across multiple channels and collect responses from your target audience.</li>
              <li style="color: black;>- Analyze data: Review your survey results in detail with charts, tables, and in-depth analytics tools.</li>
              <li style="color: black;>- Export reports: Create custom reports to share your insights with stakeholders.</li>
            </ul>
            <p style="color: black;">If you encounter any issues logging in or using MiSurvey, please contact our customer support by email or phone.</p>
            <p style="color: black;">We look forward to your feedback and helping you make the most of MiSurvey!</p>
            <p style="color: black;">Regards,</p>
            <p style="color: black;">The MiSurvey Team</p>
          </div>
        </body>
      </html>`,
    };

    await transporter.sendMail(mailOptions);
    await transaction.commit();
    await createLogActivity(udata.id, 'INSERT', `Company User inserted with ID: ${newCompanyUser.CompanyUserID}`, 'CompanyUsers', udata.companyID);
    return {
      status: true,
      message: "Company User and associated User account created successfully",
      companyUser: newCompanyUser,
    };

  } catch (error) {
    await transaction.rollback();
    return {
      status: false,
      message:
        error.message ||
        "Failed to create company user and associated user account",
      error: error.toString(),
    };
  }
};

const deleteCompanyUser = async (companyUserId, udata) => {
  try {
    const companyUser = await CompanyUser.findByPk(companyUserId);

    if (!companyUser) {
      return { status: false, message: "Company User not found" };
    }

    await companyUser.destroy();
    await createLogActivity(udata.id, 'DELETE', `Company User deleted with ID: ${companyUserId}`, 'CompanyUsers', udata.companyID);
    return { status: true, message: "Company User deleted successfully" };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const getOneCompanyUser = async (companyUserId) => {
  try {
    const companyUser = await CompanyUser.findByPk(companyUserId, {
      include: [
        { model: User, as: "User" },
        { model: Company, as: "Company" },
        { model: CompanyRole, as: "CompanyRole" },
      ],
    });

    if (!companyUser) {
      return { status: false, message: "Company User not found" };
    }

    return {
      status: true,
      message: "Company User fetched successfully",
      companyUser,
    };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

const getAllCompanyUsers = async () => {
  try {
    const companyUsers = await CompanyUser.findAll({
      include: [
        { model: User, as: "User" },
        { model: Company, as: "Company" },
        { model: CompanyRole, as: "CompanyRole" },
      ],
    });

    return {
      status: true,
      message: "All Company Users fetched successfully",
      companyUsers,
    };
  } catch (error) {
    return { status: false, message: error.message, error: error.toString() };
  }
};

module.exports = {
  createCompanyUser,
  deleteCompanyUser,
  getOneCompanyUser,
  getAllCompanyUsers,
};
