// frontend/src/pages/retailer/dashboard/Layout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../../retailer/dashboard/Sidebar";
import DashboardNavbar from "../../retailer/dashboard/DashboardNavbar";

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <Outlet /> {/* This renders the matched child route */}
          </div>
        </main>
      </div>
    </div>
  );
}
