import express from "express";

import {
    createFeedback,
    getFeedbacks,
    getFeedbackById,
    updateFeedback,
    deleteFeedback,
    analyzeFeedback,
    generateReport,
    getReports,
} from "../controllers/feedback.controller.mjs";

import { protect, restrictTo } from "../middleware/auth.middleware.mjs";

const router = express.Router();

router.use(protect);

// ============================================================
// GENERATE REPORT
// ============================================================

router.post(
    "/reports",
    generateReport
);

router.get(
    "/reports",
    getReports
);

// CREATE
router.post("/", restrictTo("ADMIN", "ANALYST"), createFeedback);

// READ
router.get("/", getFeedbacks);
router.get("/:id", getFeedbackById);

// AI ANALYSIS
router.post("/:id/analyze", restrictTo("ADMIN", "ANALYST"), analyzeFeedback);

// UPDATE
router.put("/:id", restrictTo("ADMIN", "ANALYST"), updateFeedback);

// DELETE
router.delete("/:id", restrictTo("ADMIN", "ANALYST"), deleteFeedback);

export default router;