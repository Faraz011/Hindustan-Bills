// frontend/src/components/DashboardNavbar.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Menu, X } from "lucide-react";
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
  sidebarOpen,
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
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link
            to="/retailer/dashboard"
            className="text-xl font-bold text-gray-900"
          >
            Retailer
          </Link>
          <span className="ml-2 text-sm text-gray-500 bg-blue-100 px-2 py-1 rounded hidden sm:inline">
            Dashboard
          </span>
        </div>

        {/* Desktop User Info & Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Welcome Message */}
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-400" />
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
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 p-2"
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
        <div className="md:hidden border-t border-gray-200 pt-4 pb-3">
          <div className="px-2 space-y-1">
            {/* Welcome Message */}
            <div className="flex items-center space-x-2 px-3 py-2">
              <User className="h-5 w-5 text-gray-400" />
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
              className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
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
