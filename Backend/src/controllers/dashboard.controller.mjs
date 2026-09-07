import Feedback from "../models/feedback.model.mjs";

export const getDashboardOverview = async (req, res) => {
  try {
    const workspaceId = req.user.workspaceId;

    const feedback = await Feedback.find({ workspaceId })
      .sort({ createdAt: -1 })
      .lean();

    const totalFeedback = feedback.length;

    // Feedback waiting for human/AI review
    const pendingReview = feedback.filter(
      (item) => item.status === "NEW"
    ).length;

    // Feedback that has been actioned
    const actioned = feedback.filter(
      (item) => item.status === "ACTIONED"
    ).length;

    // Feedback successfully analyzed by AI
    const analyzedFeedback = feedback.filter(
      (item) =>
        typeof item.aiConfidence === "number" &&
        item.aiConfidence > 0
    );

    const aiAnalyzed = analyzedFeedback.length;

    const aiConfidence =
      aiAnalyzed > 0
        ? Math.round(
            analyzedFeedback.reduce(
              (sum, item) => sum + item.aiConfidence,
              0
            ) / aiAnalyzed
          )
        : 0;

    // High-priority feedback
    const highPriority = feedback.filter(
      (item) => item.aiPriority === "HIGH"
    ).length;

    // Current Feedback status distribution
    const statusDistribution = {
      new: feedback.filter(
        (item) => item.status === "NEW"
      ).length,

      reviewed: feedback.filter(
        (item) => item.status === "REVIEWED"
      ).length,

      actioned: feedback.filter(
        (item) => item.status === "ACTIONED"
      ).length,
    };

    // Latest five feedback items for Dashboard
    const recentFeedback = feedback.slice(0, 5).map((item) => ({
      id: item._id,

      customerLabel:
        item.customerLabel || "Anonymous Customer",

      content: item.content,

      channel: item.channel,

      status: item.status,

      sentiment: item.sentiment,

      sentimentScore: item.sentimentScore,

      aiConfidence: item.aiConfidence,

      aiSummary: item.aiSummary,

      aiTheme: item.aiTheme,

      aiPriority: item.aiPriority,

      aiRecommendation: item.aiRecommendation,

      createdAt: item.createdAt,
    }));

    return res.status(200).json({
      success: true,

      data: {
        stats: {
          totalFeedback,
          pendingReview,
          actioned,
          aiAnalyzed,
          aiConfidence,
          highPriority,
        },

        statusDistribution,

        recentFeedback,
      },
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard overview",
    });
  }
};