import { useState } from "react";
import "./Profile.css";

const defaultProfile = {
  name: "Vishal Prajapati",
  email: "vishal@example.com",
  role: "Frontend / MERN Developer",
  phone: "+91 00000 00000",
  location: "India",
};

const getStoredProfile = () => {
  try {
    const storedProfile = localStorage.getItem("projectLoopProfile");

    return storedProfile
      ? JSON.parse(storedProfile)
      : defaultProfile;
  } catch (error) {
    console.error("Failed to load profile:", error);
    return defaultProfile;
  }
};

function Profile() {
  const [profile, setProfile] = useState(getStoredProfile);
  const [savedProfile, setSavedProfile] = useState(getStoredProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setSavedProfile(profile);
    setIsEditing(true);
    setShowSuccess(false);
  };

  const handleCancel = () => {
    setProfile(savedProfile);
    setIsEditing(false);
    setShowSuccess(false);
  };

  const handleSave = () => {
    localStorage.setItem(
      "projectLoopProfile",
      JSON.stringify(profile)
    );

    setSavedProfile(profile);
    setIsEditing(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

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
            className="profile-edit-btn"
            onClick={handleEdit}
          >
            ✎ Edit Profile
          </button>
        )}

      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="profile-success">
          <span>✓</span>
          Profile updated successfully.
        </div>
      )}

      {/* Profile Overview */}
      <div className="profile-overview">

        <div className="profile-avatar">
          {profile.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>

        <div className="profile-overview-info">

          <h2>{profile.name}</h2>

          <p>{profile.role}</p>

          <span>{profile.email}</span>

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

            <label>Full Name</label>

            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            ) : (
              <div className="profile-value">
                {profile.name}
              </div>
            )}

          </div>

          {/* Email */}
          <div className="profile-field">

            <label>Email Address</label>

            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            ) : (
              <div className="profile-value">
                {profile.email}
              </div>
            )}

          </div>

          {/* Role */}
          <div className="profile-field">

            <label>Role</label>

            {isEditing ? (
              <input
                type="text"
                name="role"
                value={profile.role}
                onChange={handleChange}
                placeholder="Enter your role"
              />
            ) : (
              <div className="profile-value">
                {profile.role}
              </div>
            )}

          </div>

          {/* Phone */}
          <div className="profile-field">

            <label>Phone Number</label>

            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            ) : (
              <div className="profile-value">
                {profile.phone}
              </div>
            )}

          </div>

          {/* Location */}
          <div className="profile-field">

            <label>Location</label>

            {isEditing ? (
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                placeholder="Enter your location"
              />
            ) : (
              <div className="profile-value">
                {profile.location}
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
            >
              Cancel
            </button>

            <button
              type="button"
              className="profile-save-btn"
              onClick={handleSave}
            >
              ✓ Save Changes
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

export default Profile;