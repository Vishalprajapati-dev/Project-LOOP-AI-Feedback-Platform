import {
    getSettingsService,
    updateSettingsService,
} from "../services/settings.service.mjs";

/* =========================
   GET SETTINGS
   GET /api/settings
========================= */

export const getSettings = async (
    req,
    res
) => {
    try {
        const settings =
            await getSettingsService(
                req.user._id
            );

        return res.status(200).json({
            settings,
        });
    } catch (error) {
        return res.status(
            error.statusCode || 500
        ).json({
            message:
                error.message ||
                "Unable to fetch settings",
        });
    }
};

/* =========================
   UPDATE SETTINGS
   PATCH /api/settings
========================= */

export const updateSettings = async (
    req,
    res
) => {
    try {
        const settings =
            await updateSettingsService(
                req.user._id,
                req.body
            );

        return res.status(200).json({
            message:
                "Settings updated successfully",

            settings,
        });
    } catch (error) {
        return res.status(
            error.statusCode || 500
        ).json({
            message:
                error.message ||
                "Unable to update settings",
        });
    }
};