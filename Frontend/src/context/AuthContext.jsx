import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { applySettings } from "../utils/appSettings";

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/*
|--------------------------------------------------------------------------
| Small API helper
|--------------------------------------------------------------------------
*/

const request = async (endpoint, options = {}) => {
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        }
    );

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        const error = new Error(
            data?.message ||
            "Something went wrong. Please try again."
        );

        error.status = response.status;

        throw error;
    }

    return data;
};


/*
|--------------------------------------------------------------------------
| Auth Provider
|--------------------------------------------------------------------------
*/

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const [settings, setSettings] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [initialized, setInitialized] = useState(false);

    const refreshPromiseRef = useRef(null);


    /*
    |--------------------------------------------------------------------------
    | Clear authentication state
    |--------------------------------------------------------------------------
    */

    const clearAuth = useCallback(() => {
        setUser(null);
        setError("");
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Get current user
    |--------------------------------------------------------------------------
    */

    const fetchCurrentUser = useCallback(async () => {
        const data = await request("/auth/me");

        if (!data?.user) {
            throw new Error(
                "Unable to load authenticated user."
            );
        }

        setUser(data.user);

        return data.user;
    }, []);


    /*
|--------------------------------------------------------------------------
| Get current user settings
|--------------------------------------------------------------------------
*/

    const fetchSettings = useCallback(async () => {
        const data = await request("/settings");

        if (!data?.settings) {
            throw new Error(
                "Unable to load application settings."
            );
        }

        setSettings(data.settings);

        // Apply theme + compact mode globally
        applySettings(data.settings);

        return data.settings;
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Update user settings
    |--------------------------------------------------------------------------
    */

    const updateSettings = useCallback(async (updates) => {
        const data = await request("/settings", {
            method: "PATCH",
            body: JSON.stringify(updates),
        });

        if (!data?.settings) {
            throw new Error(
                "Settings were updated but no settings were returned."
            );
        }

        setSettings(data.settings);

        // Apply immediately without refreshing
        applySettings(data.settings);

        return data.settings;
    }, []);
    /*
    |--------------------------------------------------------------------------
    | Refresh access token
    |--------------------------------------------------------------------------
    |
    | Access token:
    | short-lived
    |
    | Refresh token:
    | longer-lived
    |
    | Both are handled through HTTP-only cookies.
    |
    */

    const refreshAccessToken = useCallback(async () => {
        /*
         * Prevent multiple components from sending
         * refresh requests simultaneously.
         */

        if (refreshPromiseRef.current) {
            return refreshPromiseRef.current;
        }

        refreshPromiseRef.current = request(
            "/auth/refresh",
            {
                method: "POST",
            }
        );

        try {
            return await refreshPromiseRef.current;
        } finally {
            refreshPromiseRef.current = null;
        }
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Restore session on application startup
    |--------------------------------------------------------------------------
    */

    const restoreSession = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            /*
             * First try the current access token.
             */
            await fetchCurrentUser();
            await fetchSettings();


        } catch (error) {
            /*
             * Access token may simply be expired.
             *
             * Try the refresh token.
             */
            if (error.status === 401) {
                try {
                    await refreshAccessToken();

                    /*
                     * Refresh succeeded.
                     * Ask backend for fresh user information.
                     */
                    await fetchCurrentUser();
                    await fetchSettings();
                } catch (refreshError) {
                    /*
                     * Both access and refresh token
                     * are invalid/expired/revoked.
                     */
                    clearAuth();

                    /*
                     * Don't show a scary error on initial
                     * application load when the user is simply
                     * logged out.
                     */
                    if (refreshError.status !== 401) {
                        console.error(
                            "Session restore error:",
                            refreshError
                        );
                    }
                }
            } else {
                console.error(
                    "Authentication initialization error:",
                    error
                );

                clearAuth();
            }
        } finally {
            setLoading(false);
            setInitialized(true);
        }
    }, [
        fetchCurrentUser,
        fetchSettings,
        refreshAccessToken,
        clearAuth,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Initialize authentication
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let cancelled = false;

        const initialize = async () => {
            if (cancelled) {
                return;
            }

            await restoreSession();
        };

        initialize();

        return () => {
            cancelled = true;
        };
    }, [restoreSession]);


    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */

    const login = useCallback(
        async (email, password) => {
            setLoading(true);
            setError("");

            try {
                const cleanEmail = email
                    ?.trim()
                    .toLowerCase();

                if (!cleanEmail || !password) {
                    throw new Error(
                        "Email and password are required."
                    );
                }

                const data = await request(
                    "/auth/login",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            email: cleanEmail,
                            password,
                        }),
                    }
                );

                if (!data?.user) {
                    throw new Error(
                        "Login succeeded but user information was not returned."
                    );
                }

                /*
                 * Backend already set the HTTP-only cookies.
                 *
                 * We only keep safe user information in React state.
                 */
                setUser(data.user);

                return data.user;
            } catch (error) {
                setUser(null);

                const message =
                    error?.message ||
                    "Unable to login. Please try again.";

                setError(message);

                throw error;
            } finally {
                setLoading(false);
            }
        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | REGISTER
    |--------------------------------------------------------------------------
    */

    const register = useCallback(
        async ({
            companyName,
            name,
            email,
            password,
        }) => {
            setLoading(true);
            setError("");

            try {
                const cleanCompanyName =
                    companyName?.trim();

                const cleanName = name?.trim();

                const cleanEmail = email
                    ?.trim()
                    .toLowerCase();

                if (
                    !cleanCompanyName ||
                    !cleanName ||
                    !cleanEmail ||
                    !password
                ) {
                    throw new Error(
                        "Company name, name, email and password are required."
                    );
                }

                const data = await request(
                    "/auth/register",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            companyName:
                                cleanCompanyName,
                            name: cleanName,
                            email: cleanEmail,
                            password,
                        }),
                    }
                );

                if (!data?.user) {
                    throw new Error(
                        "Registration succeeded but user information was not returned."
                    );
                }

                /*
                 * Backend has already created:
                 *
                 * Workspace
                 * User
                 * ADMIN role
                 * Access token
                 * Refresh token
                 *
                 * Cookies are automatically stored by browser.
                 */

                setUser(data.user);

                return data.user;
            } catch (error) {
                setUser(null);

                const message =
                    error?.message ||
                    "Unable to create your account.";

                setError(message);

                throw error;
            } finally {
                setLoading(false);
            }
        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    const logout = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            await request(
                "/auth/logout",
                {
                    method: "POST",
                }
            );
        } catch (error) {
            /*
             * Even if backend logout fails,
             * clear frontend authentication state.
             */
            console.error(
                "Logout request failed:",
                error
            );
        } finally {
            clearAuth();
            setLoading(false);
        }
    }, [clearAuth]);


    /*
    |--------------------------------------------------------------------------
    | Refresh user manually
    |--------------------------------------------------------------------------
    */

    const refreshUser = useCallback(async () => {
        try {
            const data = await request("/users/me");

            if (!data?.user) {
                throw new Error(
                    "Unable to refresh authenticated user."
                );
            }

            setUser(data.user);

            return data.user;
        } catch (error) {
            if (error.status === 401) {
                try {
                    await refreshAccessToken();

                    const data = await request("/users/me");

                    if (!data?.user) {
                        throw new Error(
                            "Unable to refresh authenticated user."
                        );
                    }

                    setUser(data.user);

                    return data.user;
                } catch (refreshError) {
                    clearAuth();
                    throw refreshError;
                }
            }

            throw error;
        }
    }, [
        refreshAccessToken,
        clearAuth,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Context value
    |--------------------------------------------------------------------------
    */

    const value = useMemo(
        () => ({
            user,

            settings,

            loading,

            initialized,

            error,

            isAuthenticated: Boolean(user),

            isAdmin:
                user?.role === "ADMIN",

            isAnalyst:
                user?.role === "ANALYST",

            isViewer:
                user?.role === "VIEWER",

            login,

            register,

            logout,

            refreshUser,

            updateSettings,

            clearError: () => setError(""),
        }),
        [
            user,
            settings,
            loading,
            initialized,
            error,
            login,
            register,
            logout,
            refreshUser,
            updateSettings,
        ]
    );


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


/*
|--------------------------------------------------------------------------
| useAuthContext
|--------------------------------------------------------------------------
*/

export function useAuthContext() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuthContext must be used inside an AuthProvider."
        );
    }

    return context;
}

