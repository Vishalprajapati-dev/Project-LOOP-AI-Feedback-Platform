import bcrypt from "bcrypt";
import User from "../models/user.model.mjs";
import createError from "../utils/createError.mjs";

const ALLOWED_ROLES = ["ADMIN", "ANALYST", "VIEWER"];

const normalizeEmail = (email) =>
  email.trim().toLowerCase();

/**
 * Get all members belonging to the authenticated workspace.
 *
 * Workspace isolation is enforced through workspaceId.
 */
export const getWorkspaceMembersService = async (
  workspaceId
) => {
  return User.find({ workspaceId })
    .select(
      "_id name email role workspaceId phone location createdAt updatedAt"
    )
    .sort({ createdAt: 1 })
    .lean();
};

/**
 * Create a new member inside the authenticated workspace.
 *
 * Only the route layer allows ADMIN users to reach this service.
 */
export const createWorkspaceMemberService = async (
  workspaceId,
  { name, email, password, role }
) => {
  if (!name || !email || !password || !role) {
    throw createError(
      "Name, email, password, and role are required",
      400
    );
  }

  const cleanName = name.trim();
  const cleanEmail = normalizeEmail(email);

  if (!cleanName) {
    throw createError("Name is required", 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw createError(
      "Please provide a valid email address",
      400
    );
  }

  if (password.length < 8) {
    throw createError(
      "Password must be at least 8 characters",
      400
    );
  }

  if (!ALLOWED_ROLES.includes(role)) {
    throw createError(
      "Invalid role. Allowed roles: ADMIN, ANALYST, VIEWER",
      400
    );
  }

  const existingUser = await User.findOne({
    email: cleanEmail,
  });

  if (existingUser) {
    throw createError(
      "User with this email already exists",
      400
    );
  }

  const passwordHash = await bcrypt.hash(
    password,
    12
  );

  const user = await User.create({
    workspaceId,
    name: cleanName,
    email: cleanEmail,
    passwordHash,
    role,
  });

  return User.findById(user._id)
    .select(
      "_id name email role workspaceId phone location createdAt updatedAt"
    )
    .lean();
};

/**
 * Update a workspace member.
 *
 * Important SaaS rules:
 * - A user cannot remove their own ADMIN protection by changing
 *   their own role away from ADMIN.
 * - The last ADMIN in a workspace cannot be demoted.
 */
export const updateWorkspaceMemberService = async (
  workspaceId,
  memberId,
  { name, role, phone, location },
  currentUserId
) => {
  const member = await User.findOne({
    _id: memberId,
    workspaceId,
  });

  if (!member) {
    throw createError(
      "Workspace member not found",
      404
    );
  }

  if (name !== undefined) {
    const cleanName = name.trim();

    if (!cleanName) {
      throw createError(
        "Name cannot be empty",
        400
      );
    }

    member.name = cleanName;
  }

  if (role !== undefined) {
    if (!ALLOWED_ROLES.includes(role)) {
      throw createError(
        "Invalid role. Allowed roles: ADMIN, ANALYST, VIEWER",
        400
      );
    }

    const isChangingOwnRole =
      String(member._id) === String(currentUserId);

    const isDemotingAdmin =
      member.role === "ADMIN" &&
      role !== "ADMIN";

    if (isChangingOwnRole && isDemotingAdmin) {
      throw createError(
        "You cannot remove your own ADMIN role",
        400
      );
    }

    if (isDemotingAdmin) {
      const adminCount = await User.countDocuments({
        workspaceId,
        role: "ADMIN",
      });

      if (adminCount <= 1) {
        throw createError(
          "The workspace must have at least one ADMIN",
          400
        );
      }
    }

    member.role = role;
  }

  if (phone !== undefined) {
    member.phone = phone.trim();
  }

  if (location !== undefined) {
    member.location = location.trim();
  }

  await member.save();

  return User.findById(member._id)
    .select(
      "_id name email role workspaceId phone location createdAt updatedAt"
    )
    .lean();
};

/**
 * Delete a workspace member.
 *
 * SaaS protection rules:
 * - A user cannot remove themselves.
 * - The last ADMIN cannot be removed.
 * - Member lookup is always workspace-scoped.
 */
export const deleteWorkspaceMemberService = async (
  workspaceId,
  memberId,
  currentUserId
) => {
  if (String(memberId) === String(currentUserId)) {
    throw createError(
      "You cannot remove yourself from the workspace",
      400
    );
  }

  const member = await User.findOne({
    _id: memberId,
    workspaceId,
  });

  if (!member) {
    throw createError(
      "Workspace member not found",
      404
    );
  }

  if (member.role === "ADMIN") {
    const adminCount = await User.countDocuments({
      workspaceId,
      role: "ADMIN",
    });

    if (adminCount <= 1) {
      throw createError(
        "The workspace must have at least one ADMIN",
        400
      );
    }
  }

  await User.deleteOne({
    _id: memberId,
    workspaceId,
  });

  return {
    id: member._id,
  };
};