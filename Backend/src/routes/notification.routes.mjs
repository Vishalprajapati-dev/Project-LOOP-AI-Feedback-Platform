import express from "express";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notification.controller.mjs";

import {
  protect,
} from "../middleware/auth.middleware.mjs";

const router = express.Router();

router.use(protect);


/* GET ALL USER NOTIFICATIONS */

router.get(
  "/",
  getNotifications,
);


/* MARK ALL READ */

router.patch(
  "/read-all",
  markAllNotificationsRead,
);


/* MARK ONE READ */

router.patch(
  "/:id/read",
  markNotificationRead,
);


export default router;