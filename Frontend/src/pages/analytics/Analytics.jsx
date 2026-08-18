import { useState } from "react";
import "./Analytics.css";

import {
    kpiDataByRange,
    sentimentDataByRange,
    categoryDataByRange,
} from "../../data/analyticsData";

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


const insights = [
    {
        type: "critical",
        icon: "⚠️",
        title: "Checkout experience is the biggest pain point",
        description:
            "Negative feedback around checkout has increased and requires immediate attention.",
    },
    {
        type: "positive",
        icon: "✦",
        title: "Customer support sentiment is improving",
        description:
            "Positive support-related feedback increased by 18% compared with the previous period.",
    },
    {
        type: "warning",
        icon: "↗",
        title: "Navigation complaints are increasing",
        description:
            "Users are reporting difficulty finding important actions across the platform.",
    },
];

const detailsByRange = {
    "Last 7 Days": {
        insights: [
            {
                type: "critical",
                icon: "⚠️",
                title: "Checkout issues need attention",
                description:
                    "Negative checkout feedback increased during the last 7 days.",
            },
            {
                type: "positive",
                icon: "✦",
                title: "Customer support is improving",
                description:
                    "Positive support feedback increased compared with the previous period.",
            },
            {
                type: "warning",
                icon: "↗",
                title: "Navigation complaints remain active",
                description:
                    "Users are still reporting difficulty finding important actions.",
            },
        ],
        issues: [
            { name: "Checkout Experience", value: "28%" },
            { name: "Navigation", value: "22%" },
            { name: "Performance", value: "16%" },
            { name: "Customer Support", value: "12%" },
        ],
        actions: [
            "Simplify the checkout flow",
            "Improve navigation discoverability",
            "Optimize mobile performance",
            "Maintain fast support response times",
        ],
    },

    "Last 30 Days": {
        insights: [
            {
                type: "critical",
                icon: "⚠️",
                title: "Checkout experience is the biggest pain point",
                description:
                    "Negative feedback around checkout has increased and requires immediate attention.",
            },
            {
                type: "positive",
                icon: "✦",
                title: "Customer support sentiment is improving",
                description:
                    "Positive support-related feedback increased by 18% compared with the previous period.",
            },
            {
                type: "warning",
                icon: "↗",
                title: "Navigation complaints are increasing",
                description:
                    "Users are reporting difficulty finding important actions across the platform.",
            },
        ],
        issues: [
            { name: "Checkout Experience", value: "32%" },
            { name: "Navigation", value: "24%" },
            { name: "Performance", value: "18%" },
            { name: "Customer Support", value: "14%" },
        ],
        actions: [
            "Simplify the checkout flow",
            "Improve navigation discoverability",
            "Optimize mobile performance",
            "Maintain fast support response times",
        ],
    },

    "Last 90 Days": {
        insights: [
            {
                type: "critical",
                icon: "⚠️",
                title: "Checkout remains the top issue",
                description:
                    "Checkout-related negative feedback continues to be the largest recurring issue.",
            },
            {
                type: "positive",
                icon: "✦",
                title: "Support experience is trending positively",
                description:
                    "Customer support feedback shows consistent improvement over the period.",
            },
            {
                type: "warning",
                icon: "↗",
                title: "Navigation needs improvement",
                description:
                    "Navigation remains one of the most frequently reported customer concerns.",
            },
        ],
        issues: [
            { name: "Checkout Experience", value: "35%" },
            { name: "Navigation", value: "27%" },
            { name: "Performance", value: "21%" },
            { name: "Customer Support", value: "16%" },
        ],
        actions: [
            "Redesign the checkout experience",
            "Improve navigation structure",
            "Optimize application performance",
            "Strengthen customer support workflows",
        ],
    },

    "This Year": {
        insights: [
            {
                type: "critical",
                icon: "⚠️",
                title: "Checkout is the primary long-term concern",
                description:
                    "Checkout experience has generated the highest amount of negative feedback this year.",
            },
            {
                type: "positive",
                icon: "✦",
                title: "Customer support continues to improve",
                description:
                    "Support-related sentiment has shown a positive long-term trend.",
            },
            {
                type: "warning",
                icon: "↗",
                title: "Navigation remains a recurring issue",
                description:
                    "Navigation difficulties continue to appear across customer feedback.",
            },
        ],
        issues: [
            { name: "Checkout Experience", value: "38%" },
            { name: "Navigation", value: "29%" },
            { name: "Performance", value: "23%" },
            { name: "Customer Support", value: "18%" },
        ],
        actions: [
            "Prioritize checkout improvements",
            "Redesign navigation experience",
            "Improve overall platform performance",
            "Continue improving support response times",
        ],
    },
};


