import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute() {
    const {
        isAuthenticated,
        loading,
        initialized,
    } = useAuth();

    const location = useLocation();

    // Wait until AuthContext has finished restoring the session.
    if (!initialized || loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "grid",
                    placeItems: "center",
                }}
            >
                Checking your session...
            </div>
        );
    }

    // User is not authenticated.
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from:
                        location.pathname +
                        location.search +
                        location.hash,
                }}
            />
        );
    }

    // User is authenticated.
    return <Outlet />;
}