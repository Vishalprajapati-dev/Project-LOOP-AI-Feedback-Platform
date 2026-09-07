import { useState } from "react";
import "./Analytics.css";

import useAnalytics from "../../hooks/useAnalytics";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";


function Analytics() {

    const [range, setRange] =
        useState("Last 30 Days");

    const {
        analytics,
        loading,
        error,
        refresh,
    } = useAnalytics(range);


    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="analytics-page">

                <div className="analytics-header">
                    <div>
                        <h1>Feedback Analytics</h1>
                        <p>
                            Understand customer sentiment, trends and recurring issues.
                        </p>
                    </div>

                    <select
                        value={range}
                        onChange={(e) =>
                            setRange(e.target.value)
                        }
                    >
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>This Year</option>
                    </select>
                </div>

                <div className="analytics-panel">
                    <p>Loading analytics...</p>
                </div>

            </div>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <div className="analytics-page">

                <div className="analytics-header">
                    <div>
                        <h1>Feedback Analytics</h1>
                        <p>
                            Understand customer sentiment, trends and recurring issues.
                        </p>
                    </div>

                    <select
                        value={range}
                        onChange={(e) =>
                            setRange(e.target.value)
                        }
                    >
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>This Year</option>
                    </select>
                </div>

                <div className="analytics-panel">
                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={refresh}
                    >
                        Retry
                    </button>
                </div>

            </div>
        );
    }


    // =========================
    // REAL API DATA
    // =========================

    const data = analytics || {};

    const kpis = data.kpis || {};

    const sentimentData =
        data.sentimentTrend || [];

    const categoryData =
        data.categoryData || [];

    const insights =
        data.insights || [];

    const topIssues =
        data.topIssues || [];

    const actions =
        data.actions || [];


    return (
        <div className="analytics-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="analytics-header">

                <div>
                    <h1>
                        Feedback Analytics
                    </h1>

                    <p>
                        Understand customer sentiment, trends and recurring issues.
                    </p>
                </div>

                <select
                    value={range}
                    onChange={(e) =>
                        setRange(e.target.value)
                    }
                >
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>This Year</option>
                </select>

            </div>


            {/* =========================
                KPI CARDS
            ========================= */}

            <div className="analytics-kpis">

                <div className="analytics-kpi">

                    <span className="analytics-kpi-icon">
                        😊
                    </span>

                    <div>
                        <span>
                            Overall Sentiment
                        </span>

                        <strong>
                            {kpis.overall ?? "0%"}
                        </strong>

                        <small className="positive-text">
                            Current period
                        </small>
                    </div>

                </div>


                <div className="analytics-kpi">

                    <span className="analytics-kpi-icon">
                        👍
                    </span>

                    <div>
                        <span>
                            Positive Feedback
                        </span>

                        <strong>
                            {kpis.positive ?? "0%"}
                        </strong>

                        <small className="positive-text">
                            Current period
                        </small>
                    </div>

                </div>


                <div className="analytics-kpi">

                    <span className="analytics-kpi-icon">
                        ⚠️
                    </span>

                    <div>
                        <span>
                            Negative Feedback
                        </span>

                        <strong>
                            {kpis.negative ?? "0%"}
                        </strong>

                        <small className="negative-text">
                            Current period
                        </small>
                    </div>

                </div>


                <div className="analytics-kpi">

                    <span className="analytics-kpi-icon">
                        ✨
                    </span>

                    <div>
                        <span>
                            AI Confidence
                        </span>

                        <strong>
                            {kpis.confidence ?? "0%"}
                        </strong>

                        <small className="positive-text">
                            AI analysis
                        </small>
                    </div>

                </div>

            </div>


            {/* =========================
                CHARTS
            ========================= */}

            <div className="analytics-charts">

                {/* SENTIMENT */}

                <div className="analytics-panel sentiment-panel">

                    <div className="panel-header">

                        <div>
                            <h2>
                                Sentiment Trend
                            </h2>

                            <p>
                                Customer sentiment over time
                            </p>
                        </div>

                        <span className="panel-badge">
                            AI Analyzed
                        </span>

                    </div>


                    <div className="chart-container">

                        {sentimentData.length > 0 ? (

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <LineChart
                                    data={sentimentData}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="label"
                                    />

                                    <YAxis />

                                    <Tooltip />


                                    <Line
                                        type="monotone"
                                        dataKey="positive"
                                        stroke="#16a34a"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                    />


                                    <Line
                                        type="monotone"
                                        dataKey="negative"
                                        stroke="#ef4444"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                    />


                                    <Line
                                        type="monotone"
                                        dataKey="neutral"
                                        stroke="#64748b"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        ) : (

                            <div>
                                No sentiment data available yet.
                            </div>

                        )}

                    </div>


                    <div className="chart-legend">

                        <span>
                            <i className="legend-positive" />
                            Positive
                        </span>

                        <span>
                            <i className="legend-negative" />
                            Negative
                        </span>

                        <span>
                            <i className="legend-neutral" />
                            Neutral
                        </span>

                    </div>

                </div>


                {/* CATEGORIES */}

                <div className="analytics-panel">

                    <div className="panel-header">

                        <div>
                            <h2>
                                Top Feedback Categories
                            </h2>

                            <p>
                                Most frequently mentioned topics
                            </p>
                        </div>

                    </div>


                    <div className="category-chart">

                        {categoryData.length > 0 ? (

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <BarChart
                                    data={categoryData}
                                    layout="vertical"
                                    margin={{
                                        top: 10,
                                        right: 20,
                                        left: 20,
                                        bottom: 10,
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        type="number"
                                    />

                                    <YAxis
                                        type="category"
                                        dataKey="category"
                                        width={90}
                                    />

                                    <Tooltip />

                                    <Bar
                                        dataKey="count"
                                        fill="#2563eb"
                                        radius={[
                                            0,
                                            6,
                                            6,
                                            0,
                                        ]}
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        ) : (

                            <div>
                                No category data available yet.
                            </div>

                        )}

                    </div>

                </div>

            </div>


            {/* =========================
                AI INSIGHTS
            ========================= */}

            <div className="analytics-panel insights-panel">

                <div className="panel-header">

                    <div>

                        <h2>
                            Automated Insights
                        </h2>

                        <p>
                            Automatically detected patterns from customer feedback
                        </p>

                    </div>

                    <span className="ai-insight-badge">
                        ✨ Automated Insights
                    </span>

                </div>


                <div className="insights-grid">

                    {insights.length > 0 ? (

                        insights.map(
                            (insight, index) => (

                                <div
                                    className={`insight-card ${insight.type || ""
                                        }`}
                                    key={index}
                                >

                                    <div className="insight-icon">
                                        {insight.icon || "✨"}
                                    </div>

                                    <div>

                                        <h3>
                                            {insight.title}
                                        </h3>

                                        <p>
                                            {insight.description}
                                        </p>

                                    </div>

                                </div>

                            )
                        )

                    ) : (

                        <p>
                            No AI insights available yet.
                        </p>

                    )}

                </div>

            </div>


            {/* =========================
                ISSUES + ACTIONS
            ========================= */}

            <div className="analytics-bottom">

                {/* TOP ISSUES */}

                <div className="analytics-panel">

                    <div className="panel-header">

                        <div>
                            <h2>
                                Top Issues
                            </h2>

                            <p>
                                Issues requiring attention
                            </p>
                        </div>

                    </div>


                    <div className="issue-list">

                        {topIssues.length > 0 ? (

                            topIssues.map(
                                (issue, index) => (

                                    <div
                                        className="issue-row"
                                        key={index}
                                    >

                                        <span>
                                            {issue.name ||
                                                issue.category ||
                                                "Issue"}
                                        </span>

                                        <strong>
                                            {issue.percentage != null
                                                ? String(issue.percentage).includes("%")
                                                    ? issue.percentage
                                                    : `${issue.percentage}%`
                                                : issue.value ?? issue.count ?? 0}
                                        </strong>

                                    </div>

                                )
                            )

                        ) : (

                            <p>
                                No major issues detected yet.
                            </p>

                        )}

                    </div>

                </div>


                {/* ACTIONS */}

                <div className="analytics-panel">

                    <div className="panel-header">

                        <div>
                            <h2>
                                Recommended Actions
                            </h2>

                            <p>
                                AI-generated actions for your team
                            </p>
                        </div>

                    </div>


                    <div className="action-list">

                        {actions.length > 0 ? (

                            actions.map(
                                (action, index) => (

                                    <div
                                        className="action-row"
                                        key={index}
                                    >

                                        <span>
                                            {String(
                                                index + 1
                                            ).padStart(2, "0")}
                                        </span>

                                        <p>
                                            {typeof action ===
                                                "string"
                                                ? action
                                                : action.action ||
                                                action.title ||
                                                action.description ||
                                                "Recommended action"}
                                        </p>

                                    </div>

                                )
                            )

                        ) : (

                            <p>
                                No recommendations available yet.
                            </p>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}


export default Analytics;