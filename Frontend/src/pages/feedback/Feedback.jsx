import { useCallback, useEffect, useMemo, useState } from "react";
import "./Feedback.css";
import useFeedback from "../../hooks/useFeedback";
import Modal from "../../components/ui/Modal";

const STATUS_OPTIONS = [
    { value: "All", label: "All Status" },
    { value: "NEW", label: "New" },
    { value: "REVIEWED", label: "Reviewed" },
    { value: "ACTIONED", label: "Actioned" },
];

const SENTIMENT_OPTIONS = [
    { value: "All", label: "All Sentiment" },
    { value: "POS", label: "Positive" },
    { value: "NEU", label: "Neutral" },
    { value: "NEG", label: "Negative" },
];

const CHANNEL_OPTIONS = [
    "Website",
    "Email",
    "Support",
    "App Store",
    "Social",
    "Survey",
    "Other",
];

const formatSentiment = (value) => {
    const map = {
        POS: "Positive",
        NEU: "Neutral",
        NEG: "Negative",
    };

    return map[value] || "Not analyzed";
};

const formatStatus = (value) => {
    const map = {
        NEW: "New",
        REVIEWED: "Reviewed",
        ACTIONED: "Actioned",
    };

    return map[value] || value;
};

const formatPriority = (value) => {
    const map = {
        LOW: "Low",
        MEDIUM: "Medium",
        HIGH: "High",
    };

    return map[value] || "Not analyzed";
};

const getInitial = (feedback) => {
    return (
        feedback.customerLabel?.charAt(0)?.toUpperCase() ||
        "C"
    );
};

