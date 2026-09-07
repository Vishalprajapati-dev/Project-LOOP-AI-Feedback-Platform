import {
  createFeedbackService,
  getFeedbacksService,
  getFeedbackByIdService,
  updateFeedbackService,
  deleteFeedbackService,
  analyzeFeedbackService,
  generateReportService,
  getReportsService,
} from "../services/feedback.service.mjs";

// =====================================================
// CREATE
// =====================================================
export const createFeedback = async (req, res) => {
  try {
    const workspaceId = req.user.workspaceId;

    const feedback = await createFeedbackService(workspaceId, req.body);

    return res.status(201).json({
      success: true,
      message: "Feedback created successfully",
      feedback,
    });
  } catch (error) {
    console.error("Create feedback error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create feedback",
    });
  }
};

export const analyzeFeedback = async (req, res) => {
    try {
        const workspaceId = req.user.workspaceId;
        const { id } = req.params;

        const result = await analyzeFeedbackService(
            workspaceId,
            id
        );

        return res.status(200).json({
            success: true,
            message: "Feedback analyzed successfully",
            feedback: result.feedback,
            analysis: result.analysis,
        });

    } catch (error) {
        console.error("Analyze feedback error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "AI analysis failed",
        });
    }
};

// ============================================================
// GENERATE REPORT
// ============================================================

export const generateReport = async (req, res) => {
  try {
    const workspaceId = req.user.workspaceId;
    const generatedBy = req.user.id;

    const { periodStart, periodEnd } = req.body;

    if (!periodStart || !periodEnd) {
      return res.status(400).json({
        success: false,
        message: "periodStart and periodEnd are required",
      });
    }

    const report = await generateReportService(
      workspaceId,
      generatedBy,
      periodStart,
      periodEnd,
    );

    return res.status(201).json({
      success: true,
      message: "Report generated successfully",
      report,
    });
  } catch (error) {
    console.error("Generate report error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to generate report",
    });
  }
};

// =====================================================
// GET ALL
// =====================================================
export const getFeedbacks = async (req, res) => {
  try {
    const workspaceId = req.user.workspaceId;

    const result = await getFeedbacksService(workspaceId, req.query);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Get feedbacks error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch feedback",
    });
  }
};

// =====================================================
// GET ONE
// =====================================================
export const getFeedbackById = async (req, res) => {
  try {
    const workspaceId = req.user.workspaceId;
    const { id } = req.params;

    const feedback = await getFeedbackByIdService(workspaceId, id);

    return res.status(200).json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Get feedback error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch feedback",
    });
  }
};

// =====================================================
// UPDATE
// =====================================================
export const updateFeedback = async (req, res) => {
  try {
    const workspaceId = req.user.workspaceId;
    const { id } = req.params;

    const feedback = await updateFeedbackService(workspaceId, id, req.body);

    return res.status(200).json({
      success: true,
      message: "Feedback updated successfully",
      feedback,
    });
  } catch (error) {
    console.error("Update feedback error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update feedback",
    });
  }
};

// =====================================================
// DELETE
// =====================================================
export const deleteFeedback = async (req, res) => {
  try {
    const workspaceId = req.user.workspaceId;
    const { id } = req.params;

    await deleteFeedbackService(workspaceId, id);

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Delete feedback error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete feedback",
    });
  }
};

// ============================================================
// GET REPORTS
// ============================================================

export const getReports = async (req, res) => {
  try {
    const workspaceId = req.user.workspaceId;

    const reports = await getReportsService(workspaceId);

    return res.status(200).json({
      success: true,
      message: "Reports fetched successfully",
      reports,
    });
  } catch (error) {
    console.error("Get reports error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch reports",
    });
  }
};
