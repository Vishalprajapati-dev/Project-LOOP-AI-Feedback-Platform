import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "FEEDBACK_CREATED",
        "REPORT_GENERATED",
        "SYSTEM",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({
  userId: 1,
  read: 1,
  createdAt: -1,
});

notificationSchema.index({
  workspaceId: 1,
  createdAt: -1,
});

const Notification = mongoose.model(
  "Notification",
  notificationSchema,
);

export default Notification;