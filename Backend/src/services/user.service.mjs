import User from "../models/user.model.mjs";
import createError from "../utils/createError.mjs";


/* =========================
   GET CURRENT USER
========================= */

export const getCurrentUserService = async (userId) => {
    const user = await User.findById(userId).select(
        "_id name email role workspaceId phone location"
    );

    if (!user) {
        throw createError(
            "User account not found",
            404
        );
    }

    return user;
};


/* =========================
   UPDATE CURRENT USER
========================= */

export const updateCurrentUserService = async (
    userId,
    data
) => {
    const allowedFields = [
        "name",
        "phone",
        "location",
    ];

    const updates = {};

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            updates[field] = data[field];
        }
    }

    if (Object.keys(updates).length === 0) {
    throw createError(
        "No valid profile fields provided",
        400
    );
}

    if (updates.name !== undefined) {
        updates.name = updates.name.trim();

        if (!updates.name) {
            throw createError(
                "Name cannot be empty",
                400
            );
        }
    }

    if (updates.phone !== undefined) {
        updates.phone = updates.phone.trim();
    }

    if (updates.location !== undefined) {
        updates.location =
            updates.location.trim();
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
    ).select(
        "_id name email role workspaceId phone location"
    );

    if (!user) {
        throw createError(
            "User account not found",
            404
        );
    }

    return user;
};


