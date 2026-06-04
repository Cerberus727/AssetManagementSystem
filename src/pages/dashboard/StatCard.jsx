export default function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div className="text-orange-500">
          {icon}
        </div>
      </div>
    </div>
  );
}