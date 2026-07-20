import "./StatCard.css";

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color = "green",
}) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">
        {Icon && <Icon size={26} />}
      </div>

      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <h2 className="stat-value">{value}</h2>

        {change && (
          <span className="stat-change">
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;