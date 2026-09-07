import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Users,
  Pencil,
  Trash2,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import "./Team.css";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";

import { workspaceApi } from "../../services/api";
import useAuth from "../../hooks/useAuth";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "VIEWER",
  phone: "",
  location: "",
};

function Team() {
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteMember, setDeleteMember] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await workspaceApi.members();

      setMembers(response.members || []);
    } catch (err) {
      console.error("Team members loading error:", err);
      setError(err.message || "Failed to load workspace members");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const memberCountLabel = useMemo(() => {
    return `${members.length} ${members.length === 1 ? "member" : "members"
      }`;
  }, [members.length]);

  const openCreateModal = () => {
    setEditingMember(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowMemberModal(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);

    setForm({
      name: member.name || "",
      email: member.email || "",
      password: "",
      role: member.role || "VIEWER",
      phone: member.phone || "",
      location: member.location || "",
    });

    setFormError("");
    setShowMemberModal(true);
  };

  const closeMemberModal = () => {
    if (saving) return;

    setShowMemberModal(false);
    setEditingMember(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const handleFormChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSaveMember = async () => {
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Name is required.");
      return;
    }

    if (!editingMember && !form.email.trim()) {
      setFormError("Email is required.");
      return;
    }

    if (!editingMember && !form.password) {
      setFormError("Password is required.");
      return;
    }

    if (!editingMember && form.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    try {
      setSaving(true);

      if (editingMember) {
        const response = await workspaceApi.updateMember(
          editingMember._id,
          {
            name: form.name.trim(),
            role: form.role,
            phone: form.phone.trim(),
            location: form.location.trim(),
          },
        );

        setMembers((current) =>
          current.map((member) =>
            member._id === editingMember._id
              ? response.member
              : member,
          ),
        );
      } else {
        const response = await workspaceApi.createMember({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          role: form.role,
        });

        setMembers((current) => [
          ...current,
          response.member,
        ]);
      }

      closeMemberModal();
    } catch (err) {
      console.error("Team member save error:", err);
      setFormError(
        err.message || "Failed to save workspace member",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteMember) return;

    try {
      setDeleting(true);
      setError("");

      await workspaceApi.deleteMember(deleteMember._id);

      setMembers((current) =>
        current.filter(
          (member) => member._id !== deleteMember._id,
        ),
      );

      setDeleteMember(null);
    } catch (err) {
      console.error("Team member deletion error:", err);
      setError(
        err.message || "Failed to remove workspace member",
      );
    } finally {
      setDeleting(false);
    }
  };

  const getInitials = (name = "") => {
    const initials = name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

    return initials.slice(0, 2) || "U";
  };

  const getRoleClass = (role) => {
    switch (role) {
      case "ADMIN":
        return "team-role team-role-admin";

      case "ANALYST":
        return "team-role team-role-analyst";

      case "VIEWER":
        return "team-role team-role-viewer";

      default:
        return "team-role";
    }
  };

  return (
    <div className="team-page">
      <div className="team-page-header">
        <div>
          <div className="team-title-row">
            <div className="team-title-icon">
              <Users size={22} />
            </div>

            <div>
              <h1>Team & Members</h1>
              <p>
                Manage the people who have access to your workspace.
              </p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            size="small"
            className="team-add-member-button"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Add Member
          </Button>
        )}
      </div>

      <div className="team-summary">
        <div className="team-summary-card">
          <div className="team-summary-icon">
            <Users size={20} />
          </div>

          <div>
            <span>Total Members</span>
            <strong>{members.length}</strong>
          </div>
        </div>

        <div className="team-summary-card">
          <div className="team-summary-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <span>Your Role</span>
            <strong>{user?.role || "—"}</strong>
          </div>
        </div>
      </div>

      {error && (
        <div className="team-error">
          <strong>Something went wrong.</strong>
          <span>{error}</span>

          <button
            type="button"
            onClick={loadMembers}
          >
            Retry
          </button>
        </div>
      )}

      <section className="team-card">
        <div className="team-card-header">
          <div>
            <h2>Workspace Members</h2>
            <p>{memberCountLabel}</p>
          </div>
        </div>

        {loading ? (
          <div className="team-loading">
            <Spinner />
            <span>Loading workspace members...</span>
          </div>
        ) : members.length === 0 ? (
          <div className="team-empty">
            <div className="team-empty-icon">
              <Users size={28} />
            </div>

            <h3>No workspace members yet</h3>

            <p>
              Add your first team member to start collaborating.
            </p>

            {isAdmin && (
              <Button
                variant="primary"
                onClick={openCreateModal}
              >
                <Plus size={18} />
                Add First Member
              </Button>
            )}
          </div>
        ) : (
          <div className="team-members">
            {members.map((member) => (
              <article
                className="team-member"
                key={member._id}
              >
                <div className="team-member-avatar">
                  {getInitials(member.name)}
                </div>

                <div className="team-member-main">
                  <div className="team-member-name-row">
                    <h3>{member.name}</h3>

                    <span className={getRoleClass(member.role)}>
                      {member.role}
                    </span>
                  </div>

                  <div className="team-member-details">
                    <span>
                      <Mail size={15} />
                      {member.email}
                    </span>

                    {member.phone && (
                      <span>
                        <Phone size={15} />
                        {member.phone}
                      </span>
                    )}

                    {member.location && (
                      <span>
                        <MapPin size={15} />
                        {member.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="team-member-actions">
                  <Button
                    variant="outline"
                    size="small"
                    className="team-edit-button"
                    onClick={() => openEditModal(member)}
                  >
                    <Pencil size={15} />
                    Edit
                  </Button>

                  {String(member._id) !== String(user?._id) && (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setDeleteMember(member)}
                    >
                      <Trash2 size={15} />
                      Remove
                    </Button>
                  )}
                </div>


              </article>
            ))}
          </div>
        )}
      </section>

      <Modal
        isOpen={showMemberModal}
        title={
          editingMember
            ? "Edit Team Member"
            : "Add Team Member"
        }
        onClose={closeMemberModal}
        onConfirm={handleSaveMember}
        confirmText={
          saving
            ? "Saving..."
            : editingMember
              ? "Save Changes"
              : "Add Member"
        }
        cancelText="Cancel"
      >
        <div className="team-form">
          {formError && (
            <div className="team-form-error">
              {formError}
            </div>
          )}

          <Input
            label="Full Name"
            placeholder="Enter member name"
            value={form.name}
            onChange={handleFormChange("name")}
            disabled={saving}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="member@company.com"
            value={form.email}
            onChange={handleFormChange("email")}
            disabled={saving || Boolean(editingMember)}
          />

          {!editingMember && (
            <Input
              label="Temporary Password"
              type="password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={handleFormChange("password")}
              disabled={saving}
            />
          )}

          <div className="team-form-field">
            <label htmlFor="team-role">
              Role
            </label>

            <select
              id="team-role"
              value={form.role}
              onChange={handleFormChange("role")}
              disabled={saving}
            >
              <option value="VIEWER">
                VIEWER — Read only
              </option>

              <option value="ANALYST">
                ANALYST — Feedback & AI
              </option>

              <option value="ADMIN">
                ADMIN — Full workspace access
              </option>
            </select>
          </div>

          <div className="team-form-grid">
            <Input
              label="Phone"
              placeholder="Optional"
              value={form.phone}
              onChange={handleFormChange("phone")}
              disabled={saving}
            />

            <Input
              label="Location"
              placeholder="Optional"
              value={form.location}
              onChange={handleFormChange("location")}
              disabled={saving}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(deleteMember)}
        title="Remove Team Member"
        onClose={() => {
          if (!deleting) {
            setDeleteMember(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        confirmText={
          deleting ? "Removing..." : "Remove"
        }
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to remove{" "}
          <strong>{deleteMember?.name}</strong> from
          this workspace?
        </p>

        <p className="team-delete-warning">
          This member will immediately lose access to
          the workspace.
        </p>
      </Modal>
    </div>
  );
}

export default Team;