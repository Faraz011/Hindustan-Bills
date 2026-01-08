import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/retailer/dashboard" },
    { name: "Shop Details", path: "/retailer/dashboard/shop" },
    { name: "Products", path: "/retailer/dashboard/products" },
    { name: "Orders", path: "/retailer/dashboard/orders" },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-lg relative">
      {/* Mobile close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md md:hidden"
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
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">HB</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 font-poppins">
              HINDUSTAN BILLS
            </h1>
            <div className="flex space-x-1">
              <div className="w-3 h-0.5 bg-primary-500"></div>
              <div className="w-3 h-0.5 bg-primary-500"></div>
            </div>
            <p className="text-xs text-gray-600 font-koh">हिंदुस्तान बिल्स</p>
          </div>
        </Link>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-6 py-3 ${
              location.pathname === item.path
                ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
