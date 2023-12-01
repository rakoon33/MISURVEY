const bcrypt = require("bcrypt");
const { User, CompanyUser, Company, IndividualPermission, RolePermission, Module } = require("../models");
const { tokenFunctions } = require("../utils");
const db = require("../config/database");

const loginUser = async (res, username, password) => {
  try {
    
    const user = await User.findOne({ where: { Username: username } });

    if (user) {
      const isPasswordVerified = await bcrypt.compare(password.trim(), user.UserPassword);
      if (isPasswordVerified) {
        
          const token = await tokenFunctions.generateToken(user.UserID, user.Username, user.UserRole);

          // Set JWT as an HTTP-Only cookie
          res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
            sameSite: 'strict', // Prevent CSRF attacks
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          });
        return {
          status: true,
          message: "User login successful",
        };
      } else {
          return {
              status: false,
              message: "Incorrect password"
          };
      }
    } else {
        return {
            status: false,
            message: "No user found"
        };
    }
  } catch (error) {
    console.log(error);   
        return {
            status: false,
            message: "User login failed",
            error: error?.toString()
        } 
  }
};
const registerUser = async (userData) => {
  console.log("Received userData:", userData);

  const transaction = await db.sequelize.transaction();

  try {
    // Destructure userData with the exact keys from your JSON request
    const { firstName, lastName, companyName, email, username, password } =
      userData;

    // Check if the user already exists
    const userExists = await User.findOne({ where: { Username: username } });
    if (userExists) {
      throw new Error("User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create(
      {
        Username: username,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        UserPassword: hashedPassword,
        UserRole: "Admin",
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

    await transaction.commit();
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

// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;

//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     res.status(400);
//     throw new Error('User already exists');
//   }

//   const user = await User.create({
//     name,
//     email,
//     password,
//   });

//   if (user) {
//     generateToken(res, user._id);

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//     });
//   } else {
//     res.status(400);
//     throw new Error('Invalid user data');
//   }
// });

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

const checkUserPermissions = async (userId) => {
  try {
    const userDetails = await User.findByPk(userId);
    if (!userDetails) {
      throw new Error('User not found');
    }

    // Destructure to separate the UserPassword and the rest of the userDetails
    const { UserPassword, ...userDetailsWithoutPassword } = userDetails.dataValues;

    const companyUser = await CompanyUser.findOne({ where: { UserID: userId } });
    if (!companyUser) {
      throw new Error('Company user not found');
    }

    let permissionsMap = {};

    if (companyUser.CompanyUserID) {
      const individualPermissions = await IndividualPermission.findAll({
        where: { CompanyUserID: companyUser.CompanyUserID },
        include: [{ model: Module, as: 'module', required: true }]
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
        include: [{ model: Module, as: 'module1', required: true }]
      });

      rolePermissions.forEach(permission => {
        if (permission.module1 && !permissionsMap.hasOwnProperty(permission.module1.ModuleName)) {
          permissionsMap[permission.module1.ModuleName] = permission;
        }
      });
    }

    const mergedPermissions = Object.values(permissionsMap);

    return {
      userDetails: userDetailsWithoutPassword,
      permissions: mergedPermissions
    };
  } catch (error) {
    throw new Error(error.message || "Failed to fetch permissions");
  }
};




module.exports = {
  loginUser,
  logoutUser,
  registerUser,
  checkUserPermissions
  // ...other exported functions
};
