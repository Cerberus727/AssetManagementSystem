import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import { getPurchaseOrder } from "../../services/purchaseOrderService";
import { Pencil, Monitor, User, MapPin, Calendar, Package, TrendingUp } from "lucide-react";

export default function PurchaseOrderDetails() {
  const { id } = useParams();
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPO();
  }, []);

  const loadPO = async () => {
    try {
      setLoading(true);
      const res = await getPurchaseOrder(id);
      setPo(res.data?.purchaseOrder || null);
    } catch (err) {
      console.error(err);
      setError("Failed to load purchase order");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-");
  const fmtCurrency = (n) => `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  if (loading) {
    return (
      <PageLayout title="Purchase Order Details">
        <div className="flex items-center justify-center h-48 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-3" />
          Loading...
        </div>
      </PageLayout>
    );
  }

  if (error || !po) {
    return (
      <PageLayout title="Purchase Order Details">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error || "Purchase order not found"}
        </div>
      </PageLayout>
    );
  }

  const inventoryPct = po.ordered_qty > 0 ? Math.round(((po.ordered_qty - po.assets_created) / po.ordered_qty) * 100) : 0;

  return (
    <PageLayout title={`PO: ${po.po_no}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-slate-500">Purchase Order</p>
          <h1 className="text-2xl font-bold text-orange-600 font-mono">{po.po_no}</h1>
        </div>
        <Link
          to={`/purchase-orders/${po.po_no}/edit`}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Pencil size={15} />
          Edit PO
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Inventory bar */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow p-5">
          <p className="text-sm font-medium text-slate-600 mb-3">Inventory Status</p>
          <div className="flex items-center gap-6 mb-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">{po.ordered_qty}</p>
              <p className="text-xs text-slate-500">Ordered</p>
            </div>
            <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all"
                style={{ width: `${inventoryPct}%` }}
              />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{po.available_qty}</p>
              <p className="text-xs text-slate-500">Available</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{po.assets_created}</p>
              <p className="text-xs text-slate-500">Created</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* PO Details */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Package size={16} className="text-orange-500" /> Order Details
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Vendor</dt>
              <dd className="font-medium text-slate-800">{po.vendor?.company_name || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Category</dt>
              <dd className="font-medium text-slate-800">{po.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Sub Category</dt>
              <dd className="font-medium text-slate-800">{po.sub_category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Unit Cost</dt>
              <dd className="font-medium text-slate-800">{fmtCurrency(po.unit_cost)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Total Value</dt>
              <dd className="font-bold text-slate-800">{fmtCurrency(po.unit_cost * po.ordered_qty)}</dd>
            </div>
          </dl>
        </div>

        {/* Dates */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-orange-500" /> Dates
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Capitalized Date</dt>
              <dd className="font-medium text-slate-800">{fmt(po.capitalized_date)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Warranty Expiry</dt>
              <dd className="font-medium text-slate-800">{fmt(po.warranty_expiry)}</dd>
            </div>
          </dl>
          {po.description && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Description</p>
              <p className="text-sm text-slate-700">{po.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Assets from this PO */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Monitor size={16} className="text-orange-500" /> Assets Created from This PO
          <span className="ml-auto text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
            {po.assets?.length || 0} asset(s)
          </span>
        </h2>
        {po.assets?.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No assets created from this PO yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500 border-b border-slate-100">
              <tr>
                <th className="pb-2 font-medium">Asset Tag</th>
                <th className="pb-2 font-medium">Model</th>
                <th className="pb-2 font-medium">Serial #</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Assigned To</th>
                <th className="pb-2 font-medium">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {po.assets.map((asset) => (
                <tr key={asset.asset_id} className="hover:bg-slate-50">
                  <td className="py-2 font-mono font-semibold text-orange-600">
                    <Link to={`/assets/${asset.asset_id}`} className="hover:underline">
                      {asset.asset_tag}
                    </Link>
                  </td>
                  <td className="py-2 text-slate-700">{asset.model_number}</td>
                  <td className="py-2 text-slate-500 font-mono text-xs">{asset.serial_number}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      asset.status === "ALLOCATED" ? "bg-blue-100 text-blue-700" :
                      asset.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-700" :
                      asset.status === "REPAIR" ? "bg-amber-100 text-amber-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-2 text-slate-600">
                    {asset.employee ? `${asset.employee.first_name} ${asset.employee.last_name}` : "—"}
                  </td>
                  <td className="py-2 text-slate-600">
                    {asset.location
                      ? `${asset.location.building_name} - ${asset.location.floor} - ${asset.location.room_number}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PageLayout>
  );
}
