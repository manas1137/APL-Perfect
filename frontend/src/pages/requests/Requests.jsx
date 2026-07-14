import { useEffect, useState } from "react";
import { Card } from "../../components/cards";
import { Table } from "../../components/tables";
import { SearchBar } from "../../components/common";
import { Modal } from "../../components/modals";
import { Button } from "../../components/buttons";
import { useApi } from "../../hooks/useApi";
import {
  paymentRequestApi,
  materialRequestApi,
  expenseApi,
  attendanceApi,
} from "../../api";
import { API_STATUS } from "../../constants";
import { toast } from "react-hot-toast";
import { formatDate, formatDateTime } from "../../utils";

const TABS = [
  { key: "attendance", label: "Attendance" },
  { key: "material", label: "Material" },
  { key: "payment", label: "Payment" },
  { key: "expense", label: "Expense" },
];

const Requests = () => {
  const paymentApiHook = useApi(paymentRequestApi.getAll);
  const materialApiHook = useApi(materialRequestApi.getAll);
  const expenseApiHook = useApi(expenseApi.getAdminSummary);
  const attendanceApiHook = useApi(attendanceApi.getAll);
  const paymentDetailApi = useApi(paymentRequestApi.getById);
  const materialDetailApi = useApi(materialRequestApi.getById);
  const attendanceDetailApi = useApi(attendanceApi.getById);
  const expenseDetailApi = useApi(expenseApi.getAdminDetail);
  const [activeTab, setActiveTab] = useState("attendance");
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [adminRemark, setAdminRemark] = useState("");
  const [materialAdminRemark, setMaterialAdminRemark] = useState("");
  const [attendanceAdminRemark, setAttendanceAdminRemark] = useState("");

  useEffect(() => {
    paymentApiHook.execute();
    materialApiHook.execute();
    expenseApiHook.execute();
    attendanceApiHook.execute();
  }, [
    paymentApiHook.execute,
    materialApiHook.execute,
    expenseApiHook.execute,
    attendanceApiHook.execute,
  ]);

  useEffect(() => {
    if (selectedPayment) {
      paymentDetailApi.execute(selectedPayment);
    }
  }, [selectedPayment, paymentDetailApi.execute]);

  useEffect(() => {
    if (selectedMaterial) {
      materialDetailApi.execute(selectedMaterial);
    }
  }, [selectedMaterial, materialDetailApi.execute]);

  useEffect(() => {
    if (selectedAttendance) {
      attendanceDetailApi.execute(selectedAttendance);
    }
  }, [selectedAttendance, attendanceDetailApi.execute]);

  useEffect(() => {
    if (selectedExpense) {
      expenseDetailApi.execute(selectedExpense);
    }
  }, [selectedExpense, expenseDetailApi.execute]);

  const refreshAll = () => {
    paymentApiHook.execute();
    materialApiHook.execute();
    expenseApiHook.execute();
    attendanceApiHook.execute();
  };

  const normalizePayment = (raw) => ({
    _id: raw._id,
    type: "Payment",
    siteName: raw.siteId?.name || "—",
    submittedBy: raw.requestedBy || raw.submittedBy || "—",
    createdAt: raw.createdAt,
    status: raw.status,
    remark: raw.adminRemark || "—",
  });

  const normalizeMaterial = (raw) => ({
    _id: raw._id,
    type: "Material",
    siteName: raw.siteId?.name || "—",
    submittedBy: raw.requestedBy || raw.submittedBy || "—",
    createdAt: raw.createdAt,
    status: raw.status,
    remark: raw.adminRemark || "—",
  });

  const normalizeAttendance = (raw) => ({
    _id: raw._id,
    type: "Attendance",
    siteName: raw.siteId?.name || "—",
    date: raw.date,
    totalWorkers: raw.totalWorkers || 0,
    status: raw.status,
    createdAt: raw.createdAt,
    remark: raw.adminRemark || "—",
    submittedBy: raw.submittedBy || "—",
  });

  const normalizeExpense = (raw) => ({
    _id: raw._id,
    type: "Expense",
    siteName: raw.siteId?.name || "—",
    purpose: raw.purpose || "—",
    approvedAmount: raw.amount ?? 0,
    expenseUsed: raw.expenseUsed ?? 0,
    remainingBalance: raw.remainingBalance ?? 0,
    status: raw.status,
    createdAt: raw.createdAt,
    remark: "—",
    submittedBy: raw.siteId?.name || "—",
  });

  const paymentList = (paymentApiHook.data?.data?.requests || []).map((r) =>
    normalizePayment(r)
  );
  const materialList = (materialApiHook.data?.data?.requests || []).map((r) =>
    normalizeMaterial(r)
  );
  const expenseList = (expenseApiHook.data?.data || []).map((r) =>
    normalizeExpense(r)
  );
  const attendanceList = (attendanceApiHook.data?.data?.attendances || []).map(
    (r) => normalizeAttendance(r)
  );

  const allByTab = {
    payment: paymentList,
    material: materialList,
    expense: expenseList,
    attendance: attendanceList,
  };

  const requests = allByTab[activeTab].filter((r) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      r.siteName.toLowerCase().includes(term) ||
      (r.submittedBy && r.submittedBy.toLowerCase().includes(term)) ||
      r.status.toLowerCase().includes(term)
    );
  });

  const handleDetailReview = async (action) => {
    if (!selectedPayment) return;
    try {
      if (action === "approve") {
        await paymentRequestApi.approve(selectedPayment, adminRemark);
        toast.success("Payment request approved successfully");
      } else {
        await paymentRequestApi.reject(selectedPayment, adminRemark);
        toast.success("Payment request rejected successfully");
      }
      setSelectedPayment(null);
      setAdminRemark("");
      refreshAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to review request");
    }
  };

  const handleMaterialDetailReview = async (action) => {
    if (!selectedMaterial) return;
    try {
      if (action === "approve") {
        await materialRequestApi.approve(selectedMaterial, materialAdminRemark);
        toast.success("Material request approved successfully");
      } else {
        await materialRequestApi.reject(selectedMaterial, materialAdminRemark);
        toast.success("Material request rejected successfully");
      }
      setSelectedMaterial(null);
      setMaterialAdminRemark("");
      refreshAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to review request");
    }
  };

  const handleAttendanceDetailReview = async (action) => {
    if (!selectedAttendance) return;
    try {
      if (action === "approve") {
        await attendanceApi.approve(selectedAttendance, attendanceAdminRemark);
        toast.success("Attendance approved successfully");
      } else {
        await attendanceApi.reject(selectedAttendance, attendanceAdminRemark);
        toast.success("Attendance rejected successfully");
      }
      setSelectedAttendance(null);
      setAttendanceAdminRemark("");
      refreshAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to review request");
    }
  };

  const openDetail = (id, type) => {
    if (type === "Payment") {
      setSelectedPayment(id);
      setAdminRemark("");
    } else if (type === "Material") {
      setSelectedMaterial(id);
      setMaterialAdminRemark("");
    } else if (type === "Attendance") {
      setSelectedAttendance(id);
      setAttendanceAdminRemark("");
    } else if (type === "Expense") {
      setSelectedExpense(id);
    }
  };

  const paymentDetail = paymentDetailApi.data?.data || null;
  const activePaymentDetail = paymentDetail && paymentDetail._id === selectedPayment ? paymentDetail : null;

  const materialDetail = materialDetailApi.data?.data || null;
  const activeMaterialDetail = materialDetail && materialDetail._id === selectedMaterial ? materialDetail : null;

  const attendanceDetail = attendanceDetailApi.data?.data || null;
  const activeAttendanceDetail = attendanceDetail && attendanceDetail._id === selectedAttendance ? attendanceDetail : null;

  const expenseDetail = expenseDetailApi.data?.data || null;
  const activeExpenseDetail = expenseDetail && expenseDetail.paymentRequest?._id === selectedExpense ? expenseDetail : null;

  const statusRender = (value) => (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
      value === "approved"
        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
        : value === "pending"
        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    }`}>
      {value ? value.charAt(0).toUpperCase() + value.slice(1) : "Unknown"}
    </span>
  );

  const actionsRender = (_, row) => {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); openDetail(row._id, row.type); }}>
          View Details
        </Button>
        {row.status === "pending" && (
          <>
            <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); openDetail(row._id, row.type); }}>
              Reject
            </Button>
            <Button size="sm" onClick={(e) => { e.stopPropagation(); openDetail(row._id, row.type); }}>
              Approve
            </Button>
          </>
        )}
      </div>
    );
  };

  const paymentColumns = [
    { key: "siteName", label: "Site Name" },
    { key: "type", label: "Request Type" },
    { key: "submittedBy", label: "Submitted By" },
    {
      key: "createdAt",
      label: "Created Date",
      render: (value) => formatDate(value),
    },
    { key: "status", label: "Status", render: statusRender },
    { key: "remark", label: "Remarks" },
    { key: "actions", label: "Actions", render: actionsRender },
  ];

  const materialColumns = [
    { key: "siteName", label: "Site Name" },
    { key: "type", label: "Request Type" },
    { key: "submittedBy", label: "Submitted By" },
    {
      key: "createdAt",
      label: "Created Date",
      render: (value) => formatDate(value),
    },
    { key: "status", label: "Status", render: statusRender },
    { key: "remark", label: "Remarks" },
    { key: "actions", label: "Actions", render: actionsRender },
  ];

  const attendanceColumns = [
    { key: "siteName", label: "Site Name" },
    {
      key: "date",
      label: "Attendance Date",
      render: (value) => formatDate(value),
    },
    {
      key: "totalWorkers",
      label: "Total Workers",
      render: (value) => value ?? 0,
    },
    { key: "status", label: "Status", render: statusRender },
    {
      key: "createdAt",
      label: "Requested Date",
      render: (value) => formatDate(value),
    },
    { key: "actions", label: "Actions", render: actionsRender },
  ];

  const expenseColumns = [
    { key: "siteName", label: "Site Name" },
    { key: "purpose", label: "Payment Purpose" },
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
    { key: "status", label: "Status", render: statusRender },
    { key: "actions", label: "Actions", render: actionsRender },
  ];

  const columnsByTab = {
    payment: paymentColumns,
    material: materialColumns,
    attendance: attendanceColumns,
    expense: expenseColumns,
  };

  const currentColumns = columnsByTab[activeTab] || [];
  const currentRequests = requests ?? [];

  const isLoading =
    paymentApiHook.status === API_STATUS.LOADING ||
    materialApiHook.status === API_STATUS.LOADING ||
    expenseApiHook.status === API_STATUS.LOADING ||
    attendanceApiHook.status === API_STATUS.LOADING;

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Requests</h1>
        <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">Manage all requests</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
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
            {tab.label} Requests
          </button>
        ))}
      </div>

      <Card>
        <div className="mb-3 sm:mb-4">
          <SearchBar placeholder="Search by site, submitted by or status..." onSearch={setSearch} />
        </div>
        <Table
          columns={currentColumns}
          data={currentRequests}
          isLoading={isLoading}
          emptyMessage="No requests found"
        />
      </Card>

      {/* Payment Detail Modal */}
      <Modal
        isOpen={!!selectedPayment}
        onClose={() => {
          setSelectedPayment(null);
          setAdminRemark("");
        }}
        title="Payment Request Details"
        subtitle={activePaymentDetail ? `${activePaymentDetail.siteId?.name || "—"} · ${formatDate(activePaymentDetail.date)}` : "Loading..."}
        footer={
          activePaymentDetail?.status === "pending" ? (
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full">
              <Button variant="secondary" onClick={() => { setSelectedPayment(null); setAdminRemark(""); }}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleDetailReview("reject")}>
                Reject
              </Button>
              <Button onClick={() => handleDetailReview("approve")}>
                Approve
              </Button>
            </div>
          ) : null
        }
      >
        {activePaymentDetail ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Site Name</p>
                <p className="font-medium text-secondary-900 dark:text-white">{activePaymentDetail.siteId?.name || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Site Owner</p>
                <p className="font-medium text-secondary-900 dark:text-white">{activePaymentDetail.siteId?.ownerName || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Location</p>
                <p className="font-medium text-secondary-900 dark:text-white">{activePaymentDetail.siteLocation || activePaymentDetail.siteId?.location || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Purpose</p>
                <p className="font-medium text-secondary-900 dark:text-white">{activePaymentDetail.purpose || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Amount</p>
                <p className="font-medium text-secondary-900 dark:text-white">{activePaymentDetail.amount != null ? `₹${activePaymentDetail.amount}` : "—"}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Requested By</p>
                <p className="font-medium text-secondary-900 dark:text-white">{activePaymentDetail.requestedBy || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Requested Date & Time</p>
                <p className="font-medium text-secondary-900 dark:text-white">{formatDateTime(activePaymentDetail.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Current Status</p>
                <p className={`font-medium capitalize ${activePaymentDetail.status === "approved" ? "text-green-600 dark:text-green-400" : activePaymentDetail.status === "rejected" ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"}`}>
                  {activePaymentDetail.status || "—"}
                </p>
              </div>
              {activePaymentDetail.note && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">Note</p>
                  <p className="font-medium text-secondary-900 dark:text-white">{activePaymentDetail.note}</p>
                </div>
              )}
              {activePaymentDetail.status !== "pending" && (
                <>
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Admin Remark</p>
                    <p className="font-medium text-secondary-900 dark:text-white">{activePaymentDetail.adminRemark || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Reviewed By</p>
                    <p className="font-medium text-secondary-900 dark:text-white">{activePaymentDetail.reviewedBy ? "Reviewed by Admin" : "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Reviewed Date</p>
                    <p className="font-medium text-secondary-900 dark:text-white">{formatDateTime(activePaymentDetail.reviewedAt)}</p>
                  </div>
                </>
              )}
            </div>

            {activePaymentDetail.status === "pending" && (
              <div className="border-t border-secondary-200 dark:border-secondary-700 pt-4">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Admin Remark (optional)
                </label>
                <textarea
                  value={adminRemark}
                  onChange={(e) => setAdminRemark(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-sm text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter remark for approve/reject..."
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-secondary-500">Loading details...</p>
        )}
      </Modal>

      {/* Material Detail Modal */}
      <Modal
        isOpen={!!selectedMaterial}
        onClose={() => {
          setSelectedMaterial(null);
          setMaterialAdminRemark("");
        }}
        title="Material Request Details"
        subtitle={activeMaterialDetail ? `${activeMaterialDetail.siteId?.name || "—"} · ${formatDate(activeMaterialDetail.date)}` : "Loading..."}
        footer={
          activeMaterialDetail?.status === "pending" ? (
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full">
              <Button variant="secondary" onClick={() => { setSelectedMaterial(null); setMaterialAdminRemark(""); }}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleMaterialDetailReview("reject")}>
                Reject
              </Button>
              <Button onClick={() => handleMaterialDetailReview("approve")}>
                Approve
              </Button>
            </div>
          ) : null
        }
      >
        {activeMaterialDetail ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Site Name</p>
                <p className="font-medium text-secondary-900 dark:text-white">{activeMaterialDetail.siteId?.name || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Site Owner</p>
                <p className="font-medium text-secondary-900 dark:text-white">{activeMaterialDetail.siteId?.ownerName || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Requested By</p>
                <p className="font-medium text-secondary-900 dark:text-white">{activeMaterialDetail.requestedBy || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Requested Date & Time</p>
                <p className="font-medium text-secondary-900 dark:text-white">{formatDateTime(activeMaterialDetail.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Current Status</p>
                <p className={`font-medium capitalize ${activeMaterialDetail.status === "approved" ? "text-green-600 dark:text-green-400" : activeMaterialDetail.status === "rejected" ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"}`}>
                  {activeMaterialDetail.status || "—"}
                </p>
              </div>
              {activeMaterialDetail.note && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">Note</p>
                  <p className="font-medium text-secondary-900 dark:text-white">{activeMaterialDetail.note}</p>
                </div>
              )}
              {activeMaterialDetail.status !== "pending" && (
                <>
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Admin Remark</p>
                    <p className="font-medium text-secondary-900 dark:text-white">{activeMaterialDetail.adminRemark || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Reviewed By</p>
                    <p className="font-medium text-secondary-900 dark:text-white">{activeMaterialDetail.reviewedBy ? "Reviewed by Admin" : "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Reviewed Date</p>
                    <p className="font-medium text-secondary-900 dark:text-white">{formatDateTime(activeMaterialDetail.reviewedAt)}</p>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-secondary-200 dark:border-secondary-700 pt-4">
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Materials ({activeMaterialDetail.materials?.length || 0})
              </p>
              <div className="space-y-2">
                {(activeMaterialDetail.materials || []).map((m, idx) => (
                  <div
                    key={m.materialId || idx}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary-50 dark:bg-secondary-700/30"
                  >
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-white">{m.name}</p>
                      <p className="text-xs text-secondary-500">
                        {m.quantity} {m.unit} · ₹{m.price} each
                      </p>
                    </div>
                    <p className="text-sm font-medium text-secondary-900 dark:text-white">
                      ₹{(m.quantity * m.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-right text-sm font-medium text-secondary-900 dark:text-white">
                Grand Total: ₹{(activeMaterialDetail.materials || []).reduce((sum, m) => sum + (m.quantity * m.price), 0).toFixed(2)}
              </div>
            </div>

            {activeMaterialDetail.status === "pending" && (
              <div className="border-t border-secondary-200 dark:border-secondary-700 pt-4">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Admin Remark (optional)
                </label>
                <textarea
                  value={materialAdminRemark}
                  onChange={(e) => setMaterialAdminRemark(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-sm text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter remark for approve/reject..."
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-secondary-500">Loading details...</p>
        )}
      </Modal>

      {/* Attendance Detail Modal */}
      <Modal
        isOpen={!!selectedAttendance}
        onClose={() => {
          setSelectedAttendance(null);
          setAttendanceAdminRemark("");
        }}
        title="Attendance Request Details"
        subtitle={activeAttendanceDetail ? `${activeAttendanceDetail.siteId?.name || "—"} · ${formatDate(activeAttendanceDetail.date)}` : "Loading..."}
        footer={
          activeAttendanceDetail?.status === "pending" ? (
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full">
              <Button variant="secondary" onClick={() => { setSelectedAttendance(null); setAttendanceAdminRemark(""); }}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleAttendanceDetailReview("reject")}>
                Reject
              </Button>
              <Button onClick={() => handleAttendanceDetailReview("approve")}>
                Approve
              </Button>
            </div>
          ) : null
        }
      >
        {activeAttendanceDetail ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Site Name</p>
                <p className="font-medium text-secondary-900 dark:text-white">{activeAttendanceDetail.siteId?.name || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Site Owner</p>
                <p className="font-medium text-secondary-900 dark:text-white">{activeAttendanceDetail.siteId?.ownerName || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Location</p>
                <p className="font-medium text-secondary-900 dark:text-white">{activeAttendanceDetail.siteId?.location || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Attendance Date</p>
                <p className="font-medium text-secondary-900 dark:text-white">{formatDate(activeAttendanceDetail.date)}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Requested By</p>
                <p className="font-medium text-secondary-900 dark:text-white">{activeAttendanceDetail.submittedBy || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Requested Date & Time</p>
                <p className="font-medium text-secondary-900 dark:text-white">{formatDateTime(activeAttendanceDetail.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Total Present</p>
                <p className="font-medium text-secondary-900 dark:text-white">
                  {(activeAttendanceDetail.workers || []).filter((w) => w.status === "present").length}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Total Absent</p>
                <p className="font-medium text-secondary-900 dark:text-white">
                  {(activeAttendanceDetail.workers || []).filter((w) => w.status === "absent").length}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Current Status</p>
                <p className={`font-medium capitalize ${activeAttendanceDetail.status === "approved" ? "text-green-600 dark:text-green-400" : activeAttendanceDetail.status === "rejected" ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"}`}>
                  {activeAttendanceDetail.status || "—"}
                </p>
              </div>
              {activeAttendanceDetail.status !== "pending" && (
                <>
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Admin Remark</p>
                    <p className="font-medium text-secondary-900 dark:text-white">{activeAttendanceDetail.adminRemark || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Reviewed By</p>
                    <p className="font-medium text-secondary-900 dark:text-white">{activeAttendanceDetail.reviewedBy ? "Reviewed by Admin" : "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Reviewed Date</p>
                    <p className="font-medium text-secondary-900 dark:text-white">{formatDateTime(activeAttendanceDetail.reviewedAt)}</p>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-secondary-200 dark:border-secondary-700 pt-4">
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Attendance List ({(activeAttendanceDetail.workers || []).length})
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-secondary-200 dark:border-secondary-700">
                      <th className="px-3 py-2 text-left text-xs font-medium text-secondary-600 dark:text-secondary-400 uppercase">Worker Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-secondary-600 dark:text-secondary-400 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeAttendanceDetail.workers || []).map((w, idx) => (
                      <tr key={w.workerId || idx} className="border-b border-secondary-100 dark:border-secondary-700 last:border-0">
                        <td className="px-3 py-2 text-secondary-900 dark:text-white">{w.name}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            w.status === "present"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}>
                            {w.status ? w.status.charAt(0).toUpperCase() + w.status.slice(1) : "Unknown"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {activeAttendanceDetail.status === "pending" && (
              <div className="border-t border-secondary-200 dark:border-secondary-700 pt-4">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Admin Remark (optional)
                </label>
                <textarea
                  value={attendanceAdminRemark}
                  onChange={(e) => setAttendanceAdminRemark(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-sm text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter remark for approve/reject..."
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-secondary-500">Loading details...</p>
        )}
      </Modal>

      {/* Expense Detail Modal */}
      <Modal
        isOpen={!!selectedExpense}
        onClose={() => setSelectedExpense(null)}
        title="Expense Details"
        subtitle={activeExpenseDetail ? `${activeExpenseDetail.paymentRequest?.siteId?.name || "—"} · ${activeExpenseDetail.paymentRequest?.purpose || ""}` : "Loading..."}
      >
        {activeExpenseDetail ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Site Name</p>
                <p className="font-medium text-secondary-900 dark:text-white">{activeExpenseDetail.paymentRequest?.siteId?.name || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Payment Purpose</p>
                <p className="font-medium text-secondary-900 dark:text-white">{activeExpenseDetail.paymentRequest?.purpose || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Status</p>
                <p className={`font-medium capitalize ${activeExpenseDetail.summary?.status === "Open" ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}`}>
                  {activeExpenseDetail.summary?.status || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Approved Amount</p>
                <p className="font-medium text-secondary-900 dark:text-white">₹{activeExpenseDetail.summary?.approvedAmount ?? 0}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Expense Used</p>
                <p className="font-medium text-secondary-900 dark:text-white">₹{activeExpenseDetail.summary?.expenseUsed ?? 0}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Remaining Balance</p>
                <p className="font-medium text-secondary-900 dark:text-white">₹{activeExpenseDetail.summary?.remainingBalance ?? 0}</p>
              </div>
            </div>

            <div className="border-t border-secondary-200 dark:border-secondary-700 pt-4">
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Expense History ({activeExpenseDetail.expenses?.length || 0})
              </p>
              {!activeExpenseDetail.expenses || activeExpenseDetail.expenses.length === 0 ? (
                <p className="text-sm text-secondary-500 dark:text-secondary-400">No expenses recorded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-secondary-200 dark:border-secondary-700">
                        <th className="px-3 py-2 text-left text-xs font-medium text-secondary-600 dark:text-secondary-400 uppercase">Expense Purpose</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-secondary-600 dark:text-secondary-400 uppercase">Amount</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-secondary-600 dark:text-secondary-400 uppercase">Description</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-secondary-600 dark:text-secondary-400 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeExpenseDetail.expenses.map((expense) => (
                        <tr key={expense._id} className="border-b border-secondary-100 dark:border-secondary-700 last:border-0">
                          <td className="px-3 py-2 text-secondary-900 dark:text-white">{expense.purpose}</td>
                          <td className="px-3 py-2 text-secondary-900 dark:text-white">₹{expense.amount}</td>
                          <td className="px-3 py-2 text-secondary-500 dark:text-secondary-400">{expense.description || "—"}</td>
                          <td className="px-3 py-2 text-secondary-500 dark:text-secondary-400">{formatDate(expense.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-secondary-500">Loading details...</p>
        )}
      </Modal>
    </div>
  );
};

export default Requests;
