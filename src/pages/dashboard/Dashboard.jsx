import { useEffect, useState } from "react";

import PageLayout from "../../components/layout/PageLayout";

import {
  Monitor,
  Users,
  MapPin,
  Building2,
  Ticket,
} from "lucide-react";

import StatCard from "./StatCard";

import { getAssets } from "../../services/assetService";
import { getEmployees } from "../../services/employeeService";
import { getLocations } from "../../services/locationService";
import { getVendors } from "../../services/vendorService";
import { getTickets } from "../../services/ticketService";

export default function Dashboard() {
  const [stats, setStats] = useState({
    assets: 0,
    employees: 0,
    locations: 0,
    vendors: 0,
    tickets: 0,
  });

  const [recentAssets, setRecentAssets] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        assetsRes,
        employeesRes,
        locationsRes,
        vendorsRes,
        ticketsRes,
      ] = await Promise.all([
        getAssets(),
        getEmployees(),
        getLocations(),
        getVendors(),
        getTickets(),
      ]);

      const assets = assetsRes.data?.assets || assetsRes.data || [];
      const employees = employeesRes.data?.employees || employeesRes.data || [];
      const locations = locationsRes.data?.locations || locationsRes.data || [];
      const vendors = vendorsRes.data?.vendors || vendorsRes.data || [];
      const tickets = ticketsRes.data?.tickets || ticketsRes.data || [];

      setStats({
        assets: Array.isArray(assets) ? assets.length : 0,
        employees: Array.isArray(employees) ? employees.length : 0,
        locations: Array.isArray(locations) ? locations.length : 0,
        vendors: Array.isArray(vendors) ? vendors.length : 0,
        tickets: Array.isArray(tickets) ? tickets.filter(
          (ticket) => !ticket.resolved_date
        ).length : 0,
      });

      setRecentAssets(
        Array.isArray(assets) ? assets.slice(0, 5) : []
      );

      setRecentTickets(
        Array.isArray(tickets) ? tickets.slice(0, 5) : []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Dashboard">
        Loading Dashboard...
      </PageLayout>
    );
  }

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString();
  };

  return (
    <PageLayout title="Dashboard">
      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">

        <StatCard
          title="Assets"
          value={stats.assets}
          icon={<Monitor size={30} />}
        />

        <StatCard
          title="Employees"
          value={stats.employees}
          icon={<Users size={30} />}
        />

        <StatCard
          title="Locations"
          value={stats.locations}
          icon={<MapPin size={30} />}
        />

        <StatCard
          title="Vendors"
          value={stats.vendors}
          icon={<Building2 size={30} />}
        />

        <StatCard
          title="Open Tickets"
          value={stats.tickets}
          icon={<Ticket size={30} />}
        />

      </div>

      {/* Recent Assets & Tickets */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Assets */}

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-lg mb-4">
            Recent Assets
          </h2>

          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">
                  Asset Tag
                </th>

                <th className="py-2">
                  Model
                </th>

                <th className="py-2">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {(Array.isArray(recentAssets) ? recentAssets : []).map((asset) => (
                <tr
                  key={asset.asset_id}
                  className="border-b"
                >
                  <td className="py-2">
                    {asset.asset_tag}
                  </td>

                  <td className="py-2">
                    {asset.model_number || asset.model}
                  </td>

                  <td className="py-2">
                    {asset.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tickets */}

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-lg mb-4">
            Recent Tickets
          </h2>

          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">
                  Type
                </th>

                <th className="py-2">
                  Asset Tag
                </th>

                <th className="py-2">
                  Opened
                </th>
              </tr>
            </thead>

            <tbody>
              {(Array.isArray(recentTickets) ? recentTickets : []).map((ticket) => (
                <tr
                  key={ticket.ticket_id}
                  className="border-b"
                >
                  <td className="py-2">
                    {ticket.ticket_type}
                  </td>

                  <td className="py-2">
                    {ticket.asset?.asset_tag || ticket.asset_id}
                  </td>

                  <td className="py-2">
                    {formatDate(ticket.opened_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </PageLayout>
  );
}