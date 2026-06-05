import { useState } from "react";
import { Eye, EyeOff, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  login,
  register,
  saveAuth,
} from "../../services/authService";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isLogin) {
        const data = await login({ email, password });
        saveAuth({ token: data.token, user: { email, role: data.role } });
        navigate("/dashboard");
      } else {
        await register({ email, password, role });
        alert("Registration successful! Please login.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || (isLogin ? "Login failed" : "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-orange-600 text-white flex-col justify-center px-16">
        <div>
          <h1 className="text-5xl font-bold mb-6">
            IOCL Asset Management System
          </h1>

          <p className="text-xl text-orange-100 leading-relaxed">
            Centralized platform for managing IT assets, inventory allocation,
            procurement, maintenance, and department requests across the
            organization.
          </p>

          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3">
              <Monitor size={24} />
              <span>Asset Tracking & Allocation</span>
            </div>

            <div className="flex items-center gap-3">
              <Monitor size={24} />
              <span>Department Asset Requests</span>
            </div>

            <div className="flex items-center gap-3">
              <Monitor size={24} />
              <span>Maintenance & Warranty Monitoring</span>
            </div>

            <div className="flex items-center gap-3">
              <Monitor size={24} />
              <span>Reports & Audit Logs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex justify-center items-center bg-slate-100 px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="/Indian_Oil_Logo.svg.png"
              alt="IOCL Logo"
              className="w-20 h-20 mx-auto mb-4"
            />

            <h2 className="text-3xl font-bold text-slate-800">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="text-slate-500 mt-2">
              {isLogin ? "Sign in to continue" : "Register for a new account"}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email Address"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ADMIN">Administrator</option>
                  <option value="USER">Standard User</option>
                </select>
              </div>
            )}

            <div className="flex justify-between items-center">
              {isLogin && (
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" />
                  Remember Me
                </label>
              )}

              {isLogin && (
                <button
                  type="button"
                  className="text-sm text-orange-600 hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Registering..."
                : isLogin
                ? "Login"
                : "Register"}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="text-center mt-6 text-sm">
            <span className="text-slate-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-600 font-semibold hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-slate-500">
            Information Systems Department
            <br />
            Indian Oil Corporation Limited
          </div>
        </div>
      </div>
    </div>
  );
}