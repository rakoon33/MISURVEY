const express = require("express");
const { notificationController } = require("../controllers");
const { authMiddleware } = require("../middlewares");
const router = express.Router();

router.get(
  "/",
  authMiddleware.tokenVerification,
  notificationController.getNotificationsController
);

router.get(
  "/count-unread",
  authMiddleware.tokenVerification,
  notificationController.countUnreadNotificationsController
);

router.put(
  "/notification-status/:notificationID",
  authMiddleware.tokenVerification,
  notificationController.updateNotificationStatusController
);

module.exports = router;