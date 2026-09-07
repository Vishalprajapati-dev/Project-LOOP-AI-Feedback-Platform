import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    dashboardApi,
} from "../services/api";


export default function useDashboard() {

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadDashboard =
        useCallback(async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await dashboardApi.overview();

                setDashboard(
                    response.data
                );

            } catch (error) {

                console.error(
                    "Dashboard loading error:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load dashboard"
                );

            } finally {

                setLoading(false);

            }

        }, []);


    useEffect(() => {

        loadDashboard();

    }, [loadDashboard]);


    return {
        dashboard,
        loading,
        error,
        refresh: loadDashboard,
    };
}