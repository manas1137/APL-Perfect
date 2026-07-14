import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { workerApi } from "../../api";
import { API_STATUS } from "../../constants";

const WorkerMultiSelect = ({ selected = [], onChange, error }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      try {
        const response = await workerApi.getAll({ search: "", limit: 100 });
        setWorkers(response.data?.data?.workers || []);
      } catch (err) {
        console.error("Failed to fetch workers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = workers.filter((w) => {
    const term = search.toLowerCase();
    return (
      w.name?.toLowerCase().includes(term) ||
      w.mobileNumber?.toLowerCase().includes(term)
    );
  });

  const selectedIds = selected.map((s) => s._id);
  const selectedMap = new Map(selected.map((s) => [s._id, s]));

  const toggle = (worker) => {
    if (selectedIds.includes(worker._id)) {
      onChange(selected.filter((s) => s._id !== worker._id));
    } else {
      onChange([...selected, worker]);
    }
  };

  const remove = (id) => {
    onChange(selected.filter((s) => s._id !== id));
  };

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
        Assigned Workers
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`w-full px-4 py-2.5 rounded-lg border transition-theme text-left flex items-center justify-between min-h-[44px] ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-secondary-300 dark:border-secondary-600"
          } bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white`}
        >
          <span className={selected.length === 0 ? "text-secondary-400 dark:text-secondary-500" : ""}>
            {selected.length === 0
              ? "Select workers..."
              : `${selected.length} worker${selected.length > 1 ? "s" : ""} selected`}
          </span>
          <span className="text-secondary-400 dark:text-secondary-500">▾</span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute z-30 w-full mt-1 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg shadow-lg max-h-64 flex flex-col overflow-hidden"
            >
              <div className="p-2 border-b border-secondary-200 dark:border-secondary-700">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search workers..."
                  className="w-full px-3 py-2 rounded-md border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-900 text-sm text-secondary-900 dark:text-white placeholder:text-secondary-400 dark:placeholder:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto flex-1 p-1">
                {loading ? (
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 p-2">Loading workers...</p>
                ) : filtered.length === 0 ? (
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 p-2">No workers found</p>
                ) : (
                  filtered.map((worker) => {
                    const isSelected = selectedIds.includes(worker._id);
                    const isInactive = worker.isActive === false;
                    const workerKey = worker._id || worker.id || `${worker.name}-${worker.mobileNumber}`;
                    return (
                      <button
                        key={workerKey}
                        type="button"
                        onClick={() => toggle(worker)}
                        disabled={!isSelected && isInactive}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-theme flex items-center justify-between ${
                          isSelected
                            ? "bg-primary-50 dark:bg-primary-900/20"
                            : isInactive
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-secondary-50 dark:hover:bg-secondary-700"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className={`font-medium ${isSelected ? "text-primary-700 dark:text-primary-300" : "text-secondary-900 dark:text-white"}`}>
                            {worker.name}
                          </span>
                          <span className="text-xs text-secondary-500 dark:text-secondary-400">
                            {worker.mobileNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                              worker.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                            }`}
                          >
                            {worker.isActive ? "Active" : "Inactive"}
                          </span>
                          {isSelected && (
                            <span className="text-primary-600 dark:text-primary-400 text-xs">✓</span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {selected.map((worker) => {
            const workerKey = worker._id || worker.id || `${worker.name}-${worker.mobileNumber}`;
            return (
              <span
                key={workerKey}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-md"
              >
                {worker.name}
                <button
                  type="button"
                  onClick={() => remove(worker._id)}
                  className="text-primary-500 hover:text-primary-700 dark:hover:text-primary-200"
                >
                  ✕
                </button>
              </span>
            );
          })}
        </div>
      )}

      {error && <span className="text-xs text-red-500 dark:text-red-400">{error}</span>}
    </div>
  );
};

export default WorkerMultiSelect;
