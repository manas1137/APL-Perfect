import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen = false, onClose, collapsed = false }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: ROUTES.DASHBOARD, label: "Dashboard", icon: "📊" },
    { path: ROUTES.WORKERS, label: "Workers", icon: "👷" },
    { path: ROUTES.MATERIALS, label: "Materials", icon: "📦" },
    { path: ROUTES.SITES, label: "Sites", icon: "🏢" },
    { path: ROUTES.REQUESTS, label: "Requests", icon: "📋" },
    { path: ROUTES.EXPENSE_HISTORY, label: "Expense History", icon: "💸" },
    { path: ROUTES.ATTENDANCE_HISTORY, label: "Attendance History", icon: "🗓️" },
    { path: ROUTES.NOTIFICATIONS, label: "Notifications", icon: "🔔" },
    { label: "Logout", icon: "🚪", isLogout: true },
  ];

  const handleLogout = async () => {
    await logout();
    onClose?.();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : "-100%",
          width: collapsed ? 80 : 256,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 z-50 h-full bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-700 md:translate-x-0 md:static md:z-auto ${collapsed ? "md:w-20" : "md:w-64"}`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 6.16-1.26 10-5.45 10-11V7l-10-5z" />
              </svg>
            </div>
            <span className={`font-bold text-secondary-900 dark:text-white transition-opacity duration-300 ${collapsed ? "md:hidden" : ""}`}>
              APL Perfect
            </span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              if (item.isLogout) {
                return (
                  <button
                    key={item.label}
                    onClick={handleLogout}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-theme w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 ${collapsed ? "md:justify-center md:px-0" : ""}`}
                    title="Logout"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className={`transition-opacity duration-300 ${collapsed ? "md:hidden" : ""}`}>
                      {item.label}
                    </span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-theme ${
                    location.pathname === item.path
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                      : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800"
                  } ${collapsed ? "md:justify-center md:px-0" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className={`transition-opacity duration-300 ${collapsed ? "md:hidden" : ""}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
