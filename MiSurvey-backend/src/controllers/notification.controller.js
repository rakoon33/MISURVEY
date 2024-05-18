const { notificationService } = require("../services");

const getNotificationsController = async (req, res) => {
  const companyID = req.user.companyID; 
  try {
    const result = await notificationService.getNotificationsByCompany(companyID);
    if (result.status) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateNotificationStatusController = async (req, res) => {
  const { notificationID } = req.params;
  const { status } = req.body;

  try {
    const result = await notificationService.updateNotificationStatus(notificationID, status);
    if (result.status) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

const countUnreadNotificationsController = async (req, res) => {
  const companyID = req.user.companyID; // Get companyId from the authenticated user
  try {
    const result = await notificationService.countUnreadNotifications(companyID);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getNotificationsController,
  updateNotificationStatusController,
  countUnreadNotificationsController
};
