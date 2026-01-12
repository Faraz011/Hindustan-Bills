import { Link, useLocation } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  Store,
  ShoppingCart,
  CreditCard,
  Package,
} from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/customer/dashboard", icon: LayoutDashboard },
    {
      name: "Select Shop",
      path: "/customer/dashboard/select-shop",
      icon: Store,
    },
    {
      name: "Shopping",
      path: "/customer/dashboard/shopping",
      icon: ShoppingCart,
    },
    { name: "Cart", path: "/customer/dashboard/cart", icon: CreditCard },
    { name: "Orders", path: "/customer/dashboard/orders", icon: Package },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-xl border-r border-gray-100 relative">
      {/* Mobile close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg md:hidden transition-all duration-200"
        title="Close sidebar"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="p-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 mb-4"
          onClick={onClose}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-[#561485] to-[#3C47BA] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">HB</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 font-poppins">
              HINDUSTAN BILLS
            </h1>
            <div className="flex space-x-1">
              <div className="w-3 h-0.5 bg-[#561485]"></div>
              <div className="w-3 h-0.5 bg-[#A13266]"></div>
            </div>
            <p className="text-xs text-gray-500 font-koh">हिंदुस्तान बिल्स</p>
          </div>
        </Link>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`group flex items-center px-6 py-3 transition-all duration-200 mx-2 rounded-lg ${
                isActive
                  ? "bg-gradient-to-r from-[#561485] to-[#3C47BA] text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              title={item.name}
            >
              <IconComponent
                className={`h-5 w-5 mr-3 transition-colors duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
