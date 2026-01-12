// frontend/src/components/DashboardNavbar.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Menu,
  X,
  SidebarOpen,
  SidebarClose,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface JWTPayload {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

interface DashboardNavbarProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export default function DashboardNavbar({
  onToggleSidebar,
  sidebarOpen = true,
}: DashboardNavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from JWT token
    const token = localStorage.getItem("hb_token");
    if (token) {
      try {
        const decoded: JWTPayload = jwtDecode(token);
        setUser({
          id: decoded.id,
          name: decoded.name || "User",
          email: decoded.email || "",
          role: decoded.role || "user",
        });
      } catch (error) {
        console.error("Error decoding token:", error);
        // Fallback: try to get from localStorage or redirect to login
        localStorage.removeItem("hb_token");
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("hb_token");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="mr-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {sidebarOpen ? (
              <SidebarClose className="h-5 w-5" />
            ) : (
              <SidebarOpen className="h-5 w-5" />
            )}
          </button>
          <Link
            to="/retailer/dashboard"
            className="text-xl font-bold text-gray-900"
          >
            Retailer
          </Link>
          <span className="ml-2 text-sm text-white bg-gradient-to-r from-[#561485] to-[#3C47BA] px-3 py-1 rounded-full hidden sm:inline">
            Dashboard
          </span>
        </div>

        {/* Desktop User Info & Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Welcome Message */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#561485] to-[#3C47BA] rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-sm">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-sm">
              <p className="text-gray-600">Welcome back,</p>
              <p className="font-medium text-gray-900">
                {user?.name || "User"}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-600 bg-white hover:bg-[#A13266] hover:border-[#A13266] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A13266] transition-all duration-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#561485] p-2 transition-all duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 pt-4 pb-3">
          <div className="px-2 space-y-1">
            {/* Sidebar Toggle */}
            <button
              onClick={onToggleSidebar}
              className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
            >
              {sidebarOpen ? (
                <SidebarClose className="h-5 w-5 mr-3" />
              ) : (
                <SidebarOpen className="h-5 w-5 mr-3" />
              )}
              {sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
            </button>

            {/* Welcome Message */}
            <div className="flex items-center space-x-2 px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#561485] to-[#3C47BA] rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-sm">
                <p className="text-gray-500">Welcome back,</p>
                <p className="font-medium text-gray-900">
                  {user?.name || "User"}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-white hover:bg-[#A13266] transition-all duration-200 rounded-lg"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
