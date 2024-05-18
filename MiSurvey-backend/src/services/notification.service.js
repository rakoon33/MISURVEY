const { Notification } = require("../models");


const getNotificationsByCompany = async (companyID) => {
  try {
    const notifications = await Notification.findAll({
      where: { CompanyID: companyID },
      order: [["CreatedAt", "DESC"]], // Ordering by creation date, newest first
    });
    return {
      status: true,
      data: notifications,
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      status: false,
      message: "Failed to fetch notifications",
      error: error.message,
    };
  }
};

const updateNotificationStatus = async (notificationID, status) => {
  try {
    const notification = await Notification.findByPk(notificationID);
    if (!notification) {
      return { status: false, message: "Notification not found" };
    }

    notification.NotificationStatus = status;
    await notification.save();

    return {
      status: true,
      message: "Notification status updated successfully",
      data: notification,
    };
  } catch (error) {
    console.error("Error updating notification status:", error);
    return {
      status: false,
      message: "Failed to update notification status",
      error: error.message,
    };
  }
};

const countUnreadNotifications = async (companyID) => {
  try {
    const count = await Notification.count({
      where: {
        CompanyID: companyID,
        NotificationStatus: "Unread",
      },
    });
    return {
      status: true,
      count: count,
    };
  } catch (error) {
    console.error("Error counting unread notifications:", error);
    return {
      status: false,
      message: "Failed to count unread notifications",
      error: error.message,
    };
  }
};

module.exports = {
  getNotificationsByCompany,
  updateNotificationStatus,
  countUnreadNotifications,
};
