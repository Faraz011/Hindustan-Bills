// frontend/src/pages/retailer/dashboard/Layout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {sidebarOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleSidebar}
          />
          <div className="transition-all duration-300 ease-in-out z-50">
            <Sidebar onClose={toggleSidebar} />
          </div>
        </>
      )}

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out`}
      >
        <DashboardNavbar
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <Outlet /> {/* This renders the matched child route */}
          </div>
        </main>
      </div>
    </div>
  );
}
