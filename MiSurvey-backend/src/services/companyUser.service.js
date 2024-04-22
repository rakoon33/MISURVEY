const { CompanyUser, User, Company, CompanyRole } = require("../models");
const { createUser } = require("./user.service");
const db = require("../config/database");
const nodemailer = require("nodemailer");

// Cấu hình transporter sử dụng Gmail SMTP với App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "propie034@gmail.com", // Thay thế bằng địa chỉ Gmail của bạn
    pass: "ttsq hrvk lvgp aaca", // Thay thế bằng App Password của bạn
  },
});

const createCompanyUser = async (companyUserData, userData) => {
  const anotherstore = userData.UserPassword;
  const transaction = await db.sequelize.transaction();
  try {
    const { CompanyID, CompanyRoleID } = companyUserData;

    if (!CompanyID || !CompanyRoleID) {
      throw new Error("CompanyID and CompanyRoleID are required");
    }

    const newUser = await createUser(userData);

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
      to: userData.Email, // Email người dùng mới
      subject: "Chào mừng bạn đến với MiSurvey!",
      text: `Xin chào,

      Cảm ơn bạn đã đăng ký tài khoản MiSurvey! Chúng tôi rất vui mừng được chào đón bạn đến với cộng đồng người dùng ngày càng phát triển của chúng tôi.
      
      Email này cung cấp thông tin đăng nhập cho tài khoản MiSurvey của bạn:
      
      Tên người dùng: ${userData.Username}
      Mật khẩu: ${anotherstore}
      
      Vui lòng truy cập trang web MiSurvey tại http://www.conti-creations.com/MIS.htm và đăng nhập bằng thông tin đăng nhập được cung cấp ở trên.
      
      Tại MiSurvey, bạn có thể:
      
      Tạo khảo sát: Thiết kế khảo sát trực tuyến một cách dễ dàng với nhiều loại câu hỏi, logic nhánh và tùy chỉnh giao diện.
      Thu thập dữ liệu: Phân phối khảo sát của bạn qua nhiều kênh khác nhau và thu thập phản hồi từ đối tượng mục tiêu của bạn.
      Phân tích dữ liệu: Xem xét kết quả khảo sát của bạn một cách chi tiết với các biểu đồ, bảng biểu và công cụ phân tích chuyên sâu.
      Xuất báo cáo: Tạo báo cáo tùy chỉnh để chia sẻ thông tin chi tiết của bạn với các bên liên quan.
      MiSurvey cung cấp nhiều tính năng và nguồn lực để giúp bạn tạo và phân tích khảo sát một cách hiệu quả. Hãy truy cập http://www.conti-creations.com/MIS.htm để tìm hiểu thêm về các tính năng của chúng tôi và bắt đầu tạo khảo sát đầu tiên của bạn ngay hôm nay!
      
      Nếu bạn gặp bất kỳ vấn đề nào khi đăng nhập hoặc sử dụng MiSurvey, vui lòng liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi qua email https://www.reddit.com/r/MonsterHunter/comments/vppax2/whats_the_difference_between_support_surveys_and/ hoặc qua điện thoại [Số điện thoại].
      
      Chúng tôi rất mong nhận được phản hồi của bạn và giúp bạn tận dụng tối đa MiSurvey!
      
      Trân trọng,
      
      Đội ngũ MiSurvey`,
    };

    await transporter.sendMail(mailOptions);
    await transaction.commit();

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

const deleteCompanyUser = async (companyUserId) => {
  try {
    const companyUser = await CompanyUser.findByPk(companyUserId);

    if (!companyUser) {
      return { status: false, message: "Company User not found" };
    }

    await companyUser.destroy();
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
