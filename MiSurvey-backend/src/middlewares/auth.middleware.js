const jwt = require("jsonwebtoken");
const { asyncHandler } = require("./asyncHandler");
const {
  User,
  Company,
  CompanyUser,
  CompanyRole,
  Module,
  IndividualPermission,
  RolePermission,
} = require("../models");
const { tokenFunctions } = require("../utils");

const tokenVerification = (req, res, next) => {
  console.log(
    `authentication.middleware | tokenVerification | ${req?.originalUrl}`
  );
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: false,
        message: "Token is missing or improperly formatted",
        error: "Token is missing or improperly formatted",
      });
    }

    const token = authHeader.split(' ')[1]; // Split 'Bearer' from the toke

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err && err.name === "TokenExpiredError") {
        // Token has expired. Now let's ignore the expiration and verify it again to get the decoded payload.
        jwt.verify(
          token,
          process.env.JWT_SECRET,
          { ignoreExpiration: true },
          async (error, refreshedDecoded) => {
            if (error) {
              return res.status(401).json({
                status: false,
                message: error?.name ? error?.name : "Invalid token",
                error: `Invalid token | ${error?.message}`,
              });
            }
            // Successfully decoded the token, now we can generate a new one

            const newToken = await tokenFunctions.generateToken(
              refreshedDecoded.id,
              refreshedDecoded.username,
              refreshedDecoded.role,
              refreshedDecoded.companyID
            );

            // Set the new token in the cookie
            res.cookie("jwt", newToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
              sameSite: "strict", // Prevent CSRF attacks
            });
            // Proceed with the request
            req.user = refreshedDecoded;
            next();
          }
        );
      } else if (err) {
        // If there's another error, the token is invalid
        return res.status(401).json({
          status: false,
          message: "Invalid token",
          error: err.message,
        });
      } else {
        // If there's no error, the token is valid
        req.user = decoded;
        next();
      }
    });
  } catch (error) {
    res.status(401).json({
      status: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role == "SuperAdmin") {
    next();
  } else {
    res.status(401).json({
      status: false,
      message: "Access denied",
    });
  }
};

module.exports = {
  tokenVerification,
  isSuperAdmin,
};
