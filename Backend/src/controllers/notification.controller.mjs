import {
  getNotificationsService,
  markNotificationReadService,
  markAllNotificationsReadService,
} from "../services/notification.service.mjs";


/* =========================================================
   GET NOTIFICATIONS
   GET /api/notifications
========================================================= */

export const getNotifications = async (
  req,
  res,
) => {
  try {
    const result =
      await getNotificationsService(
        req.user._id,
      );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error,
    );

    return res.status(
      error.statusCode || 500,
    ).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch notifications",
    });
  }
};


/* =========================================================
   MARK ONE READ
   PATCH /api/notifications/:id/read
========================================================= */

export const markNotificationRead = async (
  req,
  res,
) => {
  try {
    const notification =
      await markNotificationReadService(
        req.user._id,
        req.params.id,
      );

    return res.status(200).json({
      success: true,
      message:
        "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark notification read error:",
      error,
    );

    return res.status(
      error.statusCode || 500,
    ).json({
      success: false,
      message:
        error.message ||
        "Failed to update notification",
    });
  }
};


/* =========================================================
   MARK ALL READ
   PATCH /api/notifications/read-all
========================================================= */

export const markAllNotificationsRead =
  async (req, res) => {
    try {
      await markAllNotificationsReadService(
        req.user._id,
      );

      return res.status(200).json({
        success: true,
        message:
          "All notifications marked as read",
      });
    } catch (error) {
      console.error(
        "Mark all notifications read error:",
        error,
      );

      return res.status(
        error.statusCode || 500,
      ).json({
        success: false,
        message:
          error.message ||
          "Failed to update notifications",
      });
    }
  };