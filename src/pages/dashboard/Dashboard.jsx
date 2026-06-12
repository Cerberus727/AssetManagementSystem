import { useEffect, useState } from "react";
import PageLayout from "../../components/layout/PageLayout";
import {
  Monitor, Users, MapPin, Building2, Ticket,
  ShoppingCart, Package, CheckCircle, Archive, TrendingUp,
} from "lucide-react";
import StatCard from "./StatCard";
import { getAssets } from "../../services/assetService";
import { getEmployees } from "../../services/employeeService";
import { getLocations } from "../../services/locationService";
import { getVendors } from "../../services/vendorService";
import { getTickets } from "../../services/ticketService";
import { getPurchaseOrders } from "../../services/purchaseOrderService";
import { getAllocations } from "../../services/assetAllocationService";

export default function Dashboard() {
  const [stats, setStats] = useState({
    assets: 0, employees: 0, locations: 0, vendors: 0, tickets: 0,
    allocatedAssets: 0, availableAssets: 0, totalPOs: 0,
    totalInventoryPurchased: 0, assetsCreated: 0, availableInventory: 0,
  });
  const [recentAllocations, setRecentAllocations] = useState([]);
  const [poSummary, setPoSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [assetsRes, employeesRes, locationsRes, vendorsRes, ticketsRes, posRes, allocRes] =
        await Promise.all([
          getAssets(), getEmployees(), getLocations(), getVendors(),
          getTickets(), getPurchaseOrders(), getAllocations(),
        ]);

      const assets    = Array.isArray(assetsRes.data?.assets) ? assetsRes.data.assets : [];
      const employees = Array.isArray(employeesRes.data?.employees) ? employeesRes.data.employees : [];
      const locations = Array.isArray(locationsRes.data?.locations) ? locationsRes.data.locations : [];
      const vendors   = Array.isArray(vendorsRes.data?.vendors) ? vendorsRes.data.vendors : [];
      const tickets   = Array.isArray(ticketsRes.data?.tickets) ? ticketsRes.data.tickets : [];
      const pos       = Array.isArray(posRes.data?.purchaseOrders) ? posRes.data.purchaseOrders : [];
      const allocs    = Array.isArray(allocRes.data?.allocations) ? allocRes.data.allocations : [];

      const allocatedAssets  = assets.filter((a) => a.status === "ALLOCATED").length;
      const availableAssets  = assets.filter((a) => a.status === "AVAILABLE").length;
      const totalOrdered     = pos.reduce((s, p) => s + p.ordered_qty, 0);
      const totalCreated     = pos.reduce((s, p) => s + (p.assets_created || 0), 0);
      const totalAvailInv    = pos.reduce((s, p) => s + (p.available_qty || 0), 0);

      setStats({
        assets: assets.length,
        employees: employees.length,
        locations: locations.length,
        vendors: vendors.length,
        tickets: tickets.filter((t) => !t.resolved_date).length,
        allocatedAssets,
        availableAssets,
        totalPOs: pos.length,
        totalInventoryPurchased: totalOrdered,
        assetsCreated: totalCreated,
        availableInventory: totalAvailInv,
      });

      setRecentAllocations(allocs.slice(0, 8));
      setPoSummary(pos.slice(0, 6));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-";

  if (loading) {
    return (
      <PageLayout title="Dashboard">
        <div className="flex items-center justify-center h-64 text-slate-500">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mr-3" />
          Loading Dashboard...
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Dashboard">

      {/* Row 1: Core KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <StatCard title="Total Assets"    value={stats.assets}    icon={<Monitor size={28} />} />
        <StatCard title="Employees"       value={stats.employees} icon={<Users size={28} />} />
        <StatCard title="Locations"       value={stats.locations} icon={<MapPin size={28} />} />
        <StatCard title="Vendors"         value={stats.vendors}   icon={<Building2 size={28} />} />
        <StatCard title="Open Tickets"    value={stats.tickets}   icon={<Ticket size={28} />} />
      </div>

      {/* Row 2: New V2 metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard title="Allocated Assets"     value={stats.allocatedAssets}         icon={<CheckCircle size={24} />}  color="blue" />
        <StatCard title="Available Assets"     value={stats.availableAssets}         icon={<Archive size={24} />}      color="emerald" />
        <StatCard title="Purchase Orders"      value={stats.totalPOs}                icon={<ShoppingCart size={24} />} color="purple" />
        <StatCard title="Total Inventory"      value={stats.totalInventoryPurchased}  icon={<Package size={24} />}      color="amber" />
        <StatCard title="Assets Created"       value={stats.assetsCreated}           icon={<Monitor size={24} />}      color="orange" />
        <StatCard title="Available Inventory"  value={stats.availableInventory}      icon={<TrendingUp size={24} />}   color="teal" />
      </div>

      {/* Row 3: Recent Allocations + PO Summary */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Allocations */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <CheckCircle size={16} className="text-blue-500" />
            Recent Allocations
          </h2>
          {recentAllocations.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No allocations yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="pb-2 font-medium">Employee</th>
                  <th className="pb-2 font-medium">Asset</th>
                  <th className="pb-2 font-medium">Location</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentAllocations.map((a) => (
                  <tr key={a.allocation_id} className="hover:bg-slate-50">
                    <td className="py-2 font-medium text-slate-700">
                      {a.employee ? `${a.employee.first_name} ${a.employee.last_name}` : "—"}
                    </td>
                    <td className="py-2 font-mono text-orange-600 text-xs">{a.asset?.asset_tag || "—"}</td>
                    <td className="py-2 text-slate-500 text-xs">
                      {a.location
                        ? `${a.location.building_name} - ${a.location.room_number}`
                        : "—"}
                    </td>
                    <td className="py-2 text-slate-400 text-xs">{fmt(a.allocated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PO Summary */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <ShoppingCart size={16} className="text-purple-500" />
            Purchase Order Summary
          </h2>
          {poSummary.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No purchase orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="pb-2 font-medium">PO #</th>
                  <th className="pb-2 font-medium">Vendor</th>
                  <th className="pb-2 font-medium">Ordered</th>
                  <th className="pb-2 font-medium">Created</th>
                  <th className="pb-2 font-medium">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {poSummary.map((po) => (
                  <tr key={po.po_no} className="hover:bg-slate-50">
                    <td className="py-2 font-mono text-orange-600 text-xs font-bold">{po.po_no}</td>
                    <td className="py-2 text-slate-600 text-xs">{po.vendor?.company_name || "—"}</td>
                    <td className="py-2 text-center font-medium text-slate-700">{po.ordered_qty}</td>
                    <td className="py-2 text-center font-medium text-blue-600">{po.assets_created}</td>
                    <td className="py-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        po.available_qty <= 0 ? "bg-red-100 text-red-600" :
                        po.available_qty < po.ordered_qty * 0.2 ? "bg-amber-100 text-amber-600" :
                        "bg-emerald-100 text-emerald-600"
                      }`}>
                        {po.available_qty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </PageLayout>
  );
}