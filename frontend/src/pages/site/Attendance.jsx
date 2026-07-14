import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../../components/forms";
import { Button } from "../../components/buttons";
import { Card } from "../../components/cards";
import { useApi } from "../../hooks/useApi";
import { API_STATUS } from "../../constants";
import api from "../../api/axios";
import { attendanceApi } from "../../api";
import { toast } from "react-hot-toast";
import { useSiteAuth } from "../../context/SiteAuthContext";

const Attendance = () => {
  const { site } = useSiteAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [workers, setWorkers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const workersHook = useApi(() => api.get("/site/assigned-workers"));
  const historyHook = useApi(attendanceApi.getHistory);

  useEffect(() => {
    workersHook.execute();
    historyHook.execute();
  }, [workersHook.execute, historyHook.execute]);

  useEffect(() => {
    const list = Array.isArray(workersHook.data?.data) ? workersHook.data.data : [];
    setWorkers(list.map((w) => ({ id: w._id, name: w.name, status: "present" })));
  }, [workersHook.data]);

  const handleStatusChange = (index, status) => {
    setWorkers(workers.map((w, i) => (i === index ? { ...w, status } : w)));
  };

  const handleSubmit = async () => {
    if (workers.length === 0) {
      toast.error("No assigned workers found for this site");
      return;
    }
    setIsSubmitting(true);
    try {
      await attendanceApi.submit({
        date: selectedDate,
        workers: workers.map((w) => ({ workerId: w.id, name: w.name, status: w.status })),
        submittedBy: site?.ownerName || site?.name || "Site Manager",
      });
      toast.success("Attendance submitted successfully!");
      historyHook.execute();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  const history = Array.isArray(historyHook.data?.data) ? historyHook.data.data : [];
  const isLoading =
    workersHook.status === API_STATUS.LOADING || historyHook.status === API_STATUS.LOADING;

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Attendance</h1>
        <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">Mark daily attendance</p>
      </div>

      <Card>
        <div className="mb-4 sm:mb-6">
          <Input
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {workersHook.status === API_STATUS.ERROR && (
          <p className="text-sm text-red-500 mb-4">Failed to load assigned workers.</p>
        )}

        <div className="space-y-3 sm:space-y-4">
          {isLoading && workers.length === 0 ? (
            <p className="text-sm text-secondary-500">Loading workers...</p>
          ) : workers.length === 0 ? (
            <p className="text-sm text-secondary-500">No workers assigned to this site.</p>
          ) : (
            workers.map((worker, index) => (
              <motion.div
                key={worker.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-secondary-50 dark:bg-secondary-700/30 rounded-lg gap-3 sm:gap-0"
              >
                <span className="font-medium text-secondary-900 dark:text-white text-base sm:text-sm">{worker.name}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={worker.status === "present" ? "primary" : "secondary"}
                    className="flex-1 sm:flex-auto min-h-[44px] sm:min-h-0"
                    onClick={() => handleStatusChange(index, "present")}
                  >
                    Present
                  </Button>
                  <Button
                    size="sm"
                    variant={worker.status === "absent" ? "danger" : "ghost"}
                    className="flex-1 sm:flex-auto min-h-[44px] sm:min-h-0"
                    onClick={() => handleStatusChange(index, "absent")}
                  >
                    Absent
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="mt-4 sm:mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isSubmitting || workers.length === 0}
            className="w-full px-4 py-3 sm:py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-theme disabled:opacity-50 min-h-[44px] sm:min-h-0"
          >
            {isSubmitting ? "Submitting..." : "Submit Attendance"}
          </motion.button>
        </div>
      </Card>

      <div className="mt-4 sm:mt-6">
        <Card title="Attendance History">
          {history.length === 0 ? (
            <p className="text-sm text-secondary-500">No attendance history yet.</p>
          ) : (
            <div className="space-y-3">
              {history.map((record, idx) => {
                const present = (record.workers || []).filter((w) => w.status === "present").length;
                const total = (record.workers || []).length;
                return (
                  <div
                    key={record._id || idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary-50 dark:bg-secondary-700/30"
                  >
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-white">
                        {record.date ? new Date(record.date).toLocaleDateString() : "—"}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {present}/{total} present · {record.submittedBy || "—"}
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      record.status === "approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : record.status === "rejected"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                    }`}>
                      {record.status ? record.status.charAt(0).toUpperCase() + record.status.slice(1) : "Pending"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Attendance;
