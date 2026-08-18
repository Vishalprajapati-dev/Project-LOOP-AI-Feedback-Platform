import { useMemo, useState } from "react";
import "./Feedback.css";
import { feedbackData } from "../../data/feedbackData";

function Feedback() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sentimentFilter, setSentimentFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    // =========================
    // NORMALIZE AI CONFIDENCE
    // =========================

    const getConfidence = (feedback) => {
        return Number(feedback.confidence ?? feedback.score ?? 0);
    };


    // =========================
    // SUMMARY METRICS
    // =========================

    const totalFeedback = feedbackData.length;

    const pendingFeedback = feedbackData.filter(
        (feedback) => feedback.status === "Pending"
    ).length;

    const highPriorityFeedback = feedbackData.filter(
        (feedback) => feedback.priority === "High"
    ).length;

    const averageConfidence =
        totalFeedback > 0
            ? Math.round(
                feedbackData.reduce(
                    (total, feedback) =>
                        total + getConfidence(feedback),
                    0
                ) / totalFeedback
            )
            : 0;


    // =========================
    // FILTER FEEDBACK
    // =========================

    const filteredFeedback = useMemo(() => {
        const query = search.trim().toLowerCase();

        return feedbackData.filter((feedback) => {

            const matchesSearch =
                !query ||
                feedback.name?.toLowerCase().includes(query) ||
                feedback.message?.toLowerCase().includes(query) ||
                feedback.category?.toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === "All" ||
                feedback.status === statusFilter;

            const matchesSentiment =
                sentimentFilter === "All" ||
                feedback.sentiment === sentimentFilter;

            const matchesPriority =
                priorityFilter === "All" ||
                feedback.priority === priorityFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesSentiment &&
                matchesPriority
            );
        });
    }, [
        search,
        statusFilter,
        sentimentFilter,
        priorityFilter,
    ]);


    // =========================
    // CLEAR FILTERS
    // =========================

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setSentimentFilter("All");
        setPriorityFilter("All");
    };


    // =========================
    // RENDER
    // =========================

    return (
        <div className="feedback-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="feedback-header">

                <div>
                    <h1>Feedback Intelligence</h1>

                    <p>
                        Review customer feedback and discover AI-powered insights.
                    </p>
                </div>

                <div className="feedback-header-badge">
                    <span>✦</span>
                    AI Analysis Active
                </div>

            </div>


            {/* =========================
                SUMMARY CARDS
            ========================= */}

            <div className="feedback-summary">

                <div className="feedback-summary-card">
                    <span className="summary-icon">💬</span>

                    <div>
                        <p>Total Feedback</p>
                        <h2>{totalFeedback}</h2>
                    </div>
                </div>


                <div className="feedback-summary-card">
                    <span className="summary-icon">⏳</span>

                    <div>
                        <p>Pending Review</p>
                        <h2>{pendingFeedback}</h2>
                    </div>
                </div>


                <div className="feedback-summary-card">
                    <span className="summary-icon">🤖</span>

                    <div>
                        <p>AI Analyzed</p>
                        <h2>{averageConfidence}%</h2>
                    </div>
                </div>


                <div className="feedback-summary-card">
                    <span className="summary-icon">⚡</span>

                    <div>
                        <p>High Priority</p>
                        <h2>{highPriorityFeedback}</h2>
                    </div>
                </div>

            </div>


            {/* =========================
                FILTER TOOLBAR
            ========================= */}

            <div className="feedback-toolbar">

                <div className="feedback-search">

                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search feedback, name or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>


                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                    aria-label="Filter feedback by status"
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Approved">Approved</option>
                </select>


                <select
                    value={sentimentFilter}
                    onChange={(e) =>
                        setSentimentFilter(e.target.value)
                    }
                    aria-label="Filter feedback by sentiment"
                >
                    <option value="All">All Sentiment</option>
                    <option value="Positive">Positive</option>
                    <option value="Negative">Negative</option>
                    <option value="Neutral">Neutral</option>
                </select>


                <select
                    value={priorityFilter}
                    onChange={(e) =>
                        setPriorityFilter(e.target.value)
                    }
                    aria-label="Filter feedback by priority"
                >
                    <option value="All">All Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                </select>


                {(search ||
                    statusFilter !== "All" ||
                    sentimentFilter !== "All" ||
                    priorityFilter !== "All") && (

                    <button
                        type="button"
                        className="sort-button"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>
                )}

            </div>


            {/* =========================
                RESULTS HEADER
            ========================= */}

            <div className="feedback-results-header">

                <div>

                    <h2>Customer Feedback</h2>

                    <p>
                        {filteredFeedback.length} feedback items found
                    </p>

                </div>

            </div>


            {/* =========================
                FEEDBACK LIST
            ========================= */}

            <div className="feedback-list">

                {filteredFeedback.map((feedback) => {

                    const confidence = getConfidence(feedback);

                    return (
                        <div
                            className="feedback-card"
                            key={feedback.id}
                        >

                            {/* CARD HEADER */}

                            <div className="feedback-card-top">

                                <div className="feedback-user">

                                    <div className="feedback-avatar">
                                        {feedback.initial}
                                    </div>

                                    <div>
                                        <h3>{feedback.name}</h3>
                                        <span>Customer feedback</span>
                                    </div>

                                </div>


                                <span
                                    className={`priority-badge priority-${feedback.priority.toLowerCase()}`}
                                >
                                    {feedback.priority} Priority
                                </span>

                            </div>


                            {/* MESSAGE */}

                            <p className="feedback-message">
                                "{feedback.message}"
                            </p>


                            {/* AI ANALYSIS */}

                            <div className="feedback-analysis">

                                <div className="analysis-item">

                                    <span>Sentiment</span>

                                    <strong
                                        className={`sentiment-${feedback.sentiment.toLowerCase()}`}
                                    >
                                        {feedback.sentiment}
                                    </strong>

                                </div>


                                <div className="analysis-item">

                                    <span>Category</span>

                                    <strong>
                                        {feedback.category}
                                    </strong>

                                </div>


                                <div className="analysis-item">

                                    <span>AI Confidence</span>

                                    <strong>
                                        {confidence}%
                                    </strong>

                                </div>


                                <div className="analysis-item">

                                    <span>Status</span>

                                    <strong>
                                        {feedback.status}
                                    </strong>

                                </div>

                            </div>


                            {/* AI RECOMMENDATION */}

                            <div className="feedback-card-footer">

                                <div className="ai-recommendation">

                                    <span>✦</span>

                                    <div>
                                        <small>
                                            AI Recommendation
                                        </small>

                                        <p>
                                            {feedback.recommendation}
                                        </p>
                                    </div>

                                </div>


                                <button
                                    type="button"
                                    className="view-analysis-button"
                                    onClick={() =>
                                        setSelectedFeedback(feedback)
                                    }
                                >
                                    View Analysis →
                                </button>

                            </div>

                        </div>
                    );
                })}

            </div>


            {/* =========================
                EMPTY STATE
            ========================= */}

            {filteredFeedback.length === 0 && (

                <div className="feedback-empty">

                    <div>🔎</div>

                    <h3>No feedback found</h3>

                    <p>
                        Try changing your search or filters.
                    </p>

                    <button
                        type="button"
                        className="sort-button"
                        onClick={clearFilters}
                    >
                        Reset Filters
                    </button>

                </div>

            )}


            {/* =========================
                ANALYSIS MODAL
            ========================= */}

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

                        {/* MODAL HEADER */}

                        <div className="modal-header">

                            <div>

                                <span className="modal-label">
                                    AI FEEDBACK ANALYSIS
                                </span>

                                <h2>
                                    {selectedFeedback.name}'s Feedback
                                </h2>

                            </div>


                            <button
                                type="button"
                                className="modal-close"
                                onClick={() =>
                                    setSelectedFeedback(null)
                                }
                                aria-label="Close analysis"
                            >
                                ×
                            </button>

                        </div>


                        {/* CONFIDENCE */}

                        <div className="modal-score">

                            <div>

                                <span>
                                    AI Confidence Score
                                </span>

                                <strong>
                                    {getConfidence(selectedFeedback)}%
                                </strong>

                            </div>


                            <div className="score-bar">

                                <div
                                    style={{
                                        width: `${getConfidence(
                                            selectedFeedback
                                        )}%`,
                                    }}
                                />

                            </div>

                        </div>


                        {/* DETAILS */}

                        <div className="modal-grid">

                            <div>
                                <span>Sentiment</span>

                                <strong>
                                    {selectedFeedback.sentiment}
                                </strong>
                            </div>


                            <div>
                                <span>Category</span>

                                <strong>
                                    {selectedFeedback.category}
                                </strong>
                            </div>


                            <div>
                                <span>Priority</span>

                                <strong>
                                    {selectedFeedback.priority}
                                </strong>
                            </div>


                            <div>
                                <span>Status</span>

                                <strong>
                                    {selectedFeedback.status}
                                </strong>
                            </div>

                        </div>


                        {/* CUSTOMER FEEDBACK */}

                        <div className="modal-section">

                            <span>
                                Customer Feedback
                            </span>

                            <p>
                                "{selectedFeedback.message}"
                            </p>

                        </div>


                        {/* AI RECOMMENDATION */}

                        <div className="modal-recommendation">

                            <span>
                                ✦ AI Recommendation
                            </span>

                            <p>
                                {selectedFeedback.recommendation}
                            </p>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Feedback;