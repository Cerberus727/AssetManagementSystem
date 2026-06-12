import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import { getPurchaseOrders, deletePurchaseOrder } from "../../services/purchaseOrderService";
import { ShoppingCart, Plus, Search, Trash2, Eye, Pencil, Package } from "lucide-react";

export default function PurchaseOrderList() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      purchaseOrders.filter(
        (po) =>
          po.po_no.toLowerCase().includes(q) ||
          po.category.toLowerCase().includes(q) ||
          (po.vendor?.company_name || "").toLowerCase().includes(q)
      )
    );
  }, [search, purchaseOrders]);

  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      const res = await getPurchaseOrders();
      const pos = res.data?.purchaseOrders || [];
      setPurchaseOrders(Array.isArray(pos) ? pos : []);
      setFiltered(Array.isArray(pos) ? pos : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load purchase orders");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (po_no) => {
    if (!confirm(`Delete Purchase Order "${po_no}"? This cannot be undone.`)) return;
    try {
      setDeletingId(po_no);
      await deletePurchaseOrder(po_no);
      await loadPurchaseOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete purchase order");
    } finally {
      setDeletingId(null);
    }
  };

  const getInventoryBadge = (available_qty, ordered_qty) => {
    const pct = (available_qty / ordered_qty) * 100;
    if (available_qty <= 0) return { label: "Depleted", cls: "bg-red-100 text-red-700" };
    if (pct <= 20) return { label: "Low Stock", cls: "bg-amber-100 text-amber-700" };
    return { label: "In Stock", cls: "bg-emerald-100 text-emerald-700" };
  };

  if (loading) {
    return (
      <PageLayout title="Purchase Orders">
        <div className="flex items-center justify-center h-48 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-3" />
          Loading purchase orders...
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Purchase Orders">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">{error}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Purchase Orders">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by PO #, category, or vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
        <Link
          to="/purchase-orders/new"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New Purchase Order
        </Link>
      </div>

      {/* Summary chips */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm">
          <Package size={15} className="text-orange-500" />
          <span className="text-slate-600">Total POs:</span>
          <span className="font-bold text-slate-800">{purchaseOrders.length}</span>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm">
          <ShoppingCart size={15} className="text-blue-500" />
          <span className="text-slate-600">Total Ordered:</span>
          <span className="font-bold text-slate-800">
            {purchaseOrders.reduce((s, p) => s + p.ordered_qty, 0)}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm">
          <span className="text-slate-600">Assets Created:</span>
          <span className="font-bold text-slate-800">
            {purchaseOrders.reduce((s, p) => s + (p.assets_created || 0), 0)}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-sm text-slate-500">
              <th className="px-4 py-3 font-medium">PO Number</th>
              <th className="px-4 py-3 font-medium">Vendor</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Ordered</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Available</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400">
                  {search ? "No purchase orders match your search." : "No purchase orders yet. Create your first one!"}
                </td>
              </tr>
            ) : (
              filtered.map((po) => {
                const badge = getInventoryBadge(po.available_qty, po.ordered_qty);
                return (
                  <tr key={po.po_no} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm font-semibold text-orange-600">{po.po_no}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{po.vendor?.company_name || "-"}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="text-slate-700">{po.category}</span>
                      {po.sub_category && (
                        <span className="block text-xs text-slate-400">{po.sub_category}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{po.ordered_qty}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{po.assets_created}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{po.available_qty}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/purchase-orders/${po.po_no}`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/purchase-orders/${po.po_no}/edit`}
                          className="p-1.5 text-slate-400 hover:text-orange-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(po.po_no)}
                          disabled={deletingId === po.po_no}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-40"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
}
