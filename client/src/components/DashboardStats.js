function DashboardStats({ title, icon, value, description, colorIndex }) {
  return (
    <div className="glass-effect glass-item rounded-2xl p-6 border border-white/5 shadow-xl hover:bg-white/[0.05] transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-neutral-content/60 font-outfit uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-neutral-content/40 leading-relaxed">
          {description}
        </span>
      </div>
    </div>
  );
}

export default DashboardStats;
