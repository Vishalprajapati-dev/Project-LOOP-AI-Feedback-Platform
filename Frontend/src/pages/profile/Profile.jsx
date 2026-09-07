import { useEffect, useState } from "react";
import "./Profile.css";
import useAuth from "../../hooks/useAuth";
import { apiRequest } from "../../lib/api";

const EMPTY_PROFILE = {
    name: "",
    email: "",
    role: "",
    phone: "",
    location: "",
};

function Profile() {
    const { user, refreshUser } = useAuth();

    const [profile, setProfile] = useState(EMPTY_PROFILE);
    const [savedProfile, setSavedProfile] = useState(EMPTY_PROFILE);

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    /*
     * Sync profile with authenticated user.
     */
    useEffect(() => {
        if (!user) {
            return;
        }

        const nextProfile = {
            name: user.name || "",
            email: user.email || "",
            role: user.role || "",
            phone: user.phone || "",
            location: user.location || "",
        };

        setProfile(nextProfile);
        setSavedProfile(nextProfile);
    }, [user]);

    /*
     * Clear success message automatically.
     */
    useEffect(() => {
        if (!showSuccess) {
            return;
        }

        const timer = setTimeout(() => {
            setShowSuccess(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [showSuccess]);

    /*
     * Handle editable fields.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrorMessage("");
        setShowSuccess(false);
    };

    /*
     * Enter edit mode.
     */
    const handleEdit = () => {
        setSavedProfile(profile);
        setIsEditing(true);
        setShowSuccess(false);
        setErrorMessage("");
    };

    /*
     * Cancel editing and restore saved data.
     */
    const handleCancel = () => {
        setProfile(savedProfile);
        setIsEditing(false);
        setShowSuccess(false);
        setErrorMessage("");
    };

    /*
     * Save profile to backend.
     */
    const handleSave = async () => {
        if (isSaving) {
            return;
        }

        const trimmedName = profile.name.trim();
        const trimmedPhone = profile.phone.trim();
        const trimmedLocation = profile.location.trim();

        if (!trimmedName) {
            setErrorMessage("Full name cannot be empty.");
            return;
        }

        try {
            setIsSaving(true);
            setErrorMessage("");
            setShowSuccess(false);

            const response = await apiRequest(
                "/users/me",
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        name: trimmedName,
                        phone: trimmedPhone,
                        location: trimmedLocation,
                    }),
                }
            );

            if (!response?.user) {
                throw new Error(
                    "Profile was updated but user data was not returned."
                );
            }

            /*
             * Update local profile immediately.
             */
            const nextProfile = {
                name: response.user.name || "",
                email: response.user.email || "",
                role: response.user.role || "",
                phone: response.user.phone || "",
                location: response.user.location || "",
            };

            setProfile(nextProfile);
            setSavedProfile(nextProfile);

            /*
             * Refresh global authenticated user.
             *
             * This keeps the sidebar/header/dashboard
             * synchronized with the updated profile.
             */
            try {
                await refreshUser();
            } catch (refreshError) {
                console.error(
                    "Profile saved but user refresh failed:",
                    refreshError
                );
            }

            setIsEditing(false);
            setShowSuccess(true);
        } catch (error) {
            console.error(
                "Failed to update profile:",
                error
            );

            setErrorMessage(
                error?.message ||
                "Unable to update your profile. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    /*
     * Generate user initials.
     */
    const initials =
        profile.name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U";

    return (
        <div className="profile-page">

            {/* Header */}
            <div className="profile-header">

                <div>
                    <h1>Profile</h1>

                    <p>
                        Manage your personal information and account details.
                    </p>
                </div>

                {!isEditing && (
                    <button
                        type="button"
                        className="profile-edit-btn"
                        onClick={handleEdit}
                    >
                        ✎ Edit Profile
                    </button>
                )}

            </div>

            {/* Success Message */}
            {showSuccess && (
                <div
                    className="profile-success"
                    role="status"
                    aria-live="polite"
                >
                    <span>✓</span>
                    Profile updated successfully.
                </div>
            )}

            {/* Error Message */}
            {errorMessage && (
                <div
                    className="profile-error"
                    role="alert"
                    aria-live="assertive"
                >
                    <span>!</span>
                    {errorMessage}
                </div>
            )}

            {/* Profile Overview */}
            <div className="profile-overview">

                <div className="profile-avatar">
                    {initials}
                </div>

                <div className="profile-overview-info">

                    <h2>
                        {profile.name || "User"}
                    </h2>

                    <p>
                        {profile.role || "USER"}
                    </p>

                    <span>
                        {profile.email}
                    </span>

                </div>

                <div className="profile-status">
                    <span className="status-dot-profile"></span>
                    Active
                </div>

            </div>

            {/* Personal Information */}
            <div className="profile-card">

                <div className="profile-card-header">

                    <div>
                        <h2>Personal Information</h2>

                        <p>
                            Update your personal details and contact information.
                        </p>
                    </div>

                </div>

                <div className="profile-form">

                    {/* Full Name */}
                    <div className="profile-field">

                        <label htmlFor="profile-name">
                            Full Name
                        </label>

                        {isEditing ? (
                            <input
                                id="profile-name"
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                autoComplete="name"
                                maxLength={100}
                                disabled={isSaving}
                            />
                        ) : (
                            <div className="profile-value">
                                {profile.name || "—"}
                            </div>
                        )}

                    </div>

                    {/* Email */}
                    <div className="profile-field">

                        <div className="profile-field-label">
                            Email Address
                        </div>

                        <div className="profile-value">
                            {profile.email || "—"}
                        </div>

                    </div>

                    {/* Role */}
                    <div className="profile-field">

                        <div className="profile-field-label">
                            Role
                        </div>

                        <div className="profile-value">
                            {profile.role || "—"}
                        </div>

                    </div>

                    {/* Phone */}
                    <div className="profile-field">

                        <label htmlFor="profile-phone">
                            Phone Number
                        </label>

                        {isEditing ? (
                            <input
                                id="profile-phone"
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                autoComplete="tel"
                                maxLength={30}
                                disabled={isSaving}
                            />
                        ) : (
                            <div className="profile-value">
                                {profile.phone || "—"}
                            </div>
                        )}

                    </div>

                    {/* Location */}
                    <div className="profile-field">

                        <label htmlFor="profile-location">
                            Location
                        </label>

                        {isEditing ? (
                            <input
                                id="profile-location"
                                type="text"
                                name="location"
                                value={profile.location}
                                onChange={handleChange}
                                placeholder="Enter your location"
                                autoComplete="address-level2"
                                maxLength={100}
                                disabled={isSaving}
                            />
                        ) : (
                            <div className="profile-value">
                                {profile.location || "—"}
                            </div>
                        )}

                    </div>

                </div>

                {/* Actions */}
                {isEditing && (
                    <div className="profile-actions">

                        <button
                            type="button"
                            className="profile-cancel-btn"
                            onClick={handleCancel}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="profile-save-btn"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving
                                ? "Saving..."
                                : "✓ Save Changes"}
                        </button>

                    </div>
                )}

            </div>

        </div>
    );
}

export default Profile;