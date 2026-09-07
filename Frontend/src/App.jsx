import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import Team from "./pages/team/Team";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/dashboard/Dashboard";
import Feedback from "./pages/feedback/Feedback";
import Analytics from "./pages/analytics/Analytics";
import Reports from "./pages/reports/Reports";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings/Settings";


function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>

                    {/* =========================================
                        PUBLIC ROUTES
                    ========================================= */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />


                    {/* =========================================
                        PROTECTED APPLICATION
                    ========================================= */}

                    <Route element={<ProtectedRoute />}>

                        <Route element={<MainLayout />}>

                            <Route
                                path="/dashboard"
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
                                path="/team"
                                element={<Team />}
                            />

                            <Route
                                path="/profile"
                                element={<Profile />}
                            />

                            <Route
                                path="/settings"
                                element={<Settings />}
                            />

                        </Route>

                    </Route>


                    {/* =========================================
                        DEFAULT ROUTE
                    ========================================= */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />


                    {/* =========================================
                        404 / UNKNOWN ROUTE
                    ========================================= */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}


export default App;