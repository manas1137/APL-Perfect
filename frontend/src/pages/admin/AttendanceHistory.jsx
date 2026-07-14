import { useEffect, useMemo, useState, useRef } from "react";
import { Card } from "../../components/cards";
import { Table } from "../../components/tables";
import { SearchBar } from "../../components/common";
import { Modal } from "../../components/modals";
import { useApi } from "../../hooks/useApi";
import { attendanceApi } from "../../api";
import { API_STATUS } from "../../constants";
import { formatDate, formatDateTime } from "../../utils";

const AttendanceHistory = () => {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const searchRef = useRef(search);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  const listApi = useApi(attendanceApi.getAll);
  const detailApi = useApi(attendanceApi.getById);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = {};
      if (searchRef.current) params.search = searchRef.current;
      if (date) params.date = date;
      listApi.execute(params);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, date, listApi.execute]);

  useEffect(() => {
    if (selectedId) detailApi.execute(selectedId);
  }, [selectedId, detailApi.execute]);

  const detail = detailApi.data?.data || null;
  const activeDetail = detail && detail._id === selectedId ? detail : null;
  const detailLoading = detailApi.status === API_STATUS.LOADING;

  const attendances = useMemo(() => {
    const list = listApi.data?.data?.attendances || [];
    return list.map((a) => {
      const workers = Array.isArray(a.workers) ? a.workers : [];
      const present = workers.filter((w) => w.status === "present").length;
      const absent = workers.filter((w) => w.status === "absent").length;
      return {
        ...a,
        siteName: a.siteId?.name || "—",
        present,
        absent,
      };
    });
  }, [listApi.data]);

  const isLoading =
    listApi.status === API_STATUS.LOADING ||
    detailLoading;

  const columns = [
    {
      key: "date",
      label: "Date",
      render: (value) => formatDate(value),
    },
    { key: "siteName", label: "Site Name" },
    {
      key: "totalWorkers",
      label: "Total Workers",
      render: (value) => value ?? 0,
    },
    {
      key: "present",
      label: "Present",
      render: (value) => (
        <span className="text-green-600 dark:text-green-400 font-medium">{value}</span>
      ),
    },
    {
      key: "absent",
      label: "Absent",
      render: (value) => (
        <span className="text-red-600 dark:text-red-400 font-medium">{value}</span>
      ),
    },
    { key: "submittedBy", label: "Submitted By" },
    {
      key: "submittedAt",
      label: "Submitted Time",
      render: (value) => formatDateTime(value),
    },
  ];

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">
          Attendance History
        </h1>
        <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">
          View attendance submitted by all sites
        </p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by site..."
              onSearch={setSearch}
            />
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white min-h-[44px] sm:min-h-0"
          />
          {date && (
            <button
              onClick={() => setDate("")}
              className="px-3 py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 text-secondary-600 dark:text-secondary-300 min-h-[44px] sm:min-h-0"
            >
              Clear
            </button>
          )}
        </div>

        <Table
          columns={columns}
          data={attendances}
          onRowClick={(row) => setSelectedId(row._id)}
          isLoading={isLoading}
          emptyMessage="No attendance records found"
        />
      </Card>

      <Modal
        isOpen={!!selectedId}
        onClose={() => setSelectedId(null)}
        title="Attendance Details"
        subtitle={
          activeDetail
            ? `${activeDetail.siteId?.name || "—"} · ${formatDate(activeDetail.date)}`
            : "Loading..."
        }
      >
        {activeDetail ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-secondary-500 dark:text-secondary-400">Site Name</p>
                <p className="font-medium text-secondary-900 dark:text-white">
                  {activeDetail.siteId?.name || "—"}
                </p>
              </div>
              <div>
                <p className="text-secondary-500 dark:text-secondary-400">Attendance Date</p>
                <p className="font-medium text-secondary-900 dark:text-white">
                  {formatDate(activeDetail.date)}
                </p>
              </div>
              <div>
                <p className="text-secondary-500 dark:text-secondary-400">Submitted By</p>
                <p className="font-medium text-secondary-900 dark:text-white">
                  {activeDetail.submittedBy || "—"}
                </p>
              </div>
              <div>
                <p className="text-secondary-500 dark:text-secondary-400">Submitted Time</p>
                <p className="font-medium text-secondary-900 dark:text-white">
                  {formatDateTime(activeDetail.submittedAt || activeDetail.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-secondary-500 dark:text-secondary-400">Present Workers</p>
                <p className="font-medium text-green-600 dark:text-green-400">
                  {(activeDetail.workers || []).filter((w) => w.status === "present").length}
                </p>
              </div>
              <div>
                <p className="text-secondary-500 dark:text-secondary-400">Absent Workers</p>
                <p className="font-medium text-red-600 dark:text-red-400">
                  {(activeDetail.workers || []).filter((w) => w.status === "absent").length}
                </p>
              </div>
              <div>
                <p className="text-secondary-500 dark:text-secondary-400">Status</p>
                <p className="font-medium capitalize text-secondary-900 dark:text-white">
                  {activeDetail.status}
                </p>
              </div>
              <div>
                <p className="text-secondary-500 dark:text-secondary-400">Approved By</p>
                <p className="font-medium text-secondary-900 dark:text-white">
                  {activeDetail.reviewedBy || "—"}
                </p>
              </div>
            </div>

            <div className="border-t border-secondary-200 dark:border-secondary-700 pt-3">
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Worker List ({activeDetail.workers?.length || 0})
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {(activeDetail.workers || []).map((w, idx) => (
                  <div
                    key={w.workerId || idx}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary-50 dark:bg-secondary-700/30"
                  >
                    <span className="text-sm text-secondary-900 dark:text-white">{w.name}</span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        w.status === "present"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {w.status === "present" ? "Present" : "Absent"}
                    </span>
                  </div>
                ))}
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

export default AttendanceHistory;
