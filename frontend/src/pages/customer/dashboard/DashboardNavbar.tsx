// frontend/src/pages/customer/dashboard/DashboardNavbar.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Menu,
  X,
  SidebarOpen,
  SidebarClose,
  Bell,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";

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
          name: decoded.name || "Customer",
          email: decoded.email || "",
          role: decoded.role || "customer",
        });
      } catch (error) {
        console.error("Error decoding token:", error);
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
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 border-b border-gray-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-300"
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {sidebarOpen ? (
              <SidebarClose className="h-5 w-5" />
            ) : (
              <SidebarOpen className="h-5 w-5" />
            )}
          </button>
          
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">
              Dashboard
            </span>
            <div className="w-1 h-1 bg-gray-300 rounded-full mx-1"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
              Customer Hub
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-300 relative group">
            <Bell className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-[#A13266] rounded-full ring-2 ring-white"></span>
          </button>

          <div className="h-8 w-px bg-gray-100 mx-2 hidden md:block"></div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-4 pl-2">
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Logged in as</p>
              <p className="text-sm font-bold text-gray-900 leading-none">
                {user?.name || "User Account"}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-[#561485] to-[#3C47BA] rounded-xl flex items-center justify-center shadow-lg shadow-[#561485]/10 border border-white/20">
              <span className="text-white font-black text-xs">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="md:ml-4 p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-300"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-[#561485] rounded-xl flex items-center justify-center text-white font-bold">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Welcome</p>
                <p className="text-base font-bold text-gray-900">{user?.name || "User Account"}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full gap-2 p-4 text-red-600 bg-red-50 font-bold rounded-2xl transition-all active:scale-95"
            >
              <LogOut className="h-5 w-5" />
              Logout Account
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
