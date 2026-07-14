import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProfileMenu = ({ site, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-theme"
        aria-label="Profile"
      >
        <span className="text-secondary-700 dark:text-secondary-300 text-lg leading-none">👤</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
              <p className="font-medium text-secondary-900 dark:text-white">{site?.name}</p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">{site?.ownerName}</p>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-theme"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;
