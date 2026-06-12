const colorMap = {
  orange:  { icon: "text-orange-500", badge: "bg-orange-50" },
  blue:    { icon: "text-blue-500",   badge: "bg-blue-50" },
  emerald: { icon: "text-emerald-500", badge: "bg-emerald-50" },
  purple:  { icon: "text-purple-500", badge: "bg-purple-50" },
  amber:   { icon: "text-amber-500",  badge: "bg-amber-50" },
  teal:    { icon: "text-teal-500",   badge: "bg-teal-50" },
  red:     { icon: "text-red-500",    badge: "bg-red-50" },
};

export default function StatCard({ title, value, icon, color = "orange" }) {
  const { icon: iconCls, badge } = colorMap[color] || colorMap.orange;
  return (
    <div className={`${badge} p-5 rounded-xl shadow-sm border border-white`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide leading-tight">
            {title}
          </p>
          <h2 className="text-3xl font-bold mt-2 text-slate-800">{value}</h2>
        </div>
        <div className={`${iconCls} opacity-80`}>{icon}</div>
      </div>
    </div>
  );
}