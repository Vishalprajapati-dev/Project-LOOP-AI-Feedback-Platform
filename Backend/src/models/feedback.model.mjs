import mongoose from "mongoose";

const feedbackStatuses = ["NEW", "REVIEWED", "ACTIONED"];
const sentimentTypes = ["POS", "NEU", "NEG"];
const priorityTypes = ["LOW", "MEDIUM", "HIGH"];

const feedbackSchema = new mongoose.Schema(
    {
        // =====================================================
        // TENANT
        // =====================================================
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            index: true,
        },

        // =====================================================
        // ORIGINAL FEEDBACK
        // =====================================================
        content: {
            type: String,
            required: true,
            trim: true,
        },

        channel: {
            type: String,
            required: true,
            trim: true,
        },

        sourceRef: {
            type: String,
            trim: true,
        },

        customerLabel: {
            type: String,
            trim: true,
        },

        // =====================================================
        // AI / SENTIMENT
        // =====================================================
        sentiment: {
            type: String,
            enum: sentimentTypes,
            default: "NEU",
        },

        sentimentScore: {
            type: Number,
            min: -1,
            max: 1,
            default: 0,
        },

        aiConfidence: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },

        aiSummary: {
            type: String,
            default: "",
            trim: true,
        },

        aiTheme: {
            type: String,
            default: "",
            trim: true,
        },

        aiPriority: {
            type: String,
            enum: priorityTypes,
            default: "MEDIUM",
        },

        aiRecommendation: {
            type: String,
            default: "",
            trim: true,
        },

        // =====================================================
        // THEMES
        // =====================================================
        themes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Theme",
            },
        ],

        // =====================================================
        // WORKFLOW
        // =====================================================
        status: {
            type: String,
            enum: feedbackStatuses,
            default: "NEW",
        },
    },
    {
        timestamps: true,
    }
);

// =====================================================
// INDEXES
// =====================================================

feedbackSchema.index({
    workspaceId: 1,
    status: 1,
});

feedbackSchema.index({
    workspaceId: 1,
    channel: 1,
});

feedbackSchema.index({
    workspaceId: 1,
    sentiment: 1,
});

feedbackSchema.index({
    workspaceId: 1,
    aiPriority: 1,
});

feedbackSchema.index({
    workspaceId: 1,
    createdAt: -1,
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;