function Analytics() {
    const [range, setRange] = useState("Last 30 Days");
    const currentDetails =
    detailsByRange[range] || detailsByRange["Last 30 Days"];

    const categoryData = categoryDataByRange[range];
    const sentimentData = sentimentDataByRange[range];
    const kpiData = kpiDataByRange[range];

    return (
        <div className="analytics-page">

            {/* Header */}
            <div className="analytics-header">

                <div>
                    <h1>Feedback Analytics</h1>

                    <p>
                        Understand customer sentiment, trends and recurring issues.
                    </p>
                </div>

                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                >
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>This Year</option>
                </select>

            </div>

            {/* KPI Cards */}
            <div className="analytics-kpis">

                <div className="analytics-kpi">
                    <span className="analytics-kpi-icon">😊</span>

                    <div>
                        <span>Overall Sentiment</span>
                        <strong>{kpiData.overall}</strong>

                        <small className="positive-text">
                            +8.4% this period
                        </small>
                    </div>
                </div>

                <div className="analytics-kpi">
                    <span className="analytics-kpi-icon">👍</span>

                    <div>
                        <span>Positive Feedback</span>
                        <strong>{kpiData.positive}</strong>

                        <small className="positive-text">
                            +12% this period
                        </small>
                    </div>
                </div>

                <div className="analytics-kpi">
                    <span className="analytics-kpi-icon">⚠️</span>

                    <div>
                        <span>Negative Feedback</span>
                        <strong>{kpiData.negative}</strong>

                        <small className="negative-text">
                            -6% this period
                        </small>
                    </div>
                </div>

                <div className="analytics-kpi">
                    <span className="analytics-kpi-icon">✦</span>

                    <div>
                        <span>AI Confidence</span>
                        <strong>{kpiData.confidence}</strong>

                        <small className="positive-text">
                            +4% this period
                        </small>
                    </div>
                </div>

            </div>

            {/* Charts */}
            <div className="analytics-charts">

                <div className="analytics-panel sentiment-panel">

                    <div className="panel-header">
                        <div>
                            <h2>Sentiment Trend</h2>
                            <p>Customer sentiment over time</p>
                        </div>

                        <span className="panel-badge">
                            AI Analyzed
                        </span>
                    </div>

                    <div className="chart-container">

                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sentimentData}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="month" />

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


                <div className="analytics-panel">

                    <div className="panel-header">

                        <div>
                            <h2>Top Feedback Categories</h2>
                            <p>Most frequently mentioned topics</p>
                        </div>

                    </div>

                    <div className="category-chart">

                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={categoryData}
                                layout="vertical"
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 20,
                                    bottom: 10
                                }}
                            >

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis type="number" />

                                <YAxis
                                    type="category"
                                    dataKey="category"
                                    width={90}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="count"
                                    fill="#2563eb"
                                    radius={[0, 6, 6, 0]}
                                />

                            </BarChart>
                        </ResponsiveContainer>

                    </div>

                </div>

            </div>

            {/* AI Insights */}
            <div className="analytics-panel insights-panel">

                <div className="panel-header">

                    <div>
                        <h2>AI Insights</h2>

                        <p>
                            Automatically detected patterns from customer feedback
                        </p>
                    </div>

                    <span className="ai-insight-badge">
                        ✦ AI Generated
                    </span>

                </div>

                <div className="insights-grid">

                    {currentDetails.insights.map((insight, index) => (
                        <div
                            className={`insight-card ${insight.type}`}
                            key={index}
                        >

                            <div className="insight-icon">
                                {insight.icon}
                            </div>

                            <div>
                                <h3>{insight.title}</h3>

                                <p>
                                    {insight.description}
                                </p>
                            </div>

                        </div>
                    ))}

                </div>

            </div>

            {/* Issues */}
            <div className="analytics-bottom">

                <div className="analytics-panel">

                    <div className="panel-header">

                        <div>
                            <h2>Top Issues</h2>
                            <p>Issues requiring attention</p>
                        </div>

                    </div>

                    <div className="issue-list">

                        {currentDetails.issues.map((issue, index) => (
                            <div className="issue-row" key={index}>
                                <span>{issue.name}</span>
                                <strong>{issue.value}</strong>
                            </div>
                        ))}

                    </div>

                </div>


                <div className="analytics-panel">

                    <div className="panel-header">

                        <div>
                            <h2>Recommended Actions</h2>
                            <p>AI-generated actions for your team</p>
                        </div>

                    </div>

                    <div className="action-list">
                        {currentDetails.actions.map((action, index) => (
                            <div className="action-row" key={index}>
                                <span>{String(index + 1).padStart(2, "0")}</span>
                                <p>{action}</p>
                            </div>
                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Analytics;