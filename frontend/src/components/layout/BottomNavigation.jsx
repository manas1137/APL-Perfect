import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ROUTES } from "../../constants";

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: ROUTES.DASHBOARD, label: "Home", icon: "🏠" },
    { path: ROUTES.WORKERS, label: "Workers", icon: "👷" },
    { path: ROUTES.MATERIALS, label: "Materials", icon: "📦" },
    { path: ROUTES.REQUESTS, label: "Requests", icon: "📋" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-700 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="relative flex flex-col items-center justify-center flex-1 py-2"
          >
            {location.pathname === item.path && (
              <motion.div
                layoutId="bottom-nav-indicator"
                className="absolute top-0 w-8 h-1 bg-primary-600 rounded-full"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <span className={`text-lg ${
              location.pathname === item.path
                ? "text-primary-600 dark:text-primary-400"
                : "text-secondary-400 dark:text-secondary-500"
            }`}>
              {item.icon}
            </span>
            <span className={`text-xs mt-1 ${
              location.pathname === item.path
                ? "text-primary-600 dark:text-primary-400"
                : "text-secondary-400 dark:text-secondary-500"
            }`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;