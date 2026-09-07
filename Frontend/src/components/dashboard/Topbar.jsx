import {
    useEffect,
    useRef,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { apiRequest } from "../../lib/api";

import "./Topbar.css";


function Topbar() {
    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();

    const [
        menuOpen,
        setMenuOpen,
    ] = useState(false);

    const [
        notificationsOpen,
        setNotificationsOpen,
    ] = useState(false);

    const [
        notifications,
        setNotifications,
    ] = useState([]);

    const [
        unreadCount,
        setUnreadCount,
    ] = useState(0);

    const notificationRef =
        useRef(null);


    /* =====================================================
       USER DISPLAY
    ===================================================== */

    const name =
        user?.name ||
        user?.fullName ||
        user?.email?.split("@")[0] ||
        "User";

    const email =
        user?.email || "";

    const role =
        user?.role || "MEMBER";

    const initials = name
        .split(" ")
        .map(
            (part) => part[0],
        )
        .join("")
        .slice(0, 2)
        .toUpperCase();


    /* =====================================================
       LOAD NOTIFICATIONS
    ===================================================== */

    const loadNotifications =
        async () => {
            try {
                const data =
                    await apiRequest(
                        "/notifications",
                    );

                setNotifications(
                    data.notifications || [],
                );

                setUnreadCount(
                    data.unreadCount || 0,
                );
            } catch (error) {
                console.error(
                    "Failed to load notifications:",
                    error,
                );
            }
        };


    /* =====================================================
       INITIAL LOAD + LIGHT POLLING
    ===================================================== */

    useEffect(() => {
        loadNotifications();

        const interval =
            setInterval(
                loadNotifications,
                30000,
            );

        return () =>
            clearInterval(interval);
    }, []);


    /* =====================================================
       CLOSE NOTIFICATION DROPDOWN
    ===================================================== */

    useEffect(() => {
        const handleClickOutside =
            (event) => {
                if (
                    notificationRef.current &&
                    !notificationRef.current.contains(
                        event.target,
                    )
                ) {
                    setNotificationsOpen(
                        false,
                    );
                }
            };

        document.addEventListener(
            "mousedown",
            handleClickOutside,
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside,
            );
    }, []);


    /* =====================================================
       MARK ONE NOTIFICATION READ
    ===================================================== */

    const handleNotificationClick =
        async (notification) => {
            try {
                if (!notification.read) {
                    await apiRequest(
                        `/notifications/${notification._id}/read`,
                        {
                            method: "PATCH",
                        },
                    );

                    setNotifications(
                        (current) =>
                            current.map(
                                (item) =>
                                    item._id ===
                                        notification._id
                                        ? {
                                            ...item,
                                            read: true,
                                        }
                                        : item,
                            ),
                    );

                    setUnreadCount(
                        (current) =>
                            Math.max(
                                current - 1,
                                0,
                            ),
                    );
                }

                setNotificationsOpen(
                    false,
                );
            } catch (error) {
                console.error(
                    "Failed to mark notification read:",
                    error,
                );
            }
        };


    /* =====================================================
       MARK ALL READ
    ===================================================== */

    const markAllRead =
        async () => {
            try {
                await apiRequest(
                    "/notifications/read-all",
                    {
                        method: "PATCH",
                    },
                );

                setNotifications(
                    (current) =>
                        current.map(
                            (item) => ({
                                ...item,
                                read: true,
                            }),
                        ),
                );

                setUnreadCount(0);
            } catch (error) {
                console.error(
                    "Failed to mark all notifications read:",
                    error,
                );
            }
        };


    return (
        <header className="topbar">

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="topbar-search">
                <svg
                    className="topbar-search-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                </svg>

                <input
                    type="text"
                    placeholder="Search..."
                    aria-label="Search"
                />
            </div>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="topbar-actions">

                {/* ===============================
                    NOTIFICATIONS
                =============================== */}

                <div
                    className="topbar-notifications"
                    ref={notificationRef}
                >

                    <button
                        type="button"
                        className="topbar-icon-button notification-button"
                        aria-label="Notifications"
                        aria-expanded={
                            notificationsOpen
                        }
                        onClick={() =>
                            setNotificationsOpen(
                                (current) =>
                                    !current,
                            )
                        }
                    >
                        <svg
                            className="notification-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                            <path d="M10 21h4" />
                        </svg>

                        {unreadCount > 0 && (
                            <span className="notification-badge">
                                {unreadCount > 99
                                    ? "99+"
                                    : unreadCount}
                            </span>
                        )}
                    </button>


                    {notificationsOpen && (
                        <div className="notification-menu">

                            <div className="notification-header">

                                <div>
                                    <strong>
                                        Notifications
                                    </strong>

                                    <span>
                                        {unreadCount > 0
                                            ? `${unreadCount} unread`
                                            : "You're all caught up"}
                                    </span>
                                </div>

                                {unreadCount >
                                    0 && (
                                        <button
                                            type="button"
                                            onClick={
                                                markAllRead
                                            }
                                        >
                                            Mark all read
                                        </button>
                                    )}

                            </div>


                            <div className="notification-list">

                                {notifications.length ===
                                    0 ? (
                                    <div className="notification-empty">
                                        <div>
                                            🔔
                                        </div>

                                        <strong>
                                            No notifications
                                        </strong>

                                        <span>
                                            New activity will appear here.
                                        </span>
                                    </div>
                                ) : (
                                    notifications.map(
                                        (
                                            notification,
                                        ) => (
                                            <button
                                                type="button"
                                                key={
                                                    notification._id
                                                }
                                                className={`notification-item ${notification.read
                                                    ? ""
                                                    : "unread"
                                                    }`}
                                                onClick={() =>
                                                    handleNotificationClick(
                                                        notification,
                                                    )
                                                }
                                            >

                                                <span className="notification-dot">
                                                    {!notification.read &&
                                                        "●"}
                                                </span>

                                                <span className="notification-content">

                                                    <strong>
                                                        {
                                                            notification.title
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            notification.message
                                                        }
                                                    </span>

                                                    <small>
                                                        {new Date(
                                                            notification.createdAt,
                                                        ).toLocaleString()}
                                                    </small>

                                                </span>

                                            </button>
                                        ),
                                    )
                                )}

                            </div>

                        </div>
                    )}

                </div>


                {/* ===============================
                    SETTINGS
                =============================== */}

                <button
                    type="button"
                    className="topbar-icon-button"
                    aria-label="Settings"
                    onClick={() =>
                        navigate(
                            "/settings",
                        )
                    }
                >
                    <svg
                        className="settings-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-1.41 1.41-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V20h-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06-1.41-1.41.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H6v-2h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06 1.41-1.41.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 .99-1.51V4h2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06 1.41 1.41-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51.99H20v2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                    </svg>
                </button>


                {/* ===============================
                    PROFILE
                =============================== */}

                <div className="topbar-profile">

                    <button
                        type="button"
                        className="topbar-avatar-button"
                        onClick={() =>
                            setMenuOpen(
                                (current) =>
                                    !current,
                            )
                        }
                        aria-expanded={
                            menuOpen
                        }
                    >
                        {initials}
                    </button>


                    {menuOpen && (
                        <>
                            <div
                                className="profile-menu-backdrop"
                                onClick={() =>
                                    setMenuOpen(
                                        false,
                                    )
                                }
                            />

                            <div className="profile-menu">

                                <div className="profile-menu-user">

                                    <div className="profile-menu-avatar">
                                        {initials}
                                    </div>

                                    <div>
                                        <strong>
                                            {name}
                                        </strong>

                                        <span>
                                            {email}
                                        </span>

                                        <small>
                                            {role}
                                        </small>
                                    </div>

                                </div>


                                <div className="profile-menu-divider" />


                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(
                                            false,
                                        );

                                        navigate(
                                            "/profile",
                                        );
                                    }}
                                >
                                    <span>
                                        👤
                                    </span>

                                    Profile
                                </button>


                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(
                                            false,
                                        );

                                        navigate(
                                            "/settings",
                                        );
                                    }}
                                >
                                    <span>
                                        ⚙
                                    </span>

                                    Settings
                                </button>


                                <div className="profile-menu-divider" />


                                <button
                                    type="button"
                                    className="profile-menu-danger"
                                    onClick={
                                        logout
                                    }
                                >
                                    <span>
                                        ↪
                                    </span>

                                    Sign out
                                </button>

                            </div>
                        </>
                    )}

                </div>

            </div>

        </header>
    );
}


export default Topbar;