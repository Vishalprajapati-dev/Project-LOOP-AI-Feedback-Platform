import express from "express";

import {
    getDashboardOverview,
} from "../controllers/dashboard.controller.mjs";

import {
    protect,
} from "../middleware/auth.middleware.mjs";

const router = express.Router();

router.get(
    "/overview",
    protect,
    getDashboardOverview
);

export default router;