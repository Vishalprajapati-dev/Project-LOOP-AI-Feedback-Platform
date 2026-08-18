import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

import { feedbackData } from "../../data/feedbackData";

const COLORS = [
    "#F59E0B",
    "#3B82F6",
    "#10B981",
];

function FeedbackPieChart() {

    const statusCounts = feedbackData.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
    }, {});

    const data = [
        {
            name: "Pending",
            value: statusCounts.Pending || 0,
        },
        {
            name: "Reviewed",
            value: statusCounts.Reviewed || 0,
        },
        {
            name: "Approved",
            value: statusCounts.Approved || 0,
        },
    ];

    return (
        <div className="dashboard-chart-card">

            <div className="dashboard-chart-header">

                <div>
                    <h2>Feedback Status</h2>

                    <p>
                        Current feedback distribution
                    </p>
                </div>

                <span className="chart-badge">
                    Live Data
                </span>

            </div>

            <div className="dashboard-pie-container">

                <ResponsiveContainer width="100%" height="100%">

                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            outerRadius={85}
                            innerRadius={0}
                            paddingAngle={2}
                            isAnimationActive={true}
                        >

                            {data.map((entry, index) => (
                                <Cell
                                    key={entry.name}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}

                        </Pie>

                        <Tooltip
                            contentStyle={{
                                background: "var(--bg-card)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "10px",
                                color: "var(--text-primary)",
                            }}
                        />

                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{
                                color: "var(--text-secondary)",
                                fontSize: "12px",
                            }}
                        />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}

export default FeedbackPieChart;