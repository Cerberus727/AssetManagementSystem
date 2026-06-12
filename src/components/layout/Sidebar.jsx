import {
  LayoutDashboard,
  Monitor,
  Users,
  MapPin,
  Building2,
  Ticket,
  ShoppingCart,
  ClipboardList,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard",      icon: LayoutDashboard, path: "/dashboard" },
  { name: "Assets",         icon: Monitor,         path: "/assets" },
  { name: "Employees",      icon: Users,           path: "/employees" },
  { name: "Locations",      icon: MapPin,          path: "/locations" },
  { name: "Vendors",        icon: Building2,       path: "/vendors" },
  { name: "Tickets",        icon: Ticket,          path: "/tickets" },
  { name: "Purchase Orders", icon: ShoppingCart,   path: "/purchase-orders" },
  { name: "Allocations",    icon: ClipboardList,   path: "/allocations" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-5 text-xl font-bold border-b border-slate-700 tracking-tight">
        IOCL <span className="text-orange-400">AMS</span>
      </div>

      <nav className="p-4 space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={17} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">Asset Management System</p>
      </div>
    </aside>
  );
}