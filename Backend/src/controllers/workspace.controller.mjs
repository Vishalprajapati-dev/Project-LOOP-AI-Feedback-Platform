import mongoose from "mongoose";

import {
  getWorkspaceMembersService,
  createWorkspaceMemberService,
  updateWorkspaceMemberService,
  deleteWorkspaceMemberService,
} from "../services/workspace.service.mjs";

const handleError = (res, error) => {
  console.error("Workspace controller error:", error);

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Workspace operation failed",
  });
};

export const getWorkspaceMembers = async (req, res) => {
  try {
    const members = await getWorkspaceMembersService(req.user.workspaceId);

    return res.status(200).json({
      success: true,
      members,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const createWorkspaceMember = async (req, res) => {
  try {
    const member = await createWorkspaceMemberService(
      req.user.workspaceId,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "Workspace member created successfully",
      member,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateWorkspaceMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    const member = await updateWorkspaceMemberService(
      req.user.workspaceId,
      id,
      req.body,
      req.user._id,
    );

    return res.status(200).json({
      success: true,
      message: "Workspace member updated successfully",
      member,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteWorkspaceMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    const result = await deleteWorkspaceMemberService(
      req.user.workspaceId,
      id,
      req.user._id,
    );

    return res.status(200).json({
      success: true,
      message: "Workspace member removed successfully",
      ...result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
