import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#F59E0B",
  "#3B82F6",
  "#10B981",
];

function FeedbackPieChart({
  statusDistribution = {},
}) {
  const data = [
    {
      name: "New",
      value: statusDistribution.new || 0,
    },
    {
      name: "Reviewed",
      value: statusDistribution.reviewed || 0,
    },
    {
      name: "Actioned",
      value: statusDistribution.actioned || 0,
    },
  ];

  const hasData = data.some(
    (item) => item.value > 0
  );

  const visibleData = data.filter(
    (item) => item.value > 0
  );

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
        {!hasData ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
              fontSize: "13px",
            }}
          >
            No feedback available yet.
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={visibleData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius={85}
                innerRadius={0}
                paddingAngle={2}
                isAnimationActive={true}
              >
                {visibleData.map(
                  (entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={
                        COLORS[
                          index % COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border:
                    "1px solid var(--border-color)",
                  borderRadius: "10px",
                  color: "var(--text-primary)",
                }}
              />

              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{
                  color:
                    "var(--text-secondary)",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default FeedbackPieChart;