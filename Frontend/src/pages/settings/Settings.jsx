import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

function Settings() {
    const navigate = useNavigate();
    const [emailNotifications, setEmailNotifications] = useState(() => {
        const saved = localStorage.getItem("projectLoop_emailNotifications");
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [feedbackAlerts, setFeedbackAlerts] = useState(() => {
        const saved = localStorage.getItem("projectLoop_feedbackAlerts");
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [reportNotifications, setReportNotifications] = useState(() => {
        const saved = localStorage.getItem("projectLoop_reportNotifications");
        return saved !== null ? JSON.parse(saved) : false;
    });

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("projectLoop_theme") || "system";
    });

    const [compactMode, setCompactMode] = useState(() => {
        const saved = localStorage.getItem("projectLoop_compactMode");
        return saved !== null ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem(
            "projectLoop_emailNotifications",
            JSON.stringify(emailNotifications)
        );
    }, [emailNotifications]);

    useEffect(() => {
        localStorage.setItem(
            "projectLoop_feedbackAlerts",
            JSON.stringify(feedbackAlerts)
        );
    }, [feedbackAlerts]);

    useEffect(() => {
        localStorage.setItem(
            "projectLoop_reportNotifications",
            JSON.stringify(reportNotifications)
        );
    }, [reportNotifications]);

    useEffect(() => {
        localStorage.setItem("projectLoop_theme", theme);

        const root = document.documentElement;

        if (theme === "dark") {
            root.setAttribute("data-theme", "dark");
        } else if (theme === "light") {
            root.setAttribute("data-theme", "light");
        } else {
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

            root.setAttribute(
                "data-theme",
                prefersDark ? "dark" : "light"
            );
        }
    }, [theme]);
    useEffect(() => {
        if (theme !== "system") return;

        const mediaQuery = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

        const handleThemeChange = (event) => {
            document.documentElement.setAttribute(
                "data-theme",
                event.matches ? "dark" : "light"
            );
        };

        mediaQuery.addEventListener("change", handleThemeChange);

        return () => {
            mediaQuery.removeEventListener("change", handleThemeChange);
        };
    }, [theme]);

    useEffect(() => {
        localStorage.setItem(
            "projectLoop_compactMode",
            JSON.stringify(compactMode)
        );
    }, [compactMode]);

    return (
        <div className="settings-page">

            {/* Header */}
            <div className="settings-header">
                <div>
                    <h1>Settings</h1>
                    <p>
                        Manage your account, notifications and product preferences.
                    </p>
                </div>
            </div>

            {/* Account */}
            <section className="settings-card">

                <div className="settings-section-header">
                    <div>
                        <h2>Account</h2>
                        <p>
                            Manage your account information and profile settings.
                        </p>
                    </div>
                </div>

                <div className="settings-row">
                    <div>
                        <strong>Profile</strong>
                        <p>
                            Update your name, role, contact information and location.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="settings-action-btn"
                        onClick={() => navigate("/profile")}
                    >
                        Manage →
                    </button>
                </div>

                <div className="settings-row">
                    <div>
                        <strong>Email Address</strong>
                        <p>
                            Manage the email address associated with your account.
                        </p>
                    </div>

                    <span className="settings-value">
                        vishal@example.com
                    </span>
                </div>

            </section>

            {/* Notifications */}
            <section className="settings-card">

                <div className="settings-section-header">
                    <div>
                        <h2>Notifications</h2>
                        <p>
                            Choose which notifications you want to receive.
                        </p>
                    </div>
                </div>

                {/* Email Notifications */}
                <div className="settings-row">

                    <div>
                        <strong>Email notifications</strong>
                        <p>
                            Receive important product updates and account emails.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={`settings-toggle ${emailNotifications ? "active" : ""
                            }`}
                        onClick={() =>
                            setEmailNotifications(!emailNotifications)
                        }
                        aria-pressed={emailNotifications}
                    >
                        <span></span>
                    </button>

                </div>

                {/* Feedback Alerts */}
                <div className="settings-row">

                    <div>
                        <strong>Feedback alerts</strong>
                        <p>
                            Get notified when new customer feedback requires attention.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={`settings-toggle ${feedbackAlerts ? "active" : ""
                            }`}
                        onClick={() =>
                            setFeedbackAlerts(!feedbackAlerts)
                        }
                        aria-pressed={feedbackAlerts}
                    >
                        <span></span>
                    </button>

                </div>

                {/* Report Notifications */}
                <div className="settings-row">

                    <div>
                        <strong>Report notifications</strong>
                        <p>
                            Receive notifications when reports are generated.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={`settings-toggle ${reportNotifications ? "active" : ""
                            }`}
                        onClick={() =>
                            setReportNotifications(!reportNotifications)
                        }
                        aria-pressed={reportNotifications}
                    >
                        <span></span>
                    </button>
                </div>

                {/* Appearance */}
                <div className="settings-section">
                    <div className="settings-section-header">
                        <h2>Appearance</h2>
                       <p>Customize how AI Feedback looks on your device.</p>
                    </div>

                    <div className="settings-row">
                        <div>
                            <strong>Theme</strong>
                            <p>Choose your preferred interface theme.</p>
                        </div>

                        <select
                            className="settings-select"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                        </select>
                    </div>

                    <div className="settings-row">
                        <div>
                            <strong>Compact mode</strong>
                            <p>Reduce spacing to show more content on screen.</p>
                        </div>

                        <button
                            type="button"
                            className={`settings-toggle ${compactMode ? "active" : ""
                                }`}
                            onClick={() => setCompactMode(!compactMode)}
                            aria-pressed={compactMode}
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