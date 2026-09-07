import express from "express";

import {
  getWorkspaceMembers,
  createWorkspaceMember,
  updateWorkspaceMember,
  deleteWorkspaceMember,
} from "../controllers/workspace.controller.mjs";

import {
  protect,
  restrictTo,
} from "../middleware/auth.middleware.mjs";

const router = express.Router();

router.use(protect);

// All authenticated workspace members can see their team.
router.get(
  "/members",
  getWorkspaceMembers
);

// Only workspace admins can manage members.
router.post(
  "/members",
  restrictTo("ADMIN"),
  createWorkspaceMember
);

router.patch(
  "/members/:id",
  restrictTo("ADMIN"),
  updateWorkspaceMember
);

router.delete(
  "/members/:id",
  restrictTo("ADMIN"),
  deleteWorkspaceMember
);

export default router;