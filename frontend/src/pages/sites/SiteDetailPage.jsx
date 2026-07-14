import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "../../components/cards";
import { Table } from "../../components/tables";
import { Button } from "../../components/buttons";
import { useApi } from "../../hooks/useApi";
import {
  siteApi,
  paymentRequestApi,
  materialRequestApi,
  expenseApi,
  attendanceApi,
  materialApi,
} from "../../api";
import { API_STATUS } from "../../constants";
import { formatDate, formatDateTime, formatCurrency } from "../../utils";
import { Modal } from "../../components/modals";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "workers", label: "Assigned Workers" },
  { key: "materials", label: "Materials" },
  { key: "requests", label: "Requests" },
];

const STATUS_CLASS = {
  approved: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

const StatusBadge = ({ value }) => (
  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_CLASS[value] || "bg-gray-100 text-gray-800"}`}>
    {value ? value.charAt(0).toUpperCase() + value.slice(1) : "Unknown"}
  </span>
);

const Field = ({ label, children }) => (
  <div>
    <p className="text-secondary-500 dark:text-secondary-400 text-sm">{label}</p>
    <p className="font-medium text-secondary-900 dark:text-white text-sm sm:text-base break-words">
      {children || "—"}
    </p>
  </div>
);

const getTitle = (row) => {
  if (row.type === "Attendance") {
    const d = row.date ? new Date(row.date) : null;
    return d
      ? `Attendance for ${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getFullYear()}`
      : "Attendance";
  }
  if (row.type === "Material")
    return (row.materials || []).map((m) => m.name).join(", ") || "—";
  if (row.type === "Payment") return row.purpose || "—";
  if (row.type === "Expense") return row.purpose || "—";
  return "—";
};

const getSubmittedBy = (row) =>
  row.submittedBy || row.requestedBy || row.siteId?.name || "—";

const getDate = (row) => row.createdAt || row.date;

const SiteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const siteApiHook = useApi(() => siteApi.getById(id));
  const statsApiHook = useApi(() => siteApi.getStats(id));
  const workersApiHook = useApi(() => siteApi.getAssignedWorkers(id));
  const materialsApiHook = useApi(() => materialApi.getAll());
  const paymentApiHook = useApi(() => paymentRequestApi.getAll({ siteId: id }));
  const materialApiHook = useApi(() => materialRequestApi.getAll({ siteId: id }));
  const expenseApiHook = useApi(() => expenseApi.getAdminHistory());
  const attendanceApiHook = useApi(() => attendanceApi.getAll({ siteId: id }));

  useEffect(() => {
    siteApiHook.execute();
    statsApiHook.execute();
    workersApiHook.execute();
    materialsApiHook.execute();
    paymentApiHook.execute();
    materialApiHook.execute();
    expenseApiHook.execute();
    attendanceApiHook.execute();
  }, [id]);

  const site = siteApiHook.data?.data;
  const stats = statsApiHook.data?.data;
  const workers = workersApiHook.data?.data || [];
  const allMaterials = materialsApiHook.data?.data || [];

  const allRequests = [
    ...(attendanceApiHook.data?.data?.attendances || []).map((r) => ({ ...r, type: "Attendance" })),
    ...(paymentApiHook.data?.data?.requests || []).map((r) => ({ ...r, type: "Payment" })),
    ...(materialApiHook.data?.data?.requests || []).map((r) => ({ ...r, type: "Material" })),
    ...(expenseApiHook.data?.data || [])
      .filter((e) => e.siteId?._id?.toString() === id)
      .map((r) => ({ ...r, type: "Expense", status: "approved" })),
  ].sort(
    (a, b) =>
      new Date(getDate(b) || 0).getTime() - new Date(getDate(a) || 0).getTime()
  );

  const requestColumns = [
    { key: "type", label: "Request Type" },
    {
      key: "submittedBy",
      label: "Submitted By",
      render: (_, row) => getSubmittedBy(row),
    },
    {
      key: "title",
      label: "Title / Purpose",
      render: (_, row) => getTitle(row),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge value={value} />,
    },
    {
      key: "date",
      label: "Date",
      render: (_, row) => (getDate(row) ? formatDate(getDate(row)) : "—"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <button
          onClick={() => setSelectedRequest(row)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary-600 hover:bg-primary-700 text-white"
        >
          View
        </button>
      ),
    },
  ];

  const workerColumns = [
    { key: "name", label: "Name" },
    { key: "mobileNumber", label: "Phone" },
    {
      key: "isActive",
      label: "Status",
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === true ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
        }`}>
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    { key: "createdAt", label: "Joined Date", render: (value) => value ? new Date(value).toLocaleDateString() : "-" },
  ];

  const materialColumns = [
    { key: "name", label: "Material Name" },
    { key: "unit", label: "Unit" },
    {
      key: "unitPrice",
      label: "Unit Price",
      render: (value) => `₹${value}`,
    },
    { key: "note", label: "Description" },
    {
      key: "isActive",
      label: "Status",
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === true ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
        }`}>
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    { key: "createdAt", label: "Created Date", render: (value) => value ? new Date(value).toLocaleDateString() : "-" },
  ];

  const renderDetails = (row) => {
    if (!row) return null;

    if (row.type === "Attendance") {
      const workers = row.workers || [];
      const present = workers.filter((w) => w.status === "present").length;
      const absent = workers.filter((w) => w.status === "absent").length;
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Site Name">{row.siteId?.name}</Field>
            <Field label="Submitted By">{row.submittedBy}</Field>
            <Field label="Date">{formatDate(row.date)}</Field>
            <Field label="Status"><StatusBadge value={row.status} /></Field>
            <Field label="Present Workers">{present}</Field>
            <Field label="Absent Workers">{absent}</Field>
            <Field label="Approved By">{row.reviewedBy ? "Approved by Admin" : "—"}</Field>
            <Field label="Approved Time">{row.reviewedAt ? formatDateTime(row.reviewedAt) : "—"}</Field>
            <Field label="Remarks">{row.adminRemark}</Field>
          </div>
          <div className="border-t border-secondary-200 dark:border-secondary-700 pt-3">
            <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Worker List ({workers.length})
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {workers.map((w, idx) => (
                <div
                  key={w.workerId || idx}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary-50 dark:bg-secondary-700/30"
                >
                  <span className="text-sm text-secondary-900 dark:text-white">{w.name}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    w.status === "present"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}>
                    {w.status === "present" ? "Present" : "Absent"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (row.type === "Material") {
      return (
        <div className="space-y-3">
          <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary-50 dark:bg-secondary-800 text-left text-secondary-600 dark:text-secondary-400">
                  <th className="px-3 py-2">Material Name</th>
                  <th className="px-3 py-2">Qty</th>
                  <th className="px-3 py-2">Unit</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {(row.materials || []).map((m, idx) => (
                  <tr key={idx} className="border-t border-secondary-200 dark:border-secondary-700">
                    <td className="px-3 py-2 text-secondary-900 dark:text-white">{m.name}</td>
                    <td className="px-3 py-2 text-secondary-900 dark:text-white">{m.quantity}</td>
                    <td className="px-3 py-2 text-secondary-900 dark:text-white">{m.unit}</td>
                    <td className="px-3 py-2 text-secondary-900 dark:text-white">{formatCurrency(m.price)}</td>
                    <td className="px-3 py-2 text-secondary-900 dark:text-white">
                      {formatCurrency((m.quantity || 0) * (m.price || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Note">{row.note}</Field>
            <Field label="Status"><StatusBadge value={row.status} /></Field>
            <Field label="Submitted Date">
              {formatDate(row.createdAt || row.date)}
            </Field>
            <Field label="Reviewed By">{row.reviewedBy ? "Reviewed by Admin" : "—"}</Field>
            <Field label="Reviewed Date">
              {row.reviewedAt ? formatDate(row.reviewedAt) : "—"}
            </Field>
          </div>
        </div>
      );
    }

    if (row.type === "Payment") {
      return (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Purpose">{row.purpose}</Field>
          <Field label="Amount">{formatCurrency(row.amount)}</Field>
          <Field label="Note">{row.note}</Field>
          <Field label="Requested By">{row.requestedBy}</Field>
          <Field label="Site Name">{row.siteId?.name}</Field>
          <Field label="Status"><StatusBadge value={row.status} /></Field>
          <Field label="Reviewed By">{row.reviewedBy ? "Reviewed by Admin" : "—"}</Field>
          <Field label="Reviewed Date">
            {row.reviewedAt ? formatDate(row.reviewedAt) : "—"}
          </Field>
        </div>
      );
    }

    if (row.type === "Expense") {
      return (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Expense Purpose">{row.purpose}</Field>
          <Field label="Amount">{formatCurrency(row.amount)}</Field>
          <Field label="Description">{row.description}</Field>
          <Field label="Payment Purpose">{row.paymentRequestId?.purpose}</Field>
          <Field label="Site">{row.siteId?.name}</Field>
          <Field label="Date">{formatDate(row.createdAt)}</Field>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3">
        <Field label="Title">{row.purpose}</Field>
        <Field label="Description">{row.note}</Field>
        <Field label="Site">{row.siteId?.name}</Field>
        <Field label="Requested By">{row.siteId?.name || row.mobileNumber}</Field>
        <Field label="Status"><StatusBadge value={row.status} /></Field>
        <Field label="Remarks">{row.adminRemark}</Field>
        <Field label="Submitted Date">{formatDate(row.createdAt)}</Field>
        <Field label="Reviewed By">{row.reviewedBy ? "Reviewed by Admin" : "—"}</Field>
      </div>
    );
  };

  const isLoading = siteApiHook.status === API_STATUS.LOADING;

  if (isLoading) {
    return (
      <div>
        <div className="mb-4 sm:mb-6">
          <div className="h-8 bg-secondary-200 dark:bg-secondary-700 rounded w-48 mb-2"></div>
          <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-64"></div>
        </div>
        <Card padding="md">
          <div className="space-y-4">
            <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-full"></div>
            <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-3/4"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!site) {
    return (
      <div>
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Site Not Found</h1>
          <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">The requested site could not be found.</p>
        </div>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">{site.name}</h1>
          <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">Site Details</p>
        </div>
        <Button variant="secondary" onClick={() => navigate(-1)}>Back to Sites</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card title="Site Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-secondary-600 dark:text-secondary-400">Site Manager</label>
                <p className="text-sm sm:text-base text-secondary-900 dark:text-white font-medium">{site.ownerName}</p>
              </div>
              <div>
                <label className="text-sm text-secondary-600 dark:text-secondary-400">Phone</label>
                <p className="text-sm sm:text-base text-secondary-900 dark:text-white font-medium">{site.ownerMobile}</p>
              </div>
              <div>
                <label className="text-sm text-secondary-600 dark:text-secondary-400">Email</label>
                <p className="text-sm sm:text-base text-secondary-900 dark:text-white font-medium">{site.ownerEmail || "-"}</p>
              </div>
              <div>
                <label className="text-sm text-secondary-600 dark:text-secondary-400">Address</label>
                <p className="text-sm sm:text-base text-secondary-900 dark:text-white font-medium">{site.location}</p>
              </div>
              <div>
                <label className="text-sm text-secondary-600 dark:text-secondary-400">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  site.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                }`}>
                  {site.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <label className="text-sm text-secondary-600 dark:text-secondary-400">Created Date</label>
                <p className="text-sm sm:text-base text-secondary-900 dark:text-white font-medium">
                  {site.createdAt ? new Date(site.createdAt).toLocaleDateString() : "-"}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card title="Statistics">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Total Workers</span>
                <span className="text-sm font-medium text-secondary-900 dark:text-white">{stats?.totalAssignedWorkers || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Present Today</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">{stats?.attendance?.presentToday || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Absent Today</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">{stats?.attendance?.absentToday || 0}</span>
              </div>
              <div className="border-t border-secondary-200 dark:border-secondary-700 pt-3 mt-3">
                <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 mb-2">Requests</p>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">Pending</span>
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{stats?.requests?.totalPending || 0}</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">Approved</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">{stats?.requests?.totalApproved || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">Rejected</span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">{stats?.requests?.totalRejected || 0}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-sm transition-theme min-h-[44px] sm:min-h-0 ${
                activeTab === tab.key
                  ? "bg-primary-600 text-white"
                  : "bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card padding="sm">
              <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Total Workers</p>
              <p className="text-lg sm:text-2xl font-bold text-secondary-900 dark:text-white mt-1">{stats?.totalAssignedWorkers || 0}</p>
            </Card>
            <Card padding="sm">
              <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Present Today</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats?.attendance?.presentToday || 0}</p>
            </Card>
            <Card padding="sm">
              <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Pending Requests</p>
              <p className="text-lg sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats?.requests?.totalPending || 0}</p>
            </Card>
            <Card padding="sm">
              <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Total Requests</p>
              <p className="text-lg sm:text-2xl font-bold text-secondary-900 dark:text-white mt-1">
                {(stats?.requests?.totalPending || 0) + (stats?.requests?.totalApproved || 0) + (stats?.requests?.totalRejected || 0)}
              </p>
            </Card>
          </div>
        </motion.div>
      )}

      {activeTab === "workers" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <Table
              columns={workerColumns}
              data={workers}
              isLoading={workersApiHook.status === API_STATUS.LOADING}
              emptyMessage="No assigned workers found"
            />
          </Card>
        </motion.div>
      )}

      {activeTab === "materials" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <Table
              columns={materialColumns}
              data={allMaterials}
              isLoading={materialsApiHook.status === API_STATUS.LOADING}
              emptyMessage="No materials found"
            />
          </Card>
        </motion.div>
      )}

      {activeTab === "requests" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <Table
              columns={requestColumns}
              data={allRequests}
              onRowClick={(row) => setSelectedRequest(row)}
              isLoading={
                paymentApiHook.status === API_STATUS.LOADING ||
                materialApiHook.status === API_STATUS.LOADING ||
                expenseApiHook.status === API_STATUS.LOADING ||
                attendanceApiHook.status === API_STATUS.LOADING
              }
              emptyMessage="No requests found for this site"
            />
          </Card>
        </motion.div>
      )}

      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title={selectedRequest ? `${selectedRequest.type} Request` : "Request Details"}
        subtitle={selectedRequest ? getTitle(selectedRequest) : ""}
      >
        {renderDetails(selectedRequest)}
      </Modal>
    </div>
  );
};

export default SiteDetailPage;
