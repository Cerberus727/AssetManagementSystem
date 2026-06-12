import { useState, useEffect } from "react";
import PageLayout from "../../components/layout/PageLayout";
import { getAllocations } from "../../services/assetAllocationService";
import { Search } from "lucide-react";

export default function AllocationList() {
  const [allocations, setAllocations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAllocations();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      allocations.filter(
        (a) =>
          (a.asset?.asset_tag || "").toLowerCase().includes(q) ||
          (a.employee?.first_name + " " + a.employee?.last_name).toLowerCase().includes(q) ||
          (a.asset?.category || "").toLowerCase().includes(q) ||
          (a.location?.building_name || "").toLowerCase().includes(q)
      )
    );
  }, [search, allocations]);

  const loadAllocations = async () => {
    try {
      setLoading(true);
      const res = await getAllocations();
      const allocs = res.data?.allocations || [];
      setAllocations(Array.isArray(allocs) ? allocs : []);
      setFiltered(Array.isArray(allocs) ? allocs : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load allocation history");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  if (loading) {
    return (
      <PageLayout title="Asset Allocation History">
        <div className="flex items-center justify-center h-48 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-3" />
          Loading allocation history...
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Asset Allocation History">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">{error}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Asset Allocation History">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by employee, asset, category, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-sm text-slate-500">
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Asset Tag</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Allocated At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-400">
                  {search ? "No records match your search." : "No allocation records yet."}
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.allocation_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-800">
                      {a.employee ? `${a.employee.first_name} ${a.employee.last_name}` : "—"}
                    </p>
                    <p className="text-xs text-slate-400">{a.employee?.email}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm font-semibold text-orange-600">
                    {a.asset?.asset_tag || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {a.asset?.category || "—"}
                    {a.asset?.sub_category && (
                      <span className="block text-xs text-slate-400">{a.asset.sub_category}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {a.location
                      ? `${a.location.building_name} - Fl.${a.location.floor} - ${a.location.room_number}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{fmt(a.allocated_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
}
