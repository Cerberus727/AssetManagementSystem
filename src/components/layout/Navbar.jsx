import {
  Search,
  User,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../../services/authService";

export default function Navbar() {
  const navigate = useNavigate();
  
  const currentUser = getCurrentUser();
  const userName = currentUser?.name || currentUser?.email?.split('@')[0] || "User";
  const userRole = currentUser?.role || "Information Systems";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="h-16 bg-white shadow-sm border-b px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex items-center bg-slate-100 rounded-lg px-4 py-2 w-96">
        <Search
          size={18}
          className="text-slate-500"
        />

        <input
          type="text"
          placeholder="Search assets..."
          className="ml-3 bg-transparent outline-none w-full"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
            <User size={18} />
          </div>

          <div>
            <p className="font-medium capitalize">
              {userName}
            </p>

            <p className="text-xs text-slate-500 capitalize">
              {userRole}
            </p>
          </div>
        </div>

        <button onClick={handleLogout} className="hover:text-red-500">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}