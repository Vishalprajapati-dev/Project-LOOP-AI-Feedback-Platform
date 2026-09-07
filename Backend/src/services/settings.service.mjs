import User from "../models/user.model.mjs";
import createError from "../utils/createError.mjs";

const DEFAULT_SETTINGS = {
    emailNotifications: true,
    feedbackAlerts: true,
    reportNotifications: false,
    theme: "light",
    compactMode: false,
};

const normalizeSettings = (settings = {}) => ({
    emailNotifications:
        settings.emailNotifications ??
        DEFAULT_SETTINGS.emailNotifications,

    feedbackAlerts:
        settings.feedbackAlerts ??
        DEFAULT_SETTINGS.feedbackAlerts,

    reportNotifications:
        settings.reportNotifications ??
        DEFAULT_SETTINGS.reportNotifications,

    theme:
        settings.theme ??
        DEFAULT_SETTINGS.theme,

    compactMode:
        settings.compactMode ??
        DEFAULT_SETTINGS.compactMode,
});

/* =========================
   GET SETTINGS
========================= */

export const getSettingsService = async (userId) => {
    const user = await User.findById(userId).select("settings");

    if (!user) {
        throw createError(
            "User account not found",
            404
        );
    }

    return normalizeSettings(user.settings);
};

/* =========================
   UPDATE SETTINGS
========================= */

export const updateSettingsService = async (
    userId,
    data
) => {
    const updates = {};

    if (data.emailNotifications !== undefined) {
        if (typeof data.emailNotifications !== "boolean") {
            throw createError(
                "emailNotifications must be a boolean",
                400
            );
        }

        updates["settings.emailNotifications"] =
            data.emailNotifications;
    }

    if (data.feedbackAlerts !== undefined) {
        if (typeof data.feedbackAlerts !== "boolean") {
            throw createError(
                "feedbackAlerts must be a boolean",
                400
            );
        }

        updates["settings.feedbackAlerts"] =
            data.feedbackAlerts;
    }

    if (data.reportNotifications !== undefined) {
        if (typeof data.reportNotifications !== "boolean") {
            throw createError(
                "reportNotifications must be a boolean",
                400
            );
        }

        updates["settings.reportNotifications"] =
            data.reportNotifications;
    }

    if (data.theme !== undefined) {
        if (
            !["light", "dark", "system"].includes(
                data.theme
            )
        ) {
            throw createError(
                "Invalid theme",
                400
            );
        }

        updates["settings.theme"] = data.theme;
    }

    if (data.compactMode !== undefined) {
        if (typeof data.compactMode !== "boolean") {
            throw createError(
                "compactMode must be a boolean",
                400
            );
        }

        updates["settings.compactMode"] =
            data.compactMode;
    }

    if (Object.keys(updates).length === 0) {
        throw createError(
            "No valid settings provided",
            400
        );
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: updates,
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    ).select("settings");

    if (!user) {
        throw createError(
            "User account not found",
            404
        );
    }

    return normalizeSettings(user.settings);
};
