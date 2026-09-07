import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    analyticsApi,
} from "../services/api";

export default function useAnalytics(
    range = "Last 30 Days"
) {
    const [analytics, setAnalytics] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const loadAnalytics =
        useCallback(async () => {

            try {
                setLoading(true);
                setError("");

                const response =
                    await analyticsApi.overview(
                        range
                    );

                setAnalytics(
                    response.data
                );

            } catch (error) {

                console.error(
                    "Analytics loading error:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load analytics"
                );

            } finally {

                setLoading(false);

            }

        }, [range]);

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]);

    return {
        analytics,
        loading,
        error,
        refresh: loadAnalytics,
    };
}