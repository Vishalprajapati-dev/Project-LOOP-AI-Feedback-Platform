import {
    getCurrentUserService,
    updateCurrentUserService,
} from "../services/user.service.mjs";


/* =========================
   GET CURRENT USER
   GET /api/users/me
========================= */

export const getCurrentUser = async (
    req,
    res
) => {
    try {
        const user =
            await getCurrentUserService(
                req.user._id
            );

        return res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                workspaceId: user.workspaceId,
                phone: user.phone,
                location: user.location,
            },
        });
    } catch (error) {
        return res.status(
            error.statusCode || 500
        ).json({
            message:
                error.message ||
                "Unable to fetch user",
        });
    }
};


/* =========================
   UPDATE CURRENT USER
   PATCH /api/users/me
========================= */

export const updateCurrentUser = async (
    req,
    res
) => {
    try {
        const user =
            await updateCurrentUserService(
                req.user._id,
                req.body
            );

        return res.status(200).json({
            message:
                "Profile updated successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                workspaceId: user.workspaceId,
                phone: user.phone,
                location: user.location,
            },
        });
    } catch (error) {
        return res.status(
            error.statusCode || 500
        ).json({
            message:
                error.message ||
                "Unable to update profile",
        });
    }
};