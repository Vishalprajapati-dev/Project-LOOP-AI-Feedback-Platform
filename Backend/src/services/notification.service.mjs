import mongoose from "mongoose";

import Notification from "../models/notification.model.mjs";
import User from "../models/user.model.mjs";
import createError from "../utils/createError.mjs";

/* =========================================================
   CREATE FEEDBACK ALERTS
========================================================= */

export const createFeedbackAlertNotifications = async (
  workspaceId,
  feedback,
) => {
  if (!workspaceId) {
    throw createError(
      "Workspace ID is required",
      400,
    );
  }

  if (!feedback?._id) {
    throw createError(
      "Feedback ID is required",
      400,
    );
  }

  const users = await User.find({
    workspaceId,
    "settings.feedbackAlerts": true,
  })
    .select("_id")
    .lean();

  if (!users.length) {
    return [];
  }

  const feedbackPreview =
    String(feedback.content || "")
      .trim()
      .slice(0, 100);

  const notifications = users.map((user) => ({
    workspaceId,
    userId: user._id,
    type: "FEEDBACK_CREATED",
    title: "New customer feedback",
    message: feedbackPreview
      ? `New feedback received: "${feedbackPreview}"`
      : "New customer feedback was received.",
    entityId: feedback._id,
    read: false,
  }));

  return Notification.insertMany(
    notifications,
  );
};


/* =========================================================
   GET USER NOTIFICATIONS
========================================================= */

export const getNotificationsService = async (
  userId,
) => {
  if (!userId) {
    throw createError(
      "User ID is required",
      400,
    );
  }

  const notifications =
    await Notification.find({
      userId,
    })
      .sort({
        createdAt: -1,
      })
      .limit(30)
      .lean();

  const unreadCount =
    await Notification.countDocuments({
      userId,
      read: false,
    });

  return {
    notifications,
    unreadCount,
  };
};


/* =========================================================
   MARK ONE AS READ
========================================================= */

export const markNotificationReadService =
  async (userId, notificationId) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        notificationId,
      )
    ) {
      throw createError(
        "Invalid notification ID",
        400,
      );
    }

    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: notificationId,
          userId,
        },
        {
          $set: {
            read: true,
          },
        },
        {
          returnDocument: "after",
        },
      );

    if (!notification) {
      throw createError(
        "Notification not found",
        404,
      );
    }

    return notification;
  };


/* =========================================================
   MARK ALL AS READ
========================================================= */

export const markAllNotificationsReadService =
  async (userId) => {
    await Notification.updateMany(
      {
        userId,
        read: false,
      },
      {
        $set: {
          read: true,
        },
      },
    );

    return true;
  };
