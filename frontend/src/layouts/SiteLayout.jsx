import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteAuth } from "../context/SiteAuthContext";
import ThemeToggle from "../components/layout/ThemeToggle";
import NotificationBell from "../components/layout/NotificationBell";
import ProfileMenu from "../components/layout/ProfileMenu";

const SiteLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { site, logout } = useSiteAuth();

  const handleMenuClick = () => {
    if (window.innerWidth >= 768) {
      setSidebarCollapsed((prev) => !prev);
    } else {
      setSidebarOpen(true);
    }
  };

  const handleLogout = async () => {
    setSidebarOpen(false);
    await logout();
  };

  const siteNavItems = [
    { path: "/site/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/site/details", label: "Site Details", icon: "🏢" },
    { path: "/site/attendance", label: "Attendance", icon: "📅" },
    { path: "/site/material", label: "Material Request", icon: "📦" },
    { path: "/site/payment", label: "Payment Request", icon: "💰" },
    { path: "/site/expenses", label: "Site Expenses", icon: "📋" },
    { path: "/site/request-history", label: "Request History", icon: "📜" },
    { path: "/site/notifications", label: "Notifications", icon: "🔔" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md border-b border-secondary-200 dark:border-secondary-700 transition-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={handleMenuClick}
                className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-theme"
                aria-label="Toggle menu"
              >
                <span className="text-secondary-700 dark:text-secondary-300 text-lg leading-none">☰</span>
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 6.16-1.26 10-5.45 10-11V7l-10-5z" />
                  </svg>
                </div>
                <span className="font-bold text-secondary-900 dark:text-white text-base sm:text-lg">APL Site</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <NotificationBell />
              <ProfileMenu site={site} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : "-100%",
          width: sidebarCollapsed ? 80 : 256,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 z-50 h-full bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-700 md:translate-x-0 md:static md:z-auto ${sidebarCollapsed ? "md:w-20" : "md:w-64"}`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 6.16-1.26 10-5.45 10-11V7l-10-5z" />
              </svg>
            </div>
            <span className={`font-bold text-secondary-900 dark:text-white transition-opacity duration-300 ${sidebarCollapsed ? "md:hidden" : ""}`}>
              APL Site
            </span>
          </div>

          <nav className="flex-1 space-y-1">
            {siteNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-theme ${
                  location.pathname === item.path
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                    : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800"
                } ${sidebarCollapsed ? "md:justify-center md:px-0" : ""}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="text-lg">{item.icon}</span>
                <span className={`transition-opacity duration-300 ${sidebarCollapsed ? "md:hidden" : ""}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-theme text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 mt-2 ${
              sidebarCollapsed ? "md:justify-center md:px-0" : ""
            }`}
            title={sidebarCollapsed ? "Logout" : undefined}
          >
            <span className="text-lg">🚪</span>
            <span className={`transition-opacity duration-300 ${sidebarCollapsed ? "md:hidden" : ""}`}>
              Logout
            </span>
          </button>
        </div>
      </motion.aside>

      <main className={`md:pl-64 pb-16 md:pb-0 transition-all duration-300 ${sidebarCollapsed ? "md:pl-20" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SiteLayout;
