import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState(
        localStorage.getItem("projectLoop_login_email") || ""
    );
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(
        Boolean(localStorage.getItem("projectLoop_login_email"))
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


   const handleLogin = async (event) => {
    event.preventDefault();

    // Prevent accidental double submission.
    if (loading) {
        return;
    }

    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    // Client-side validation.
    if (!cleanEmail || !password) {
        setError(
            "Please enter your email and password."
        );
        return;
    }

    setLoading(true);

    try {
        // Authenticate through AuthContext.
        //
        // AuthContext talks to:
        // POST /api/auth/login
        //
        // Backend validates the email/password and
        // creates the HTTP-only access + refresh cookies.
        await login(cleanEmail, password);

        // Remember only the email.
        // NEVER store the password or JWT in localStorage.
        if (rememberMe) {
            localStorage.setItem(
                "projectLoop_login_email",
                cleanEmail
            );
        } else {
            localStorage.removeItem(
                "projectLoop_login_email"
            );
        }

        setSuccess(
            "Login successful. Redirecting..."
        );

        /*
         * If ProtectedRoute sent the user to Login because
         * they tried to access a protected page, return
         * them there after successful authentication.
         *
         * For now /dashboard is our safe default.
         */
        navigate("/dashboard", {
            replace: true,
        });

    } catch (error) {
        /*
         * AuthContext already converts backend errors
         * into a normal Error with a useful message.
         *
         * Example:
         * "Invalid email or password"
         */
        setError(
            error?.message ||
            "Invalid email or password."
        );
    } finally {
        setLoading(false);
    }
};

    

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                background:
                    "linear-gradient(135deg, #f5f7fb 0%, #eef3ff 100%)",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "16px",
                    padding: "32px",
                    boxShadow:
                        "0 20px 50px rgba(15, 23, 42, 0.10)",
                    boxSizing: "border-box",
                }}
            >
                <div style={{ marginBottom: "28px" }}>
                    <div
                        style={{
                            fontSize: "28px",
                            fontWeight: "800",
                            color: "#111827",
                            marginBottom: "8px",
                        }}
                    >
                        AI Feedback
                    </div>

                    <h1
                        style={{
                            margin: "0 0 8px",
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "#111827",
                        }}
                    >
                        Welcome Back
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#64748b",
                            fontSize: "14px",
                        }}
                    >
                        Sign in to continue to your workspace.
                    </p>
                </div>

                {error && (
                    <div
                        style={{
                            marginBottom: "18px",
                            padding: "12px 14px",
                            borderRadius: "8px",
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            color: "#dc2626",
                            fontSize: "14px",
                            fontWeight: "600",
                        }}
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        style={{
                            marginBottom: "18px",
                            padding: "12px 14px",
                            borderRadius: "8px",
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            color: "#16a34a",
                            fontSize: "14px",
                            fontWeight: "600",
                        }}
                    >
                        {success}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: "18px" }}>
                        <label
                            htmlFor="email"
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#374151",
                            }}
                        >
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="you@company.com"
                            autoComplete="email"
                            disabled={loading}
                            style={{
                                width: "100%",
                                height: "46px",
                                padding: "0 14px",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                outline: "none",
                                fontSize: "14px",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "18px" }}>
                        <label
                            htmlFor="password"
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#374151",
                            }}
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={loading}
                            style={{
                                width: "100%",
                                height: "46px",
                                padding: "0 14px",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                outline: "none",
                                fontSize: "14px",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "24px",
                            fontSize: "14px",
                        }}
                    >
                        <label
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                color: "#475569",
                                cursor: "pointer",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(event) =>
                                    setRememberMe(event.target.checked)
                                }
                                disabled={loading}
                            />
                            Remember Me
                        </label>

                        <button
                            type="button"
                            onClick={() =>
                                setError(
                                    "Password reset is not available yet."
                                )
                            }
                            style={{
                                border: "none",
                                background: "transparent",
                                color: "#2563eb",
                                cursor: "pointer",
                                fontSize: "14px",
                                padding: 0,
                            }}
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            height: "48px",
                            border: "none",
                            borderRadius: "9px",
                            background: loading
                                ? "#93c5fd"
                                : "#2563eb",
                            color: "#ffffff",
                            fontSize: "15px",
                            fontWeight: "700",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                            transition: "0.2s",
                        }}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <div
                    style={{
                        marginTop: "24px",
                        paddingTop: "20px",
                        borderTop: "1px solid #e5e7eb",
                        textAlign: "center",
                        fontSize: "14px",
                        color: "#64748b",
                    }}
                >
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        style={{
                            color: "#2563eb",
                            fontWeight: "700",
                            textDecoration: "none",
                        }}
                    >
                        Create workspace
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;