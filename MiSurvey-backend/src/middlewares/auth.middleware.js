const jwt = require('jsonwebtoken');
const { asyncHandler } = require('./asyncHandler');
const {User, Company, CompanyUser, CompanyRole, Module, IndividualPermission, RolePermission } = require('../models');

const tokenVerification = async (req, res, next) => {
  console.log(
    `authentication.middleware | tokenVerification | ${req?.originalUrl}`
  );
  try { 
    let token;

    // Read JWT from the 'jwt' cookie
    token = req.cookies.jwt;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            status: false,
            message: err?.name ? err?.name : "Invalid token",
            error: `Invalid token | ${err?.message}`,
          });
        }
        
        req.user = decoded;
        next();
      });
    } else {
      res.status(401).json({
        status: false,
        message: "Token is missing",
        error: "Token is missing",
      });
    }
  } catch (error) {
    res.status(401).json({
      status: false,
      message: error?.message ? error?.message : "Authentication failed",
      error: `Authentication failed | ${error?.message}`,
    });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role == 'SuperAdmin') {
    next()
  } else {
    res.status(401)
    return {
      status: false,
      message: "Access denied"
    };
  }      
}
const checkPermission = async (req, res, next, action) => {
  try {
    // Giả sử req.user.id là ID của người dùng và req.moduleName là tên của module cần truy cập.
    const userId = req.user.id;
    const moduleName = req.moduleName;

    // Tìm thông tin người dùng trong công ty.
    const companyUser = await CompanyUsers.findOne({ where: { UserID: userId } });
    if (!companyUser) {
      return res.status(403).json({ message: 'User does not belong to any company' });
    }

    // Tìm thông tin module bằng tên.
    const module = await Modules.findOne({ where: { ModuleName: moduleName } });
    if (!module) {
      return res.status(400).json({ message: 'Module not found' });
    }

    // Kiểm tra IndividualPermissions trước.
    const individualPermission = await IndividualPermissions.findOne({
      where: {
        CompanyUserID: companyUser.CompanyUserID,
        ModuleID: module.ModuleID
      }
    });

    // Nếu người dùng có IndividualPermission và có quyền cần thiết, cho phép truy cập.
    if (individualPermission && individualPermission[action]) {
      return next();
    }

    // Nếu không có IndividualPermissions hoặc không có quyền, kiểm tra RolePermissions.
    const rolePermission = await RolePermissions.findOne({
      where: {
        CompanyRoleID: companyUser.CompanyRoleID,
        ModuleID: module.ModuleID
      }
    });

    // Kiểm tra quyền dựa trên vai trò của người dùng.
    if (rolePermission && rolePermission[action]) {
      return next();
    }

    // Nếu không có quyền trong cả hai bảng, từ chối truy cập.
    return res.status(403).json({ message: `You do not have permission to ${action} this module` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  tokenVerification,
  isSuperAdmin
};
