import express from "express";

import {
    getAnalyticsOverview,
} from "../controllers/analytics.controller.mjs";

import {
    protect,
} from "../middleware/auth.middleware.mjs";

const router = express.Router();

router.get(
    "/overview",
    protect,
    getAnalyticsOverview
);

export default router;