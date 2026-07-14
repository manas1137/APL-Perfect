import { motion } from "framer-motion";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/cards";
import { Table } from "../../components/tables";
import { useApi } from "../../hooks/useApi";
import {
  dashboardApi,
  paymentRequestApi,
  materialRequestApi,
  attendanceApi,
} from "../../api";
import { API_STATUS, ROUTES } from "../../constants";
import { formatDate } from "../../utils";

const Dashboard = () => {
  const dashboardApiHook = useApi(dashboardApi.getAdmin);

  const paymentApiHook = useApi(paymentRequestApi.getAll);
  const materialApiHook = useApi(materialRequestApi.getAll);
  const attendanceApiHook = useApi(attendanceApi.getAll);

  useEffect(() => {
    dashboardApiHook.execute();
    paymentApiHook.execute();
    materialApiHook.execute();
    attendanceApiHook.execute();
  }, [
    dashboardApiHook.execute,
    paymentApiHook.execute,
    materialApiHook.execute,
    attendanceApiHook.execute,
  ]);

  const data = dashboardApiHook.data?.data || {};
  const requests = data.requests || {};
  const latestExpenses = Array.isArray(data.latestExpenses) ? data.latestExpenses : [];
  const siteWiseExpenseSummary = Array.isArray(data.siteWiseExpenseSummary) ? data.siteWiseExpenseSummary : [];

  const stats = [
    { label: "Total Sites", value: data.totalSites || 0, icon: "🏢" },
    { label: "Total Workers", value: data.totalWorkers || 0, icon: "👷" },
    { label: "Total Materials", value: data.totalMaterials || 0, icon: "📦" },
    { label: "Pending Requests", value: requests.pending || 0, icon: "📋" },
    { label: "Approved Requests", value: requests.approved || 0, icon: "✅" },
    { label: "Rejected Requests", value: requests.rejected || 0, icon: "❌" },
  ];

  const statusBars = [
    { label: "Pending", value: requests.pending || 0, color: "bg-yellow-500" },
    { label: "Approved", value: requests.approved || 0, color: "bg-green-500" },
    { label: "Rejected", value: requests.rejected || 0, color: "bg-red-500" },
  ];
  const maxStatus = Math.max(1, ...statusBars.map((b) => b.value));

  const recentRaw = [
    ...(paymentApiHook.data?.data?.requests || []).map((r) => ({
      ...r,
      type: "Payment",
    })),
    ...(materialApiHook.data?.data?.requests || []).map((r) => ({
      ...r,
      type: "Material",
    })),
    ...(attendanceApiHook.data?.data?.attendances || []).map((r) => ({
      ...r,
      type: "Attendance",
    })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const requestColumns = [
    { key: "type", label: "Type" },
    {
      key: "siteName",
      label: "Site",
      render: (_, row) => row.siteId?.name || "—",
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value) => formatDate(value),
    },
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
  ];

  const expenseColumns = [
    {
      key: "siteName",
      label: "Site",
      render: (_, row) => row.siteId?.name || "—",
    },
    {
      key: "paymentPurpose",
      label: "Payment Purpose",
      render: (_, row) => row.paymentRequestId?.purpose || "—",
    },
    { key: "purpose", label: "Expense Purpose" },
    {
      key: "amount",
      label: "Amount",
      render: (value) => `₹${value ?? 0}`,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value) => formatDate(value),
    },
  ];

  const siteWiseColumns = [
    { key: "siteName", label: "Site Name" },
    {
      key: "approvedAmount",
      label: "Approved Amount",
      render: (value) => `₹${value ?? 0}`,
    },
    {
      key: "expenseUsed",
      label: "Expense Used",
      render: (value) => `₹${value ?? 0}`,
    },
    {
      key: "remainingBalance",
      label: "Remaining Balance",
      render: (value) => `₹${value ?? 0}`,
    },
  ];

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Dashboard</h1>
        <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">Overview of your construction sites</p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {stats.map((stat, index) => (
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
                  <p className="text-lg sm:text-2xl font-bold text-secondary-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className="text-2xl sm:text-3xl">{stat.icon}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card title="Request Status Overview" subtitle="Pending, approved and rejected requests">
            <div className="space-y-3 sm:space-y-4">
              {statusBars.map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                    <span>{bar.label}</span>
                    <span className="font-medium text-secondary-900 dark:text-white">{bar.value}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-secondary-100 dark:bg-secondary-700 overflow-hidden">
                    <div
                      className={`h-full ${bar.color}`}
                      style={{ width: `${(bar.value / maxStatus) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card title="Quick Actions">
            <div className="space-y-2 sm:space-y-3">
              <Link to={ROUTES.WORKERS} className="block p-2.5 sm:p-3 bg-secondary-50 dark:bg-secondary-700/30 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-theme">
                <span className="font-medium text-secondary-900 dark:text-white text-sm sm:text-base">Add Worker</span>
              </Link>
              <Link to={ROUTES.MATERIALS} className="block p-2.5 sm:p-3 bg-secondary-50 dark:bg-secondary-700/30 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-theme">
                <span className="font-medium text-secondary-900 dark:text-white text-sm sm:text-base">Add Material</span>
              </Link>
              <Link to={ROUTES.SITES} className="block p-2.5 sm:p-3 bg-secondary-50 dark:bg-secondary-700/30 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-theme">
                <span className="font-medium text-secondary-900 dark:text-white text-sm sm:text-base">Add Site</span>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Card title="Latest Expenses" subtitle="Recently recorded site expenses">
            <Table
              columns={expenseColumns}
              data={latestExpenses}
              isLoading={dashboardApiHook.status === API_STATUS.LOADING}
              emptyMessage="No expenses recorded"
            />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card title="Site-wise Expense Summary" subtitle="Approved vs used per site">
            <Table
              columns={siteWiseColumns}
              data={siteWiseExpenseSummary}
              isLoading={dashboardApiHook.status === API_STATUS.LOADING}
              emptyMessage="No expenses recorded"
            />
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card title="Recent Requests" subtitle="Latest requests from sites">
          <Table
            columns={requestColumns}
            data={recentRaw}
            isLoading={dashboardApiHook.status === API_STATUS.LOADING}
            emptyMessage="No requests found"
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
