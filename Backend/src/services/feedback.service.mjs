import mongoose from "mongoose";
import Feedback from "../models/feedback.model.mjs";
import createError from "../utils/createError.mjs";
import { GoogleGenAI } from "@google/genai";
import Report from "../models/report.model.mjs";
import {
  createFeedbackAlertNotifications,
} from "./notification.service.mjs";


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =====================================================
// CREATE FEEDBACK
// =====================================================
export const createFeedbackService = async (workspaceId, data) => {
  if (!workspaceId) {
    throw createError("Workspace ID is required", 400);
  }

  if (!data.content || !data.content.trim()) {
    throw createError("Feedback content is required", 400);
  }

  if (!data.channel || !data.channel.trim()) {
    throw createError("Feedback channel is required", 400);
  }

    const feedback = await Feedback.create({
    workspaceId,
    content: data.content.trim(),
    channel: data.channel.trim(),
    sourceRef: data.sourceRef || undefined,
    customerLabel: data.customerLabel || undefined,
    sentiment: data.sentiment || "NEU",
    sentimentScore:
      data.sentimentScore !== undefined
        ? Number(data.sentimentScore)
        : undefined,
    status: data.status || "NEW",
    themes: Array.isArray(data.themes)
      ? data.themes
      : [],
  });

  /*
   * Notifications must never prevent
   * successful feedback creation.
   */
  try {
    await createFeedbackAlertNotifications(
      workspaceId,
      feedback,
    );
  } catch (notificationError) {
    console.error(
      "Feedback notification error:",
      notificationError,
    );
  }

  return feedback;
};


