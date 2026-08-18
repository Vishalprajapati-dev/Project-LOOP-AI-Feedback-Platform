import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { feedbackData } from "../../data/feedbackData";

function FeedbackChart() {

    const data = feedbackData
        .slice()
        .sort(
            (a, b) =>
                new Date(a.createdAt) - new Date(b.createdAt)
        )
        .map((item) => ({
            date: new Date(item.createdAt).toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                }
            ),
            confidence: item.confidence,
        }));

    return (
        <div className="dashboard-chart-card">

            <div className="dashboard-chart-header">
                <div>
                    <h2>AI Confidence Overview</h2>

                    <p>
                        AI analysis confidence across recent feedback
                    </p>
                </div>

                <span className="chart-badge">
                    AI Analysis
                </span>
            </div>

            <div className="dashboard-chart-container">

                <ResponsiveContainer width="100%" height="100%">

                    <LineChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 5,
                        }}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--chart-grid)"
                        />

                        <XAxis
                            dataKey="date"
                            tick={{
                                fill: "var(--chart-text)",
                                fontSize: 12,
                            }}
                            axisLine={{
                                stroke: "var(--chart-grid)",
                            }}
                            tickLine={false}
                        />

                        <YAxis
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                            tick={{
                                fill: "var(--chart-text)",
                                fontSize: 12,
                            }}
                            axisLine={{
                                stroke: "var(--chart-grid)",
                            }}
                            tickLine={false}
                        />

                        <Tooltip
                            formatter={(value) => [
                                `${value}%`,
                                "AI Confidence",
                            ]}
                            contentStyle={{
                                background: "var(--bg-card)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "10px",
                                color: "var(--text-primary)",
                            }}
                            labelStyle={{
                                color: "var(--text-secondary)",
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="confidence"
                            stroke="#4F46E5"
                            strokeWidth={3}
                            dot={{
                                r: 4,
                                fill: "#4F46E5",
                            }}
                            activeDot={{
                                r: 6,
                                fill: "#4F46E5",
                            }}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}

export default FeedbackChart;