function Feedback() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sentimentFilter, setSentimentFilter] = useState("All");

    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteFeedbackId, setDeleteFeedbackId] = useState(null);

    const [form, setForm] = useState({
        content: "",
        channel: "Website",
        customerLabel: "",
        sourceRef: "",
    });

    const {
        feedbacks,
        loading,
        submitting,
        analyzingId,
        error,
        refresh,
        createFeedback,
        analyzeFeedback,
        deleteFeedback,
    } = useFeedback({
        search,
        status: statusFilter,
        sentiment: sentimentFilter,
    });


    // =====================================================
    // CREATE FEEDBACK
    // =====================================================

    const handleCreateFeedback = async (e) => {
        e.preventDefault();

        if (!form.content.trim()) {
            return;
        }

        try {
            const feedback = await createFeedback({
                content: form.content.trim(),
                channel: form.channel,
                customerLabel: form.customerLabel.trim(),
                sourceRef: form.sourceRef.trim(),
            });

            if (feedback) {
                setForm({
                    content: "",
                    channel: "Website",
                    customerLabel: "",
                    sourceRef: "",
                });

                setShowCreateModal(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // =====================================================
    // AI ANALYSIS
    // =====================================================

    const handleAnalyze = async (feedbackId) => {
        try {
            const response = await analyzeFeedback(feedbackId);

            if (response?.feedback) {
                setSelectedFeedback(response.feedback);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = (feedbackId) => {
        setDeleteFeedbackId(feedbackId);
        setShowDeleteModal(true);
    };


    const handleConfirmDelete = async () => {
        if (!deleteFeedbackId) return;

        try {
            await deleteFeedback(deleteFeedbackId);

            if (selectedFeedback?._id === deleteFeedbackId) {
                setSelectedFeedback(null);
            }

            setShowDeleteModal(false);
            setDeleteFeedbackId(null);
        } catch (err) {
            console.error(err);
        }
    };

    // =====================================================
    // LOCAL METRICS
    // =====================================================

    const metrics = useMemo(() => {
        const total = feedbacks.length;

        const analyzed = feedbacks.filter(
            (item) =>
                item.sentiment &&
                item.aiConfidence > 0
        );

        const pending = feedbacks.filter(
            (item) => item.status === "NEW"
        ).length;

        const highPriority = feedbacks.filter(
            (item) =>
                item.aiPriority === "HIGH"
        ).length;

        const averageConfidence =
            analyzed.length > 0
                ? Math.round(
                    analyzed.reduce(
                        (sum, item) =>
                            sum +
                            Number(
                                item.aiConfidence || 0
                            ),
                        0
                    ) / analyzed.length
                )
                : 0;

        return {
            total,
            pending,
            analyzed: analyzed.length,
            highPriority,
            averageConfidence,
        };
    }, [feedbacks]);

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setSentimentFilter("All");
    };

    return (
        <div className="feedback-page">

            {/* HEADER */}

            <div className="feedback-header">
                <div>
                    <h1>Feedback Intelligence</h1>

                    <p>
                        Turn customer feedback into
                        actionable AI-powered insights.
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                    }}
                >
                    <div className="feedback-header-badge">
                        <span>✦</span>
                        AI Analysis Active
                    </div>

                    <button
                        type="button"
                        className="view-analysis-button"
                        onClick={() =>
                            setShowCreateModal(true)
                        }
                    >
                        + Add Feedback
                    </button>
                </div>
            </div>

            {/* ERROR */}

            {error && (
                <div
                    style={{
                        marginBottom: "20px",
                        padding: "14px 16px",
                        borderRadius: "10px",
                        background: "#fff1f2",
                        border: "1px solid #fecdd3",
                        color: "#be123c",
                    }}
                >
                    {error}
                </div>
            )}

            {/* METRICS */}

            <div className="feedback-summary">

                <div className="feedback-summary-card">
                    <span className="summary-icon">
                        💬
                    </span>

                    <div>
                        <p>Total Feedback</p>
                        <h2>{metrics.total}</h2>
                    </div>
                </div>

                <div className="feedback-summary-card">
                    <span className="summary-icon">
                        ⏳
                    </span>

                    <div>
                        <p>Pending Review</p>
                        <h2>{metrics.pending}</h2>
                    </div>
                </div>

                <div className="feedback-summary-card">
                    <span className="summary-icon">
                        🤖
                    </span>

                    <div>
                        <p>AI Analyzed</p>
                        <h2>{metrics.analyzed}</h2>
                    </div>
                </div>

                <div className="feedback-summary-card">
                    <span className="summary-icon">
                        ⚡
                    </span>

                    <div>
                        <p>High Priority</p>
                        <h2>{metrics.highPriority}</h2>
                    </div>
                </div>

            </div>

            {/* TOOLBAR */}

            <div className="feedback-toolbar">

                <div className="feedback-search">
                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search customer feedback..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >
                    {STATUS_OPTIONS.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <select
                    value={sentimentFilter}
                    onChange={(e) =>
                        setSentimentFilter(
                            e.target.value
                        )
                    }
                >
                    {SENTIMENT_OPTIONS.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {(search ||
                    statusFilter !== "All" ||
                    sentimentFilter !== "All") && (
                        <button
                            type="button"
                            className="sort-button"
                            onClick={clearFilters}
                        >
                            Clear
                        </button>
                    )}

            </div>

            {/* RESULT HEADER */}

            <div className="feedback-results-header">
                <div>
                    <h2>Customer Feedback</h2>

                    <p>
                        {loading
                            ? "Loading..."
                            : `${feedbacks.length} feedback items`}
                    </p>
                </div>
            </div>

            {/* LOADING */}

            {loading && (
                <div className="feedback-empty">
                    <div>⏳</div>

                    <h3>
                        Loading feedback...
                    </h3>

                    <p>
                        Fetching your workspace data.
                    </p>
                </div>
            )}

            {/* EMPTY */}

            {!loading &&
                feedbacks.length === 0 && (
                    <div className="feedback-empty">

                        <div>💬</div>

                        <h3>
                            No feedback yet
                        </h3>

                        <p>
                            Add your first customer
                            feedback to start using
                            AI intelligence.
                        </p>

                        <button
                            type="button"
                            className="view-analysis-button"
                            onClick={() =>
                                setShowCreateModal(true)
                            }
                            style={{
                                marginTop: "16px",
                            }}
                        >
                            + Add First Feedback
                        </button>

                    </div>
                )}

            {/* FEEDBACK LIST */}

            {!loading &&
                feedbacks.length > 0 && (

                    <div className="feedback-list">

                        {feedbacks.map((feedback) => {

                            const sentiment =
                                formatSentiment(
                                    feedback.sentiment
                                );

                            const priority =
                                formatPriority(
                                    feedback.aiPriority
                                );

                            const analyzed =
                                Boolean(
                                    feedback.sentiment &&
                                    feedback.aiConfidence > 0
                                );

                            return (
                                <div
                                    className="feedback-card"
                                    key={feedback._id}
                                >

                                    <div className="feedback-card-top">

                                        <div className="feedback-user">

                                            <div className="feedback-avatar">
                                                {getInitial(
                                                    feedback
                                                )}
                                            </div>

                                            <div>
                                                <h3>
                                                    {feedback.customerLabel ||
                                                        "Anonymous Customer"}
                                                </h3>

                                                <span>
                                                    {feedback.channel}
                                                    {" · "}
                                                    {new Date(
                                                        feedback.createdAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>

                                        </div>

                                        <span
                                            className={`priority-badge priority-${priority.toLowerCase()}`}
                                        >
                                            {priority}
                                        </span>

                                    </div>

                                    <p className="feedback-message">
                                        "{feedback.content}"
                                    </p>

                                    <div className="feedback-analysis">

                                        <div className="analysis-item">
                                            <span>
                                                Sentiment
                                            </span>

                                            <strong
                                                className={
                                                    feedback.sentiment ===
                                                        "POS"
                                                        ? "sentiment-positive"
                                                        : feedback.sentiment ===
                                                            "NEG"
                                                            ? "sentiment-negative"
                                                            : ""
                                                }
                                            >
                                                {sentiment}
                                            </strong>
                                        </div>

                                        <div className="analysis-item">
                                            <span>
                                                AI Theme
                                            </span>

                                            <strong>
                                                {feedback.aiTheme ||
                                                    "Not analyzed"}
                                            </strong>
                                        </div>

                                        <div className="analysis-item">
                                            <span>
                                                AI Confidence
                                            </span>

                                            <strong>
                                                {analyzed
                                                    ? `${feedback.aiConfidence}%`
                                                    : "—"}
                                            </strong>
                                        </div>

                                        <div className="analysis-item">
                                            <span>
                                                Status
                                            </span>

                                            <strong>
                                                {formatStatus(
                                                    feedback.status
                                                )}
                                            </strong>
                                        </div>

                                    </div>

                                    {feedback.aiRecommendation && (
                                        <div className="feedback-card-footer">

                                            <div className="ai-recommendation">

                                                <span>
                                                    ✦
                                                </span>

                                                <div>
                                                    <small>
                                                        AI Recommendation
                                                    </small>

                                                    <p>
                                                        {
                                                            feedback.aiRecommendation
                                                        }
                                                    </p>
                                                </div>

                                            </div>

                                        </div>
                                    )}

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "10px",
                                            marginTop: "16px",
                                            justifyContent:
                                                "flex-end",
                                        }}
                                    >

                                        <button
                                            type="button"
                                            className="sort-button"
                                            onClick={() =>
                                                handleDelete(
                                                    feedback._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                        {analyzed && (
                                            <button
                                                type="button"
                                                className="view-analysis-button"
                                                onClick={() =>
                                                    setSelectedFeedback(
                                                        feedback
                                                    )
                                                }
                                            >
                                                View Analysis →
                                            </button>
                                        )}

                                        {!analyzed && (
                                            <button
                                                type="button"
                                                className="view-analysis-button"
                                                disabled={
                                                    analyzingId ===
                                                    feedback._id
                                                }
                                                onClick={() =>
                                                    handleAnalyze(
                                                        feedback._id
                                                    )
                                                }
                                            >
                                                {analyzingId ===
                                                    feedback._id
                                                    ? "Analyzing..."
                                                    : "✦ Analyze with AI"}
                                            </button>
                                        )}

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            {/* CREATE MODAL */}

            {showCreateModal && (
                <div
                    className="analysis-overlay"
                    onClick={() =>
                        !submitting &&
                        setShowCreateModal(false)
                    }
                >

                    <div
                        className="analysis-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>
                                <span className="modal-label">
                                    FEEDBACK INTAKE
                                </span>

                                <h2>
                                    Add Customer Feedback
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={() =>
                                    setShowCreateModal(false)
                                }
                                disabled={submitting}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={
                                handleCreateFeedback
                            }
                            style={{
                                marginTop: "24px",
                            }}
                        >

                            <div
                                style={{
                                    display: "grid",
                                    gap: "16px",
                                }}
                            >

                                <div>
                                    <label>
                                        Customer
                                    </label>

                                    <input
                                        className="feedback-form-input"
                                        value={
                                            form.customerLabel
                                        }
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                customerLabel:
                                                    e.target
                                                        .value,
                                            })
                                        }
                                        placeholder="e.g. Acme Corp"
                                    />
                                </div>

                                <div>
                                    <label>
                                        Channel
                                    </label>

                                    <select
                                        className="feedback-form-input"
                                        value={form.channel}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                channel:
                                                    e.target
                                                        .value,
                                            })
                                        }
                                    >
                                        {CHANNEL_OPTIONS.map(
                                            (channel) => (
                                                <option
                                                    key={
                                                        channel
                                                    }
                                                    value={
                                                        channel
                                                    }
                                                >
                                                    {channel}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label>
                                        Feedback
                                    </label>

                                    <textarea
                                        className="feedback-form-input"
                                        rows="6"
                                        value={
                                            form.content
                                        }
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                content:
                                                    e.target
                                                        .value,
                                            })
                                        }
                                        placeholder="Enter the customer's feedback..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label>
                                        Source Reference
                                    </label>

                                    <input
                                        className="feedback-form-input"
                                        value={
                                            form.sourceRef
                                        }
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                sourceRef:
                                                    e.target
                                                        .value,
                                            })
                                        }
                                        placeholder="Optional ticket/order/reference ID"
                                    />
                                </div>

                            </div>

                            <button
                                type="submit"
                                className="view-analysis-button"
                                disabled={submitting}
                                style={{
                                    width: "100%",
                                    marginTop: "20px",
                                }}
                            >
                                {submitting
                                    ? "Creating..."
                                    : "Create Feedback"}
                            </button>

                        </form>

                    </div>
                </div>
            )}

            {/* ANALYSIS MODAL */}

            {selectedFeedback && (
                <div
                    className="analysis-overlay"
                    onClick={() =>
                        setSelectedFeedback(null)
                    }
                >

                    <div
                        className="analysis-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>
                                <span className="modal-label">
                                    AI FEEDBACK ANALYSIS
                                </span>

                                <h2>
                                    {selectedFeedback.customerLabel ||
                                        "Customer Feedback"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={() =>
                                    setSelectedFeedback(null)
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div className="modal-score">

                            <div>
                                <span>
                                    AI Confidence
                                </span>

                                <strong>
                                    {
                                        selectedFeedback.aiConfidence
                                    }
                                    %
                                </strong>
                            </div>

                            <div className="score-bar">
                                <div
                                    style={{
                                        width: `${selectedFeedback.aiConfidence || 0}%`,
                                    }}
                                />
                            </div>

                        </div>

                        <div className="modal-grid">

                            <div>
                                <span>
                                    Sentiment
                                </span>

                                <strong>
                                    {formatSentiment(
                                        selectedFeedback.sentiment
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Theme
                                </span>

                                <strong>
                                    {
                                        selectedFeedback.aiTheme
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Priority
                                </span>

                                <strong>
                                    {formatPriority(
                                        selectedFeedback.aiPriority
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Status
                                </span>

                                <strong>
                                    {formatStatus(
                                        selectedFeedback.status
                                    )}
                                </strong>
                            </div>

                        </div>

                        <div className="modal-section">

                            <span>
                                Customer Feedback
                            </span>

                            <p>
                                "{selectedFeedback.content}"
                            </p>

                        </div>

                        <div className="modal-section">

                            <span>
                                AI Summary
                            </span>

                            <p>
                                {selectedFeedback.aiSummary ||
                                    "No summary available."}
                            </p>

                        </div>

                        <div className="modal-recommendation">

                            <span>
                                ✦ AI Recommendation
                            </span>

                            <p>
                                {selectedFeedback.aiRecommendation ||
                                    "No recommendation available."}
                            </p>

                        </div>

                    </div>
                </div>
            )}

            <Modal
                isOpen={showDeleteModal}
                title="Delete Feedback"
                onClose={() => {
                    setShowDeleteModal(false);
                    setDeleteFeedbackId(null);
                }}
                onConfirm={handleConfirmDelete}
                confirmText="Delete"
                cancelText="Cancel"
            >
                <p>
                    Are you sure you want to delete this feedback?
                    This action cannot be undone.
                </p>
            </Modal>

        </div>
    );
}

export default Feedback;