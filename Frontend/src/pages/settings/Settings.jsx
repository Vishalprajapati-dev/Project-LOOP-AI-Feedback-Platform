import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

import useAuth from "../../hooks/useAuth";
import { apiRequest } from "../../lib/api";

const DEFAULT_SETTINGS = {
    emailNotifications: true,
    feedbackAlerts: true,
    reportNotifications: false,
    theme: "light",
    compactMode: false,
};

function Settings() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [settings, setSettings] = useState(
        DEFAULT_SETTINGS
    );

    const [loading, setLoading] = useState(true);
    const [savingField, setSavingField] = useState(null);
    const [error, setError] = useState("");

    /* =========================
       LOAD SETTINGS
    ========================= */

    useEffect(() => {
        let mounted = true;

        const loadSettings = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await apiRequest(
                    "/settings"
                );

                if (!mounted) {
                    return;
                }

                setSettings({
                    ...DEFAULT_SETTINGS,
                    ...(data.settings || {}),
                });
            } catch (error) {
                if (!mounted) {
                    return;
                }

                console.error(
                    "Failed to load settings:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load settings."
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadSettings();

        return () => {
            mounted = false;
        };
    }, []);

    /* =========================
       APPLY THEME
    ========================= */

    useEffect(() => {
        const root =
            document.documentElement;

        if (settings.theme === "dark") {
            root.setAttribute(
                "data-theme",
                "dark"
            );

            return;
        }

        if (settings.theme === "light") {
            root.setAttribute(
                "data-theme",
                "light"
            );

            return;
        }

        const mediaQuery =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            );

        const applySystemTheme = () => {
            root.setAttribute(
                "data-theme",
                mediaQuery.matches
                    ? "dark"
                    : "light"
            );
        };

        applySystemTheme();

        mediaQuery.addEventListener(
            "change",
            applySystemTheme
        );

        return () => {
            mediaQuery.removeEventListener(
                "change",
                applySystemTheme
            );
        };
    }, [settings.theme]);

    /* =========================
       UPDATE SINGLE SETTING
    ========================= */

    const updateSetting = async (
        field,
        value
    ) => {
        const previousValue =
            settings[field];

        setError("");

        setSettings((prev) => ({
            ...prev,
            [field]: value,
        }));

        setSavingField(field);

        try {
            const data = await apiRequest(
                "/settings",
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        [field]: value,
                    }),
                }
            );

            setSettings((prev) => ({
                ...prev,
                ...(data.settings || {}),
            }));
        } catch (error) {
            console.error(
                `Failed to update ${field}:`,
                error
            );

            setSettings((prev) => ({
                ...prev,
                [field]: previousValue,
            }));

            setError(
                error.message ||
                "Unable to save setting."
            );
        } finally {
            setSavingField(null);
        }
    };

    return (
        <div className="settings-page">

            {/* Header */}
            <div className="settings-header">
                <div>
                    <h1>Settings</h1>

                    <p>
                        Manage your account,
                        notifications and product
                        preferences.
                    </p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="settings-error">
                    {error}
                </div>
            )}

            {/* Account */}
            <section className="settings-card">

                <div className="settings-section-header">
                    <div>
                        <h2>Account</h2>

                        <p>
                            Manage your account
                            information and profile
                            settings.
                        </p>
                    </div>
                </div>

                <div className="settings-row">
                    <div>
                        <strong>Profile</strong>

                        <p>
                            Update your name, role,
                            contact information and
                            location.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="settings-action-btn"
                        onClick={() =>
                            navigate("/profile")
                        }
                    >
                        Manage →
                    </button>
                </div>

                <div className="settings-row">
                    <div>
                        <strong>
                            Email Address
                        </strong>

                        <p>
                            Manage the email address
                            associated with your
                            account.
                        </p>
                    </div>

                    <span className="settings-value">
                        {user?.email || "—"}
                    </span>
                </div>

            </section>

            {/* Notifications */}
            <section className="settings-card">

                <div className="settings-section-header">
                    <div>
                        <h2>Notifications</h2>

                        <p>
                            Choose which
                            notifications you want
                            to receive.
                        </p>
                    </div>
                </div>

                {/* Email Notifications */}
                <div className="settings-row">

                    <div>
                        <strong>
                            Email notifications
                        </strong>

                        <p>
                            Receive important
                            product updates and
                            account emails.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={`settings-toggle ${settings.emailNotifications
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            updateSetting(
                                "emailNotifications",
                                !settings.emailNotifications
                            )
                        }
                        aria-pressed={
                            settings.emailNotifications
                        }
                        disabled={
                            loading ||
                            savingField ===
                            "emailNotifications"
                        }
                    >
                        <span></span>
                    </button>

                </div>

                {/* Feedback Alerts */}
                <div className="settings-row">

                    <div>
                        <strong>
                            Feedback alerts
                        </strong>

                        <p>
                            Get notified when new
                            customer feedback
                            requires attention.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={`settings-toggle ${settings.feedbackAlerts
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            updateSetting(
                                "feedbackAlerts",
                                !settings.feedbackAlerts
                            )
                        }
                        aria-pressed={
                            settings.feedbackAlerts
                        }
                        disabled={
                            loading ||
                            savingField ===
                            "feedbackAlerts"
                        }
                    >
                        <span></span>
                    </button>

                </div>

                {/* Report Notifications */}
                <div className="settings-row">

                    <div>
                        <strong>
                            Report notifications
                        </strong>

                        <p>
                            Receive notifications
                            when reports are
                            generated.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={`settings-toggle ${settings.reportNotifications
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            updateSetting(
                                "reportNotifications",
                                !settings.reportNotifications
                            )
                        }
                        aria-pressed={
                            settings.reportNotifications
                        }
                        disabled={
                            loading ||
                            savingField ===
                            "reportNotifications"
                        }
                    >
                        <span></span>
                    </button>

                </div>

                {/* Appearance */}
                <div className="settings-section">

                    <div className="settings-section-header">
                        <h2>Appearance</h2>

                        <p>
                            Customize how AI
                            Feedback looks on
                            your device.
                        </p>
                    </div>

                    {/* Theme */}
                    <div className="settings-row">

                        <div>
                            <strong>
                                Theme
                            </strong>

                            <p>
                                Choose your preferred
                                interface theme.
                            </p>
                        </div>

                        <select
                            id="theme"
                            name="theme"
                            className="settings-select"
                            value={settings.theme}
                            onChange={(e) =>
                                updateSetting(
                                    "theme",
                                    e.target.value
                                )
                            }
                            disabled={
                                loading ||
                                savingField ===
                                "theme"
                            }
                        >
                            <option value="light">
                                Light
                            </option>

                            <option value="dark">
                                Dark
                            </option>

                            <option value="system">
                                System
                            </option>
                        </select>

                    </div>

                    {/* Compact Mode */}
                    <div className="settings-row">

                        <div>
                            <strong>
                                Compact mode
                            </strong>

                            <p>
                                Reduce spacing to
                                show more content
                                on screen.
                            </p>
                        </div>

                        <button
                            type="button"
                            className={`settings-toggle ${settings.compactMode
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                updateSetting(
                                    "compactMode",
                                    !settings.compactMode
                                )
                            }
                            aria-pressed={
                                settings.compactMode
                            }
                            disabled={
                                loading ||
                                savingField ===
                                "compactMode"
                            }
                        >
                            <span></span>
                        </button>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Settings;