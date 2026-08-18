import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/dashboard/Dashboard";
import Feedback from "../pages/feedback/Feedback";
import Analytics from "../pages/analytics/Analytics";
import Reports from "../pages/reports/Reports";
import Profile from "../pages/profile/Profile";
import Settings from "../pages/settings/Settings";

function AppRoutes() {
    return (
        <Routes>

            <Route
                path="/"
                element={<Dashboard />}
            />

            <Route
                path="/feedback"
                element={<Feedback />}
            />

            <Route
                path="/analytics"
                element={<Analytics />}
            />

            <Route
                path="/reports"
                element={<Reports />}
            />

            <Route
                path="/profile"
                element={<Profile />}
            />

            <Route
                path="/settings"
                element={<Settings />}
            />

        </Routes>
    );
}

export default AppRoutes;