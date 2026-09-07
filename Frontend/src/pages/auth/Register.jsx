import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [companyName, setCompanyName] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

   const handleRegister = async (event) => {
    event.preventDefault();

    // Prevent duplicate registration requests.
    if (loading) {
        return;
    }

    setError("");
    setSuccess("");

    const cleanCompanyName = companyName.trim();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    /*
     * ---------------------------------------------------------
     * CLIENT-SIDE VALIDATION
     * ---------------------------------------------------------
     */

    if (
        !cleanCompanyName ||
        !cleanName ||
        !cleanEmail ||
        !password ||
        !confirmPassword
    ) {
        setError("Please complete all fields.");
        return;
    }

    /*
     * Backend requires minimum 8 characters.
     * Keep frontend validation consistent with backend.
     */
    if (password.length < 8) {
        setError(
            "Password must be at least 8 characters."
        );
        return;
    }

    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    setLoading(true);

    try {
        /*
         * -----------------------------------------------------
         * REGISTER THROUGH AUTH CONTEXT
         * -----------------------------------------------------
         *
         * AuthContext handles:
         *
         * POST /api/auth/register
         * HTTP-only accessToken cookie
         * HTTP-only refreshToken cookie
         * Workspace creation
         * User creation
         * Authenticated React state
         *
         * IMPORTANT:
         * Do NOT manually store the user in localStorage.
         */
        const user = await register({
            companyName: cleanCompanyName,
            name: cleanName,
            email: cleanEmail,
            password,
        });

        if (!user) {
            throw new Error(
                "Workspace was created but user session could not be established."
            );
        }

        /*
         * Remember only the email.
         *
         * Never store:
         * - password
         * - access token
         * - refresh token
         */
        localStorage.setItem(
            "projectLoop_login_email",
            cleanEmail
        );

        setSuccess(
            "Workspace created successfully. Redirecting..."
        );

        /*
         * AuthContext has already executed:
         *
         * setUser(data.user)
         *
         * Therefore ProtectedRoute now knows that the
         * user is authenticated.
         */
        navigate("/dashboard", {
            replace: true,
        });

    } catch (error) {
        console.error(
            "Registration error:",
            error
        );

        setError(
            error?.message ||
            "Unable to create your workspace. Please try again."
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
                    maxWidth: "460px",
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "16px",
                    padding: "32px",
                    boxShadow:
                        "0 20px 50px rgba(15, 23, 42, 0.10)",
                    boxSizing: "border-box",
                }}
            >
                <div style={{ marginBottom: "26px" }}>
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
                        Create your workspace
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#64748b",
                            fontSize: "14px",
                        }}
                    >
                        Start collecting and analyzing customer
                        feedback with AI.
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

                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: "16px" }}>
                        <label
                            htmlFor="companyName"
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#374151",
                            }}
                        >
                            Company / Workspace Name
                        </label>

                        <input
                            id="companyName"
                            type="text"
                            value={companyName}
                            onChange={(event) =>
                                setCompanyName(event.target.value)
                            }
                            placeholder="Acme Inc."
                            autoComplete="organization"
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

                    <div style={{ marginBottom: "16px" }}>
                        <label
                            htmlFor="name"
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#374151",
                            }}
                        >
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="John Doe"
                            autoComplete="name"
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

                    <div style={{ marginBottom: "16px" }}>
                        <label
                            htmlFor="registerEmail"
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#374151",
                            }}
                        >
                            Work Email
                        </label>

                        <input
                            id="registerEmail"
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

                    <div style={{ marginBottom: "16px" }}>
                        <label
                            htmlFor="registerPassword"
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
                            id="registerPassword"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Minimum 8 characters"
                            autoComplete="new-password"
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

                    <div style={{ marginBottom: "22px" }}>
                        <label
                            htmlFor="confirmPassword"
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#374151",
                            }}
                        >
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            placeholder="Re-enter your password"
                            autoComplete="new-password"
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
                        }}
                    >
                        {loading
                            ? "Creating Workspace..."
                            : "Create Workspace"}
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
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        style={{
                            color: "#2563eb",
                            fontWeight: "700",
                            textDecoration: "none",
                        }}
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;