import "./Dashboard.css";

import StatCard from "../../components/dashboard/StatCard";
import FeedbackTable from "../../components/dashboard/FeedbackTable";
import FeedbackChart from "../../components/dashboard/FeedbackChart";
import FeedbackPieChart from "../../components/dashboard/FeedbackPieChart";

import useDashboard from "../../hooks/useDashboard";


function Dashboard() {

    // =========================
    // LOAD REAL DASHBOARD DATA
    // =========================

    const {
        dashboard,
        loading,
        error,
    } = useDashboard();


    // =========================
    // LOADING STATE
    // =========================

    if (loading) {
        return (
            <div className="dashboard-page">

                <div className="dashboard-container">

                    <p>
                        Loading dashboard...
                    </p>

                </div>

            </div>
        );
    }


    // =========================
    // ERROR STATE
    // =========================

    if (error) {
        return (
            <div className="dashboard-page">

                <div className="dashboard-container">

                    <p>
                        {error}
                    </p>

                </div>

            </div>
        );
    }


    // =========================
    // REAL DATABASE STATS
    // =========================

    const dashboardStats =
        dashboard?.stats || {
            totalFeedback: 0,
            pendingReview: 0,
            actioned: 0,
            aiAnalyzed: 0,
            aiConfidence: 0,
            highPriority: 0,
        };


    // =========================
    // STAT CARDS
    // =========================

    const stats = [
        {
            title: "Total Feedback",
            value: dashboardStats.totalFeedback,
            icon: "📊",
            growth: "Live data",
        },
        {
            title: "Pending Review",
            value: dashboardStats.pendingReview,
            icon: "⏳",
            growth: "Needs attention",
        },
        {
            title: "Actioned",
            value: dashboardStats.actioned,
            icon: "✅",
            growth: "Processed",
        },
        {
            title: "AI Confidence",
            value: `${dashboardStats.aiConfidence}%`,
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
                        <FeedbackChart
                            feedback={
                                dashboard?.recentFeedback || []
                            }
                        />
                    </div>

                    <div className="chart-small">
                        <FeedbackPieChart
                            statusDistribution={
                                dashboard?.statusDistribution || {}
                            }
                        />
                    </div>

                </div>


                {/* =========================
                    RECENT FEEDBACK
                ========================= */}

                <div className="feedback-section">

                    <FeedbackTable
                        feedback={
                            dashboard?.recentFeedback || []
                        }
                    />

                </div>

            </div>

        </div>
    );
}


export default Dashboard;