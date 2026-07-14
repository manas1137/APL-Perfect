import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/cards";
import { Table } from "../../components/tables";
import { useApi } from "../../hooks/useApi";
import { API_STATUS } from "../../constants";
import { siteApi, paymentRequestApi, materialRequestApi, expenseApi, attendanceApi, notificationApi } from "../../api";
import { formatDate, formatDateTime } from "../../utils";

const buildDescription = (r, type) => {
  if (type === "Payment") return `${r.purpose || "Payment"}${r.amount ? ` - ₹${r.amount}` : ""}`;
  if (type === "Material")
    return (r.materials || []).map((m) => `${m.name} (${m.quantity} ${m.unit || ""})`).join(", ");
  if (type === "Expense") return `${r.purpose || "Expense"}${r.amount ? ` - ₹${r.amount}` : ""}`;
  if (type === "Attendance") {
    const d = r.date ? new Date(r.date) : null;
    return d && !isNaN(d.getTime())
      ? `Attendance for ${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getFullYear()}`
      : "Attendance";
  }
  return "";
};

const SiteDashboard = () => {
  const dashboardHook = useApi(siteApi.dashboard);
  const materialsHook = useApi(siteApi.materials);
  const paymentHook = useApi(paymentRequestApi.getHistory);
  const materialHook = useApi(materialRequestApi.getHistory);
  const expenseHook = useApi(expenseApi.getHistory);
  const attendanceHook = useApi(attendanceApi.getHistory);
  const notificationsHook = useApi(notificationApi.getSite);

  useEffect(() => {
    dashboardHook.execute();
    materialsHook.execute();
    paymentHook.execute();
    materialHook.execute();
    expenseHook.execute();
    attendanceHook.execute();
    notificationsHook.execute();
  }, [
    dashboardHook.execute,
    materialsHook.execute,
    paymentHook.execute,
    materialHook.execute,
    expenseHook.execute,
    attendanceHook.execute,
    notificationsHook.execute,
  ]);

  const stats = dashboardHook.data?.data || {};
  const attendance = stats.attendance || {};
  const requests = stats.requests || {};
  const materials = Array.isArray(materialsHook.data?.data) ? materialsHook.data.data : [];

  const statCards = [
    { label: "Today Attendance", value: attendance.presentToday ?? 0, icon: "📅" },
    { label: "Pending Requests", value: requests.totalPending ?? 0, icon: "📋" },
    { label: "Materials", value: materials.length, icon: "📦" },
    { label: "Active Workers", value: stats.totalAssignedWorkers ?? 0, icon: "👷" },
  ];

  const requestsData = [
    ...(Array.isArray(paymentHook.data?.data) ? paymentHook.data.data : []).map((r) => ({ ...r, type: "Payment" })),
    ...(Array.isArray(materialHook.data?.data) ? materialHook.data.data : []).map((r) => ({ ...r, type: "Material" })),
    ...(Array.isArray(expenseHook.data?.data) ? expenseHook.data.data : []).map((r) => ({ ...r, type: "Expense", status: "approved" })),
    ...(Array.isArray(attendanceHook.data?.data) ? attendanceHook.data.data : []).map((r) => ({ ...r, type: "Attendance" })),
  ]
    .map((r) => ({
      ...r,
      description: buildDescription(r, r.type),
      date: r.createdAt || r.date,
    }))
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 5);

  const columns = [
    { key: "type", label: "Request Type" },
    { key: "description", label: "Description" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === "approved"
            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            : value === "pending"
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
        }`}>
          {value ? value.charAt(0).toUpperCase() + value.slice(1) : "Unknown"}
        </span>
      ),
    },
    { key: "date", label: "Date", render: (value) => formatDate(value) },
  ];

  const notifications = Array.isArray(notificationsHook.data?.data?.notifications)
    ? notificationsHook.data.data.notifications
    : [];

  const markRead = async (id) => {
    try {
      await notificationApi.readSite(id);
      notificationsHook.execute();
    } catch {
      /* ignore */
    }
  };

  const remove = async (id) => {
    try {
      await notificationApi.deleteSite(id);
      notificationsHook.execute();
    } catch {
      /* ignore */
    }
  };

  const isLoading =
    dashboardHook.status === API_STATUS.LOADING ||
    materialsHook.status === API_STATUS.LOADING ||
    paymentHook.status === API_STATUS.LOADING ||
    materialHook.status === API_STATUS.LOADING ||
    expenseHook.status === API_STATUS.LOADING ||
    attendanceHook.status === API_STATUS.LOADING;

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Site Dashboard</h1>
        <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">Welcome back, Site Manager</p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card padding="sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">{stat.label}</p>
                  <p className="text-lg sm:text-2xl font-bold text-secondary-900 dark:text-white mt-1">
                    {isLoading ? "..." : stat.value}
                  </p>
                </div>
                <div className="text-2xl sm:text-3xl">{stat.icon}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card title="Recent Request History">
            <Table
              columns={columns}
              data={requestsData}
              isLoading={isLoading}
              emptyMessage="No request history"
            />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card title="Notifications">
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-secondary-500 dark:text-secondary-400">No notifications</p>
              ) : (
                notifications.slice(0, 6).map((n) => (
                  <div
                    key={n._id}
                    className={`px-3 py-2 rounded-lg ${
                      n.isRead
                        ? "bg-secondary-50 dark:bg-secondary-800"
                        : "bg-primary-50 dark:bg-primary-900/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary-900 dark:text-white">{n.title}</p>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-0.5">{n.message}</p>
                        <p className="text-[11px] text-secondary-400 dark:text-secondary-500 mt-1">
                          {formatDateTime(n.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!n.isRead && (
                          <button
                            onClick={() => markRead(n._id)}
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-theme"
                            title="Mark as read"
                          >
                            Read
                          </button>
                        )}
                        <button
                          onClick={() => remove(n._id)}
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-theme"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SiteDashboard;
