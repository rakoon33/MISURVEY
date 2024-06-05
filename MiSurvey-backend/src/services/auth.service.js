const bcrypt = require("bcrypt");
const {
  User,
  CompanyUser,
  Company,
  IndividualPermission,
  RolePermission,
  Module,
  ServicePackage,
  UserPackage,
} = require("../models");
const { tokenFunctions } = require("../utils");
const db = require("../config/database");
const { createLogActivity } = require("./userActivityLog.service");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

const loginUser = async (res, username, password) => {
  try {
    const user = await User.findOne({ where: { Username: username } });

    if (user && user.UserRole != "SuperAdmin") {
      companyUser = await CompanyUser.findOne({
        where: { UserID: user.UserID },
      });

      if (!companyUser) {
        return { status: false, message: "The user does not belong to any company." };
      }
    }

    if(!user.IsActive) {
      return { status: false, message: "The user has been deactivated." };
    }

    let token;
    if (user) {
      const isPasswordVerified = await bcrypt.compare(
        password.trim(),
        user.UserPassword
      );
      if (isPasswordVerified) {
        const companyUser = await CompanyUser.findOne({
          where: { UserID: user.UserID },
        });

        if (companyUser) {
          token = await tokenFunctions.generateToken(
            user.UserID,
            user.Username,
            user.UserRole,
            companyUser.dataValues.CompanyID
          );
        } else {
          token = await tokenFunctions.generateToken(
            user.UserID,
            user.Username,
            user.UserRole
          );
        }

        // Set JWT as an HTTP-Only cookie
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
          sameSite: "strict", // Prevent CSRF attacks
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        await user.update({ LastLogin: new Date() });

        return {
          status: true,
          message: "User login successful",
        };
      } else {
        return {
          status: false,
          message: "Incorrect username or password",
        };
      }
    } else {
      return {
        status: false,
        message: "Incorrect username or password",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "User login failed",
      error: error?.toString(),
    };
  }
};

const registerUser = async (userData) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { firstName, lastName, companyName, email, username, password } =
      userData;

    const userExists = await User.findOne({ where: { Username: username } });

    if (userExists) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create(
      {
        Username: username,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        UserPassword: hashedPassword,
        UserRole: "Admin",
        UserAvatar: "./assets/img/avatars/avt_default.png",
      },
      { transaction }
    );

    // Create the company
    const newCompany = await Company.create(
      {
        CompanyName: companyName,
        AdminID: newUser.UserID,
      },
      { transaction }
    );

    // Link user to the company
    await CompanyUser.create(
      {
        UserID: newUser.UserID,
        CompanyID: newCompany.CompanyID,
      },
      { transaction }
    );

    // Tạo gói dịch vụ miễn phí cho công ty
    const freeServicePackage = await ServicePackage.findOne({
      where: { PackageName: "Free" },
    });
    if (!freeServicePackage) {
      throw new Error("Free service package not found");
    }

    await UserPackage.create(
      {
        UserID: newUser.UserID,
        PackageID: freeServicePackage.PackageID,
        StartDate: new Date(),
        CompanyID: newCompany.CompanyID,
      },
      { transaction }
    );

    await transaction.commit();
    await createLogActivity(
      newUser.UserID,
      "INSERT",
      `A new user has been created`,
      "Users",
      newCompany.CompanyID
    );
    return {
      status: true,
      message: "Registration successful",
      data: {
        user: newUser,
        company: newCompany,
      },
    };
  } catch (error) {
    await transaction.rollback();
    return {
      status: false,
      message: error.message || "Registration failed",
      error: error.toString(),
    };
  }
};

const logoutUser = (res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return {
    status: true,
    message: "Logged out successfully",
  };
};

const getUserPermissions = async (userId) => {
  try {
    const companyUser = await CompanyUser.findOne({
      where: { UserID: userId },
    });
    if (!companyUser) {
      throw new Error("Company user not found");
    }

    let permissionsMap = {};

    if (companyUser.CompanyUserID) {
      const individualPermissions = await IndividualPermission.findAll({
        where: { CompanyUserID: companyUser.CompanyUserID },
        include: [{ model: Module, as: "module", required: true }],
      });

      permissionsMap = individualPermissions.reduce((acc, permission) => {
        if (permission.module) {
          acc[permission.module.ModuleName] = permission;
        }
        return acc;
      }, {});
    }

    if (companyUser.CompanyRoleID) {
      const rolePermissions = await RolePermission.findAll({
        where: { CompanyRoleID: companyUser.CompanyRoleID },
        include: [{ model: Module, as: "module", required: true }],
      });

      rolePermissions.forEach((permission) => {
        if (
          permission.module &&
          !permissionsMap.hasOwnProperty(permission.module.ModuleName)
        ) {
          permissionsMap[permission.module.ModuleName] = permission;
        }
      });
    }

    const mergedPermissions = Object.values(permissionsMap).sort(
      (a, b) => a.module.ModuleID - b.module.ModuleID
    );

    return {
      companyUserId: companyUser.CompanyUserID,
      permissions: mergedPermissions,
    };
  } catch (error) {
    throw new Error(error.message || "Failed to fetch permissions");
  }
};

const generatePasswordResetToken = async (email) => {
  try {
    const user = await User.findOne({ where: { Email: email } });
    if (!user) {
      return {
        status: false,
        message: "No account with that email address exists.",
      };
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.ResetPasswordToken = resetToken;
    user.ResetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    return { status: true, resetToken, email: user.Email };
  } catch (error) {
    return {
      status: false,
      message: error,
    };
  }
};

const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "propie034@gmail.com", // Địa chỉ email của bạn
        pass: "ttsq hrvk lvgp aaca", // App Password của bạn
      },
    });

    const resetURL = `${process.env.FRONTEND_URL}/#/reset-password/${resetToken}`;
    let mailOptions = {
      to: email,
      from: "propie034@gmail.com",
      subject: "Password Reset",
      text:
        `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `${resetURL}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: true,
      message: '"Your password has been updated.',
    };
  } catch (error) {
    return {
      status: false,
      message: error,
    };
  }
};

const resetUserPassword = async (token, newPassword) => {
  try {
    const user = await User.findOne({
      where: {
        ResetPasswordToken: token,
        ResetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      throw new Error("Password reset token is invalid or has expired.");
    }

    user.UserPassword = await bcrypt.hash(newPassword, 10);
    user.ResetPasswordToken = null;
    user.ResetPasswordExpires = null;
    await user.save();
    return {
      status: true,
      message: "Reset password successfully",
    };
  } catch (error) {
    return {
      status: false,
      message: error,
    };
  }
};

module.exports = {
  loginUser,
  logoutUser,
  registerUser,
  getUserPermissions,
  generatePasswordResetToken,
  sendPasswordResetEmail,
  resetUserPassword,
};
