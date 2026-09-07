import {
    registerUserService,
    loginUserService,
    logoutService,
} from "../services/auth.service.mjs";

import {
    accessCookieOpts,
    refreshCookieOpts,
} from "./token.controller.mjs";

/* =========================
   REGISTER
========================= */

export const registerUser = async (req, res) => {
    try {
        const {
            companyName,
            name,
            email,
            password,
        } = req.body;

        const {
            accessToken,
            refreshToken,
            user,
        } = await registerUserService(
            companyName,
            name,
            email,
            password
        );

        res.cookie(
            "accessToken",
            accessToken,
            accessCookieOpts
        );

        res.cookie(
            "refreshToken",
            refreshToken,
            refreshCookieOpts
        );

        return res.status(201).json({
            message:
                "Workspace and Admin account created successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                workspaceId: user.workspaceId,
            },
        });
    } catch (error) {
        return res.status(
            error.statusCode || 500
        ).json({
            message: error.message,
        });
    }
};


/* =========================
   LOGIN
========================= */

export const loginUser = async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body;

        const {
            accessToken,
            refreshToken,
            user,
        } = await loginUserService(
            email,
            password
        );

        res.cookie(
            "accessToken",
            accessToken,
            accessCookieOpts
        );

        res.cookie(
            "refreshToken",
            refreshToken,
            refreshCookieOpts
        );

        return res.status(200).json({
            message: "Logged in successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                workspaceId: user.workspaceId,
            },
        });
    } catch (error) {
        return res.status(
            error.statusCode || 500
        ).json({
            message: error.message,
        });
    }
};


/* =========================
   CURRENT USER
   GET /api/auth/me
========================= */

export const getCurrentUser = async (req, res) => {
    try {
        return res.status(200).json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                workspaceId: req.user.workspaceId,

                // Profile information
                phone: req.user.phone || "",
                location: req.user.location || "",
            },
        });
    } catch (error) {
        console.error(
            "Get current user error:",
            error
        );

        return res.status(500).json({
            message: "Unable to fetch current user",
        });
    }
};


/* =========================
   LOGOUT
========================= */

export const logoutUser = async (req, res) => {
    try {
        const refreshToken =
            req.cookies?.refreshToken;

        await logoutService(refreshToken);

        res.clearCookie(
            "accessToken",
            accessCookieOpts
        );

        res.clearCookie(
            "refreshToken",
            refreshCookieOpts
        );

        return res.status(200).json({
            message: "Logged out successfully",
        });
    } catch (error) {
        return res.status(
            error.statusCode || 500
        ).json({
            message: error.message,
        });
    }
};