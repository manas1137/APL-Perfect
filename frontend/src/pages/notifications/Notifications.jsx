import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/cards";
import { Table } from "../../components/tables";
import { SearchBar } from "../../components/common";
import { ConfirmationDialog } from "../../components/modals";
import { useApi } from "../../hooks/useApi";
import { notificationApi } from "../../api";
import { API_STATUS } from "../../constants";
import { toast } from "react-hot-toast";

const Notifications = () => {
  const { data, status, execute } = useApi(notificationApi.getAll);

  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteAll, setShowDeleteAll] = useState(false);

  useEffect(() => {
    execute();
  }, [execute]);

  const notifications = data?.data?.notifications || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleDelete = async (id) => {
    try {
      await notificationApi.delete(id);
      toast.success("Notification deleted");
      execute();
    } catch {
      toast.error("Failed to delete notification");
    } finally {
      setDeleteId(null);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await notificationApi.deleteAll();
      toast.success("All notifications deleted");
      execute();
    } catch {
      toast.error("Failed to delete notifications");
    } finally {
      setShowDeleteAll(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.readAll();
      toast.success("All notifications marked as read");
      execute();
    } catch {
      toast.error("Failed to mark notifications");
    }
  };

  const notificationColumns = [
    {
      key: "title",
      label: "Title",
      render: (value, row) => (
        <div>
          <p className={`font-medium text-sm sm:text-base ${row.isRead ? "text-secondary-600 dark:text-secondary-400" : "text-secondary-900 dark:text-white"}`}>
            {value}
          </p>
          <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-500">{row.message}</p>
        </div>
      )
    },
    { key: "createdAt", label: "Time" },
    {
      key: "isRead",
      label: "Status",
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value
            ? "bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-300"
            : "bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400"
        }`}>
          {value ? "Read" : "Unread"}
        </span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDeleteId(row._id);
          }}
          className="p-1.5 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-theme"
          title="Delete notification"
        >
          🗑️
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Notifications</h1>
          <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">All your notifications ({unreadCount} unread)</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDeleteAll(true)}
            className="px-4 py-2.5 sm:py-2 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-300 rounded-lg font-medium transition-theme min-h-[44px] sm:min-h-0"
          >
            Delete All
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMarkAllRead}
            className="px-4 py-2.5 sm:py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-900 dark:bg-secondary-800 dark:hover:bg-secondary-700 dark:text-white rounded-lg font-medium transition-theme min-h-[44px] sm:min-h-0"
          >
            Mark All Read
          </motion.button>
        </div>
      </div>

      <Card>
        <div className="mb-3 sm:mb-4">
          <SearchBar placeholder="Search notifications..." />
        </div>
        <Table
          columns={notificationColumns}
          data={notifications}
          isLoading={status === API_STATUS.LOADING}
          emptyMessage="No notifications found"
        />
      </Card>

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
        title="Delete Notification"
        message="Are you sure you want to delete this notification? This action cannot be undone."
        confirmText="Delete"
      />

      <ConfirmationDialog
        isOpen={showDeleteAll}
        onClose={() => setShowDeleteAll(false)}
        onConfirm={handleDeleteAll}
        title="Delete All Notifications"
        message="Are you sure you want to delete all notifications? This action cannot be undone."
        confirmText="Delete All"
      />
    </div>
  );
};

export default Notifications;
