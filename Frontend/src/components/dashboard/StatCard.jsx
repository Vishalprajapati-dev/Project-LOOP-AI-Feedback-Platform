import "./StatCard.css";

function StatCard({ title, value, icon, growth }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">
        {icon}
      </div>

      <h3 className="stat-card-title">
        {title}
      </h3>

      <h1 className="stat-card-value">
        {value}
      </h1>

      <p className="stat-card-growth">
        {growth} this week
      </p>
    </div>
  );
}

export default StatCard;