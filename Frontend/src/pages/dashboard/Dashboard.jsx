import "./Dashboard.css";

import StatCard from "../../components/dashboard/StatCard";
import FeedbackTable from "../../components/dashboard/FeedbackTable";
import FeedbackChart from "../../components/dashboard/FeedbackChart";
import FeedbackPieChart from "../../components/dashboard/FeedbackPieChart";

import { feedbackData } from "../../data/feedbackData";

function Dashboard() {

    // =========================
    // DASHBOARD METRICS
    // =========================

    const totalFeedback = feedbackData.length;

    const pendingFeedback = feedbackData.filter(
        (item) => item.status === "Pending"
    ).length;

    const resolvedFeedback = feedbackData.filter(
        (item) =>
            item.status === "Reviewed" ||
            item.status === "Approved"
    ).length;

    const averageConfidence =
        totalFeedback > 0
            ? Math.round(
                feedbackData.reduce(
                    (total, item) => total + item.confidence,
                    0
                ) / totalFeedback
            )
            : 0;


    // =========================
    // STAT CARDS
    // =========================

    const stats = [
        {
            title: "Total Feedback",
            value: totalFeedback,
            icon: "📊",
            growth: "Live data",
        },
        {
            title: "Pending Review",
            value: pendingFeedback,
            icon: "⏳",
            growth: "Needs attention",
        },
        {
            title: "Resolved",
            value: resolvedFeedback,
            icon: "✅",
            growth: "Processed",
        },
        {
            title: "AI Confidence",
            value: `${averageConfidence}%`,
            icon: "🤖",
            growth: "AI analysis",
        },
    ];


    return (
        <div className="dashboard-page">

            <div className="dashboard-container">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="dashboard-header">

                    <h1>
                        Welcome Vishal 👋
                    </h1>

                    <p>
                        AI Intelligence Feedback Platform
                    </p>

                </div>


                {/* =========================
                    STAT CARDS
                ========================= */}

                <div className="stats-grid">

                    {stats.map((item) => (
                        <StatCard
                            key={item.title}
                            title={item.title}
                            value={item.value}
                            icon={item.icon}
                            growth={item.growth}
                        />
                    ))}

                </div>


                {/* =========================
                    CHARTS
                ========================= */}

                <div className="charts-grid">

                    <div className="chart-large">
                        <FeedbackChart />
                    </div>

                    <div className="chart-small">
                        <FeedbackPieChart />
                    </div>

                </div>


                {/* =========================
                    RECENT FEEDBACK
                ========================= */}

                <div className="feedback-section">

                    <FeedbackTable />

                </div>

            </div>

        </div>
    );
}

export default Dashboard;