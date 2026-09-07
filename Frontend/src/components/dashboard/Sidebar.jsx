import "./Sidebar.css";

import {
    LayoutDashboard,
    MessageSquare,
    BarChart3,
    FileText,
    Users,
    User,
    Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
    const menuItems = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            path: "/",
        },
        {
            title: "Feedback",
            icon: MessageSquare,
            path: "/feedback",
        },
        {
            title: "Analytics",
            icon: BarChart3,
            path: "/analytics",
        },
        {
            title: "Reports",
            icon: FileText,
            path: "/reports",
        },
        {
            title: "Team",
            icon: Users,
            path: "/team",
        },
        {
            title: "Profile",
            icon: User,
            path: "/profile",
        },
        {
            title: "Settings",
            icon: Settings,
            path: "/settings",
        },
    ];

    return (
        <aside className="sidebar">
            <h2>AI Feedback</h2>

            <nav>
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.title}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive ? "nav-item active" : "nav-item"
                            }
                        >
                            <Icon size={20} />
                            <span>{item.title}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}

export default Sidebar;