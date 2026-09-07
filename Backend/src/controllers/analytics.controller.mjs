import {
    getAnalyticsOverviewService,
} from "../services/analytics.service.mjs";

export const getAnalyticsOverview = async (
    req,
    res
) => {
    try {
        const range =
            req.query.range ||
            "Last 30 Days";

        const allowedRanges = [
            "Last 7 Days",
            "Last 30 Days",
            "Last 90 Days",
            "This Year",
        ];

        if (!allowedRanges.includes(range)) {
            return res.status(400).json({
                success: false,
                message: "Invalid analytics range",
            });
        }

        const data =
            await getAnalyticsOverviewService(
                req.user.workspaceId,
                range
            );

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error(
            "Analytics overview error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load analytics overview",
        });
    }
};