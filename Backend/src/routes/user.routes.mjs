import express from "express";

import {
    getCurrentUser,
    updateCurrentUser,
} from "../controllers/user.controller.mjs";

import {
    protect,
} from "../middleware/auth.middleware.mjs";

const router = express.Router();


/* =========================
   CURRENT USER
========================= */

router.get(
    "/me",
    protect,
    getCurrentUser
);

router.patch(
    "/me",
    protect,
    updateCurrentUser
);


export default router;