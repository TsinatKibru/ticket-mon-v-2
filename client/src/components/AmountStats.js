function AmountStats({ title, value, icon, colorIndex }) {
  const COLORS = ["primary", "secondary"];

  return (
    <div className="stats shadow w-full">
      <div className="stat">
        <div
          className={`stat-figure text-${
            COLORS[colorIndex % 2]
          } dark:text-slate-300`}
        >
          {icon}
        </div>
        <div className="stat-title dark:text-slate-300">{title}</div>
        <div
          className={`stat-value text-${
            COLORS[colorIndex % 2]
          } dark:text-slate-300`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

export default AmountStats;
