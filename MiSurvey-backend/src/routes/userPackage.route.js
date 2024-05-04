const express = require("express");
const { userPackageController } = require("../controllers");
const { authMiddleware } = require("../middlewares");
const router = express.Router();


router
  .route("/")
  .post(
    authMiddleware.tokenVerification,
    userPackageController.createUserPackageController
);

module.exports = router;