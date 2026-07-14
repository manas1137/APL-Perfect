import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Navbar = ({ onMenuClick }) => {

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md border-b border-secondary-200 dark:border-secondary-700 transition-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-theme"
              aria-label="Toggle menu"
            >
              <span className="text-secondary-700 dark:text-secondary-300 text-lg leading-none">☰</span>
            </button>

            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 6.16-1.26 10-5.45 10-11V7l-10-5z" />
                </svg>
              </div>
              <span className="font-bold text-secondary-900 dark:text-white text-base sm:text-lg">APL Perfect</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <button
              className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-theme"
              aria-label="Profile"
            >
              <span className="text-secondary-700 dark:text-secondary-300 text-lg">👤</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
