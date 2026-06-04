import {
  LayoutDashboard,
  Monitor,
  Users,
  MapPin,
  Building2,
  Ticket,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Assets",
      icon: Monitor,
      path: "/assets",
    },
    {
      name: "Employees",
      icon: Users,
      path: "/employees",
    },
    {
      name: "Locations",
      icon: MapPin,
      path: "/locations",
    },
    {
      name: "Vendors",
      icon: Building2,
      path: "/vendors",
    },
    {
      name: "Tickets",
      icon: Ticket,
      path: "/tickets",
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen">
      <div className="p-5 text-xl font-bold border-b border-slate-700">
        IOCL AMS
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 p-3 rounded hover:bg-slate-800"
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}