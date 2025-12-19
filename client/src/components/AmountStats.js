function AmountStats({ title, value, icon, colorIndex }) {
  return (
    <div className="glass-effect glass-item rounded-2xl p-5 flex items-center justify-between hover:bg-base-200/30 transition-all">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold text-base-content/50 uppercase tracking-widest font-outfit">{title}</p>
          <p className="text-xl font-bold text-base-content mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default AmountStats;
