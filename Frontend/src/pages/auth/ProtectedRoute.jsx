import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function ProtectedRoute() {
    const {
        isAuthenticated,
        loading,
    } = useAuth();

    const location = useLocation();

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "grid",
                    placeItems: "center",
                    background: "#f5f7fb",
                    color: "#0f172a",
                    fontFamily: "Inter, sans-serif",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            border: "3px solid #dbe4f0",
                            borderTopColor: "#2563eb",
                            borderRadius: "50%",
                            margin: "0 auto 12px",
                            animation:
                                "project-loop-spin 0.8s linear infinite",
                        }}
                    />

                    <p
                        style={{
                            margin: 0,
                            fontSize: 14,
                            color: "#64748b",
                        }}
                    >
                        Restoring your session...
                    </p>

                    <style>
                        {`
                            @keyframes project-loop-spin {
                                to {
                                    transform: rotate(360deg);
                                }
                            }
                        `}
                    </style>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;