export const analyzeFeedbackService = async (workspaceId, feedbackId) => {
  if (!workspaceId) {
    throw createError("Workspace ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    throw createError("Invalid feedback ID", 400);
  }

  const feedback = await Feedback.findOne({
    _id: feedbackId,
    workspaceId,
  });

  if (!feedback) {
    throw createError("Feedback not found or access denied", 404);
  }

  if (!feedback.content || !feedback.content.trim()) {
    throw createError("Feedback content is required for analysis", 400);
  }

  try {
    const prompt = `
You are an AI customer-feedback analyst.

Analyze the following customer feedback:

"${feedback.content}"

Return ONLY valid JSON.

Use exactly this structure:

{
  "sentiment": "positive",
  "sentimentScore": 0.75,
  "confidence": 92,
  "summary": "Short professional summary",
  "theme": "Main topic",
  "priority": "high",
  "recommendation": "Clear business action recommendation"
}

Rules:

- sentiment must be: positive, negative, or neutral
- sentimentScore must be between -1 and 1
- confidence must be an integer between 0 and 100
- priority must be: low, medium, or high
- summary must be concise
- theme must describe the main issue/topic
- recommendation must be actionable
- Return JSON only.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const text = response.text?.trim();

    if (!text) {
      throw createError("AI returned an empty response", 500);
    }

    let analysis;

    try {
      analysis = JSON.parse(text);
    } catch (error) {
      console.error("AI JSON parse error:", error);
      console.error("AI response:", text);

      throw createError("AI returned invalid JSON", 500);
    }

    // =========================
    // VALIDATE AI RESPONSE
    // =========================

    if (!analysis || typeof analysis !== "object") {
      throw createError("AI returned an invalid analysis object", 500);
    }

    const validSentiments = ["positive", "negative", "neutral"];

    const validPriorities = ["low", "medium", "high"];

    const sentiment = String(analysis.sentiment || "")
      .trim()
      .toLowerCase();

    const priority = String(analysis.priority || "")
      .trim()
      .toLowerCase();

    const confidence = Number(analysis.confidence);

    const sentimentScore = Number(analysis.sentimentScore);

    if (!validSentiments.includes(sentiment)) {
      throw createError("AI returned an invalid sentiment", 500);
    }

    if (!validPriorities.includes(priority)) {
      throw createError("AI returned an invalid priority", 500);
    }

    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 100) {
      throw createError("AI returned an invalid confidence score", 500);
    }

    if (
      !Number.isFinite(sentimentScore) ||
      sentimentScore < -1 ||
      sentimentScore > 1
    ) {
      throw createError("AI returned an invalid sentiment score", 500);
    }

    if (!String(analysis.summary || "").trim()) {
      throw createError("AI returned an empty summary", 500);
    }

    if (!String(analysis.theme || "").trim()) {
      throw createError("AI returned an empty theme", 500);
    }

    if (!String(analysis.recommendation || "").trim()) {
      throw createError("AI returned an empty recommendation", 500);
    }

    // =========================
    // NORMALIZE SENTIMENT
    // =========================

    const sentimentMap = {
      positive: "POS",
      negative: "NEG",
      neutral: "NEU",
    };

    const normalizedSentiment =
      sentimentMap[
        String(analysis.sentiment || "neutral")
          .trim()
          .toLowerCase()
      ];

    if (!normalizedSentiment) {
      throw createError("AI returned an invalid sentiment", 500);
    }

    // =========================
    // NORMALIZE PRIORITY
    // =========================

    const priorityMap = {
      low: "LOW",
      medium: "MEDIUM",
      high: "HIGH",
    };

    const normalizedPriority =
      priorityMap[
        String(analysis.priority || "medium")
          .trim()
          .toLowerCase()
      ] || "MEDIUM";

    // =========================
    // SAVE AI RESULTS
    // =========================

    feedback.sentiment = normalizedSentiment;

    feedback.sentimentScore = Math.max(
      -1,
      Math.min(1, Number(analysis.sentimentScore) || 0),
    );

    feedback.aiConfidence = Math.max(
      0,
      Math.min(100, Number(analysis.confidence) || 0),
    );

    feedback.aiSummary = String(analysis.summary || "").trim();

    feedback.aiTheme = String(analysis.theme || "").trim();

    feedback.aiPriority = normalizedPriority;

    feedback.aiRecommendation = String(analysis.recommendation || "").trim();

    // Once analyzed, mark as reviewed
    if (feedback.status === "NEW") {
      feedback.status = "REVIEWED";
    }

    await feedback.save();

    return {
      feedback,
      analysis: {
        sentiment: normalizedSentiment,
        sentimentScore: feedback.sentimentScore,
        confidence: feedback.aiConfidence,
        summary: feedback.aiSummary,
        theme: feedback.aiTheme,
        priority: feedback.aiPriority,
        recommendation: feedback.aiRecommendation,
      },
    };
  } catch (error) {
    console.error("AI analysis error:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError(`AI analysis failed: ${error.message}`, 500);
  }
};

export const generateReportService = async (
  workspaceId,
  generatedBy,
  periodStart,
  periodEnd,
) => {
  const feedbacks = await Feedback.find({
    workspaceId,
    createdAt: {
      $gte: new Date(periodStart),
      $lte: new Date(periodEnd),
    },
  }).lean();

  if (!feedbacks.length) {
    throw createError("No feedback found for the selected period", 404);
  }

  const total = feedbacks.length;

  const sentiment = {
    positive: feedbacks.filter((f) => f.sentiment === "POS").length,
    neutral: feedbacks.filter((f) => f.sentiment === "NEU").length,
    negative: feedbacks.filter((f) => f.sentiment === "NEG").length,
  };

  const channels = {};

  for (const feedback of feedbacks) {
    const channel = feedback.channel || "UNKNOWN";

    channels[channel] = (channels[channel] || 0) + 1;
  }

  const quotes = feedbacks.slice(0, 5).map((feedback) => ({
    content: feedback.content,
    channel: feedback.channel,
    sentiment: feedback.sentiment,
  }));

  const contentJson = {
    totalFeedbacks: total,

    sentiment,

    channels,

    sentimentPercentages: {
      positive: Number(((sentiment.positive / total) * 100).toFixed(1)),
      neutral: Number(((sentiment.neutral / total) * 100).toFixed(1)),
      negative: Number(((sentiment.negative / total) * 100).toFixed(1)),
    },

    quotes,
  };

  const report = await Report.create({
    workspaceId,
    generatedBy,
    title: `Feedback Report - ${new Date(periodStart).toLocaleDateString()} to ${new Date(periodEnd).toLocaleDateString()}`,
    periodStart: new Date(periodStart),
    periodEnd: new Date(periodEnd),
    contentJson,
  });

  return report;
};

// =====================================================
// GET ALL FEEDBACK
// =====================================================
export const getFeedbacksService = async (workspaceId, query = {}) => {
  if (!workspaceId) {
    throw createError("Workspace ID is required", 400);
  }

  let { page = 1, limit = 10, status, channel, sentiment, search } = query;

  page = Math.max(parseInt(page) || 1, 1);
  limit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);

  // IMPORTANT:
  // Every query is scoped to the authenticated user's workspace.
  const filter = {
    workspaceId,
  };

  if (status) {
    filter.status = status;
  }

  if (channel) {
    filter.channel = channel;
  }

  if (sentiment) {
    filter.sentiment = sentiment;
  }

  if (search && search.trim()) {
    filter.content = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  const skip = (page - 1) * limit;

  const [feedbacks, total] = await Promise.all([
    Feedback.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Feedback.countDocuments(filter),
  ]);

  return {
    feedbacks,

    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

// =====================================================
// GET SINGLE FEEDBACK
// =====================================================
export const getFeedbackByIdService = async (workspaceId, feedbackId) => {
  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    throw createError("Invalid feedback ID", 400);
  }

  const feedback = await Feedback.findOne({
    _id: feedbackId,

    // IMPORTANT:
    // Prevent users from accessing another workspace's feedback.
    workspaceId,
  });

  if (!feedback) {
    throw createError("Feedback not found or access denied", 404);
  }

  return feedback;
};

// =====================================================
// UPDATE FEEDBACK
// =====================================================
export const updateFeedbackService = async (
  workspaceId,
  feedbackId,
  updateData,
) => {
  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    throw createError("Invalid feedback ID", 400);
  }

  // Never allow client to change workspace ownership.
  const allowedFields = [
    "content",
    "channel",
    "sourceRef",
    "customerLabel",
    "status",
    "themes",
  ];

  const safeUpdate = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      safeUpdate[field] = updateData[field];
    }
  }

  if (safeUpdate.content !== undefined) {
    if (!safeUpdate.content.trim()) {
      throw createError("Feedback content cannot be empty", 400);
    }

    safeUpdate.content = safeUpdate.content.trim();
  }

  const feedback = await Feedback.findOneAndUpdate(
    {
      _id: feedbackId,

      // IMPORTANT:
      // Tenant isolation.
      workspaceId,
    },
    safeUpdate,
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!feedback) {
    throw createError("Feedback not found or access denied", 404);
  }

  return feedback;
};

// =====================================================
// DELETE FEEDBACK
// =====================================================
export const deleteFeedbackService = async (workspaceId, feedbackId) => {
  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    throw createError("Invalid feedback ID", 400);
  }

  const feedback = await Feedback.findOneAndDelete({
    _id: feedbackId,

    // IMPORTANT:
    // User can delete only feedback belonging
    // to their own workspace.
    workspaceId,
  });

  if (!feedback) {
    throw createError("Feedback not found or access denied", 404);
  }

  return feedback;
};

// ============================================================
// GET REPORTS
// ============================================================

export const getReportsService = async (workspaceId) => {
  const reports = await Report.find({ workspaceId })
    .sort({ periodStart: -1, createdAt: -1 })
    .lean();

  return reports;
};

