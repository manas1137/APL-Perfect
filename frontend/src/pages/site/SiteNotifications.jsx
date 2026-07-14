import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/cards";
import { useApi } from "../../hooks/useApi";
import { API_STATUS } from "../../constants";
import { notificationApi } from "../../api";
import { toast } from "react-hot-toast";
import { formatDateTime } from "../../utils";

const SiteNotifications = () => {
  const { data, status, execute } = useApi(notificationApi.getSite);

  const notifications = useMemo(() => data?.data?.notifications || [], [data]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.readSiteAll();
      execute();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark notifications");
    }
  };

  const markRead = async (id) => {
    try {
      await notificationApi.readSite(id);
      execute();
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const remove = async (id) => {
    try {
      await notificationApi.deleteSite(id);
      execute();
      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Notifications</h1>
          <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">
            All your notifications ({unreadCount} unread)
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMarkAllRead}
          className="px-4 py-2.5 sm:py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-900 dark:bg-secondary-800 dark:hover:bg-secondary-700 dark:text-white rounded-lg font-medium transition-theme min-h-[44px] sm:min-h-0"
        >
          Mark All Read
        </motion.button>
      </div>

      <Card>
        <div className="space-y-3">
          {status === API_STATUS.LOADING ? (
            <p className="text-sm text-secondary-500 dark:text-secondary-400">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-secondary-500 dark:text-secondary-400">No notifications found</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`px-4 py-3 rounded-lg border border-secondary-100 dark:border-secondary-700 ${
                  n.isRead
                    ? "bg-secondary-50 dark:bg-secondary-800"
                    : "bg-primary-50 dark:bg-primary-900/10"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${n.isRead ? "text-secondary-600 dark:text-secondary-400" : "text-secondary-900 dark:text-white"}`}>
                      {n.title}
                    </p>
                    <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-500 mt-0.5">{n.message}</p>
                    <p className="text-[11px] text-secondary-400 dark:text-secondary-500 mt-1">
                      {formatDateTime(n.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-[10px] font-medium px-2 py-1 rounded-full ${
                        n.isRead
                          ? "bg-secondary-200 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300"
                          : "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                      }`}
                    >
                      {n.isRead ? "Read" : "Unread"}
                    </span>
                    {!n.isRead && (
                      <button
                        onClick={() => markRead(n._id)}
                        className="text-xs font-medium px-2 py-1 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-theme"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => remove(n._id)}
                      className="text-xs font-medium px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-theme"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default SiteNotifications;
