import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { feedbackApi } from "../services/api";

export default function useFeedback({
  search = "",
  status = "All",
  sentiment = "All",
} = {}) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 100,
    pages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [error, setError] = useState("");

  const loadFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await feedbackApi.list({
        search: search.trim(),
        status: status !== "All" ? status : "",
        sentiment:
          sentiment !== "All" ? sentiment : "",
        page: 1,
        limit: 100,
      });

      setFeedbacks(response.feedbacks || []);

      setPagination(
        response.pagination || {
          total: 0,
          page: 1,
          limit: 100,
          pages: 0,
        }
      );
    } catch (error) {
      console.error(
        "Feedback loading error:",
        error
      );

      setError(
        error.message ||
          "Unable to load feedback"
      );
    } finally {
      setLoading(false);
    }
  }, [search, status, sentiment]);

  const createFeedback = useCallback(
    async (payload) => {
      try {
        setSubmitting(true);
        setError("");

        const response =
          await feedbackApi.create(payload);

        await loadFeedbacks();

        return response.feedback;
      } catch (error) {
        console.error(
          "Feedback creation error:",
          error
        );

        setError(
          error.message ||
            "Failed to create feedback"
        );

        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [loadFeedbacks]
  );

  const analyzeFeedback = useCallback(
    async (feedbackId) => {
      try {
        setAnalyzingId(feedbackId);
        setError("");

        const response =
          await feedbackApi.analyze(
            feedbackId
          );

        if (response.feedback) {
          setFeedbacks((current) =>
            current.map((item) =>
              item._id === feedbackId
                ? response.feedback
                : item
            )
          );
        }

        return response;
      } catch (error) {
        console.error(
          "Feedback analysis error:",
          error
        );

        setError(
          error.message ||
            "AI analysis failed"
        );

        throw error;
      } finally {
        setAnalyzingId(null);
      }
    },
    []
  );

  const deleteFeedback = useCallback(
    async (feedbackId) => {
      try {
        setError("");

        await feedbackApi.remove(
          feedbackId
        );

        setFeedbacks((current) =>
          current.filter(
            (item) =>
              item._id !== feedbackId
          )
        );
      } catch (error) {
        console.error(
          "Feedback deletion error:",
          error
        );

        setError(
          error.message ||
            "Failed to delete feedback"
        );

        throw error;
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadFeedbacks();
    }, 250);

    return () => clearTimeout(timer);
  }, [loadFeedbacks]);

  return {
    feedbacks,
    pagination,
    loading,
    submitting,
    analyzingId,
    error,

    refresh: loadFeedbacks,

    createFeedback,
    analyzeFeedback,
    deleteFeedback,
  };
}