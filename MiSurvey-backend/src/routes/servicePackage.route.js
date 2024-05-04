const express = require("express");
const { servicePackageController } = require("../controllers");
const { authMiddleware } = require("../middlewares");
const router = express.Router();


router
  .route("/")
  .post(
    authMiddleware.tokenVerification,
    servicePackageController.createServicePackageController
);

module.exports = router;