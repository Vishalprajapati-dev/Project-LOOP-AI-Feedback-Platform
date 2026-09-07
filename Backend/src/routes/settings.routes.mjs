import express from "express";

import {
    getSettings,
    updateSettings,
} from "../controllers/settings.controller.mjs";

import {
    protect,
} from "../middleware/auth.middleware.mjs";

const router = express.Router();

/* =========================
   USER SETTINGS
========================= */

router.get(
    "/",
    protect,
    getSettings
);

router.patch(
    "/",
    protect,
    updateSettings
);

export default router;