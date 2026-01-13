import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] overflow-x-hidden">
      {/* Sidebar - Fixed Position */}
      <motion.div
        initial={false}
        animate={{ 
          x: sidebarOpen ? 0 : -288,
          opacity: sidebarOpen ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-50 w-72 pointer-events-auto"
      >
        <Sidebar onClose={toggleSidebar} />
      </motion.div>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      {/* Main content - Dynamic Margin */}
      <motion.div 
        initial={false}
        animate={{ 
          paddingLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? (sidebarOpen ? 288 : 0) : 0 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-1 flex flex-col min-w-0 min-h-screen"
      >
        <DashboardNavbar
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-y-auto bg-[#F8F9FA]">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </motion.div>
    </div>
  );
}
