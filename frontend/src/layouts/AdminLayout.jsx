import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import BottomNavigation from "../components/layout/BottomNavigation";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMenuClick = () => {
    if (window.innerWidth >= 768) {
      setSidebarCollapsed((prev) => !prev);
    } else {
      setSidebarOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900">
      <Navbar onMenuClick={handleMenuClick} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={`md:pl-64 pb-16 md:pb-0 transition-all duration-300 ${sidebarCollapsed ? "md:pl-20" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {children}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default AdminLayout;
