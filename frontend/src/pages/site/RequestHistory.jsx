import { useEffect, useState } from "react";
import { Card } from "../../components/cards";
import { Table } from "../../components/tables";
import { SearchBar } from "../../components/common";
import { Modal } from "../../components/modals";
import { useApi } from "../../hooks/useApi";
import { paymentRequestApi, materialRequestApi, expenseApi, attendanceApi } from "../../api";
import { API_STATUS } from "../../constants";
import { formatDate, formatDateTime } from "../../utils";

const buildTitle = (r, type) => {
  if (type === "Payment") return `${r.purpose || "Payment"}${r.amount ? ` - ₹${r.amount}` : ""}`;
  if (type === "Material")
    return (r.materials || []).map((m) => `${m.name} (${m.quantity} ${m.unit || ""})`).join(", ");
  if (type === "Expense") return r.purpose || "Expense";
  if (type === "Attendance") {
    const d = r.date ? new Date(r.date) : null;
    return d && !isNaN(d.getTime())
      ? `Attendance for ${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getFullYear()}`
      : "Attendance";
  }
  return "";
};

const RequestHistory = () => {
  const paymentApiHook = useApi(paymentRequestApi.getHistory);
  const materialApiHook = useApi(materialRequestApi.getHistory);
  const expenseApiHook = useApi(expenseApi.getHistory);
  const attendanceApiHook = useApi(attendanceApi.getHistory);
  const materialDetailApi = useApi(materialRequestApi.getById);
  const [search, setSearch] = useState("");
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);

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
    if (selectedMaterialId) {
      materialDetailApi.execute(selectedMaterialId);
    }
  }, [selectedMaterialId, materialDetailApi.execute]);

  const toRow = (r, type) => ({
    _id: r._id,
    type,
    title: buildTitle(r, type),
    submittedDate: r.createdAt || r.date,
    status: r.status,
    adminRemark: r.adminRemark || "—",
    reviewedAt: r.reviewedAt,
  });

  const requests = [
    ...(Array.isArray(paymentApiHook.data?.data) ? paymentApiHook.data.data : []).map((r) => toRow(r, "Payment")),
    ...(Array.isArray(materialApiHook.data?.data) ? materialApiHook.data.data : []).map((r) => toRow(r, "Material")),
    ...(Array.isArray(expenseApiHook.data?.data) ? expenseApiHook.data.data : []).map((r) => toRow({ ...r, status: "approved" }, "Expense")),
    ...(Array.isArray(attendanceApiHook.data?.data) ? attendanceApiHook.data.data : []).map((r) => toRow(r, "Attendance")),
  ]
    .sort((a, b) => new Date(b.submittedDate || 0).getTime() - new Date(a.submittedDate || 0).getTime())
    .filter((r) => {
      if (!search) return true;
      const term = search.toLowerCase();
      return (
        r.title.toLowerCase().includes(term) ||
        r.type.toLowerCase().includes(term) ||
        r.status.toLowerCase().includes(term)
      );
    });

  const materialDetail = materialDetailApi.data?.data || null;
  const activeMaterialDetail = materialDetail && materialDetail._id === selectedMaterialId ? materialDetail : null;

  const columns = [
    { key: "type", label: "Request Type" },
    { key: "title", label: "Title / Description" },
    {
      key: "submittedDate",
      label: "Submitted Date",
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
    { key: "adminRemark", label: "Admin Remark" },
    {
      key: "reviewedAt",
      label: "Reviewed Date",
      render: (value) => formatDate(value),
    },
  ];

  const isLoading =
    paymentApiHook.status === API_STATUS.LOADING ||
    materialApiHook.status === API_STATUS.LOADING ||
    expenseApiHook.status === API_STATUS.LOADING ||
    attendanceApiHook.status === API_STATUS.LOADING;

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Request History</h1>
        <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">All your previous requests</p>
      </div>

      <Card>
        <div className="mb-3 sm:mb-4">
          <SearchBar placeholder="Search requests..." onSearch={setSearch} />
        </div>
        <Table
          columns={columns}
          data={requests}
          isLoading={isLoading}
          emptyMessage="No request history"
          onRowClick={(row) => row.type === "Material" && setSelectedMaterialId(row._id)}
        />
      </Card>

      <Modal
        isOpen={!!selectedMaterialId}
        onClose={() => setSelectedMaterialId(null)}
        title="Material Request Details"
        subtitle={activeMaterialDetail ? `${activeMaterialDetail.siteId?.name || "—"} · ${formatDate(activeMaterialDetail.date)}` : "Loading..."}
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
                    <p className="font-medium text-secondary-900 dark:text-white">{activeMaterialDetail.reviewedBy || "—"}</p>
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
          </div>
        ) : (
          <p className="text-sm text-secondary-500">Loading details...</p>
        )}
      </Modal>
    </div>
  );
};

export default RequestHistory;
