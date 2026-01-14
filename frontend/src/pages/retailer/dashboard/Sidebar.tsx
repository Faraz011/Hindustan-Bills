import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  X,
  LayoutDashboard,
  Store,
  Package,
  ClipboardList,
  Settings,
} from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/retailer/dashboard", icon: LayoutDashboard },
    { name: "Shop Details", path: "/retailer/dashboard/shop", icon: Store },
    { name: "Products", path: "/retailer/dashboard/products", icon: Package },
    { name: "Orders", path: "/retailer/dashboard/orders", icon: ClipboardList },
    { name: "Settings", path: "/retailer/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="w-full bg-white h-screen border-r border-gray-100 flex flex-col">
      {/* Mobile close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 md:hidden transition-all duration-200"
        title="Close sidebar"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="p-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 mb-10 group"
          onClick={onClose}
        >
          <div className="w-12 h-12 bg-[#561485] rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden shadow-lg shadow-[#561485]/10">
                <img
                  src="/FUTUREOFBUSINESS.png"
                  alt="Hindustan Bills Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3 flex flex-col">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  HINDUSTAN BILLS
                </h1>
                <p className="text-xs text-gray-600 font-medium">
                  हिंदुस्तान बिल्स
                </p>
              </div>
        </Link>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-300 relative ${
                  isActive
                    ? "bg-[#561485]/5 text-[#561485]"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-retailer"
                    className="absolute left-0 w-1 h-6 bg-[#561485] rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <IconComponent
                  className={`h-5 w-5 mr-3 transition-all duration-300 ${
                    isActive ? "text-[#561485] scale-110" : "text-gray-400 group-hover:text-gray-900"
                  }`}
                />
                <span className={`text-[15px] font-bold tracking-tight ${isActive ? "opacity-100" : "opacity-80"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-gray-50">
        <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Support</p>
          <p className="text-sm font-bold text-gray-900">Retailer Help</p>
          <button className="mt-2 text-[10px] font-black text-[#561485] uppercase tracking-tighter hover:underline">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
