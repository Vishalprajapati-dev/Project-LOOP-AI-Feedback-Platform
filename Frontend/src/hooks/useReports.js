import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { reportApi } from "../services/api";

export default function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await reportApi.list();

      setReports(response.reports || []);
    } catch (error) {
      console.error("Reports loading error:", error);

      setError(
        error.message || "Failed to load reports"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const generateReport = useCallback(
    async (periodStart, periodEnd) => {
      try {
        setGenerating(true);
        setError("");

        const response =
          await reportApi.generate(
            periodStart,
            periodEnd
          );

        const newReport = response.report;

        if (newReport) {
          setReports((current) => [
            newReport,
            ...current,
          ]);
        }

        return newReport;
      } catch (error) {
        console.error(
          "Report generation error:",
          error
        );

        setError(
          error.message ||
            "Failed to generate report"
        );

        throw error;
      } finally {
        setGenerating(false);
      }
    },
    []
  );

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  return {
    reports,
    loading,
    generating,
    error,
    refresh: loadReports,
    generateReport,
  };
}