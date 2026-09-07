import express from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
} from "../controllers/auth.controller.mjs";

import {
    getAccessToken,
} from "../controllers/token.controller.mjs";

import {
    protect,
} from "../middleware/auth.middleware.mjs";

const router = express.Router();


/* =========================
   PUBLIC AUTH
========================= */

router.post(
    "/register",
    registerUser
);

router.post(
    "/login",
    loginUser
);


/* =========================
   SESSION
========================= */

router.get(
    "/me",
    protect,
    getCurrentUser
);

router.post(
    "/refresh",
    getAccessToken
);

router.post(
    "/logout",
    logoutUser
);


export default router;