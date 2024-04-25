const express = require("express");
const { userActivityLogController } = require("../controllers");
const { authMiddleware } = require("../middlewares");
const router = express.Router();

router
  .route("/")
  .get(
    authMiddleware.tokenVerification,
    userActivityLogController.getAllActivitiesController
)

module.exports = router;