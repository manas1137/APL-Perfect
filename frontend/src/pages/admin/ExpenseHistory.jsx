import { useEffect, useState } from "react";
import { Card } from "../../components/cards";
import { Table } from "../../components/tables";
import { SearchBar } from "../../components/common";
import { Modal } from "../../components/modals";
import { useApi } from "../../hooks/useApi";
import { API_STATUS } from "../../constants";
import { expenseApi } from "../../api";
import { formatDate } from "../../utils";

const statusRender = (value) => (
  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
    value === "Open"
      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  }`}>
    {value}
  </span>
);

const ExpenseHistory = () => {
  const listApi = useApi(expenseApi.getAdminSummary);
  const detailApi = useApi(expenseApi.getAdminDetail);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    listApi.execute();
  }, [listApi.execute]);

  useEffect(() => {
    if (selectedId) detailApi.execute(selectedId);
  }, [selectedId, detailApi.execute]);

  const detail = detailApi.data?.data || null;
  const activeDetail = detail && detail.paymentRequest?._id === selectedId ? detail : null;
  const detailLoading = detailApi.status === API_STATUS.LOADING;

  const expenses = Array.isArray(activeDetail?.expenses) ? activeDetail.expenses : [];

  const summaryRows = Array.isArray(listApi.data?.data) ? listApi.data.data : [];

  const requests = summaryRows
    .map((r) => ({
      _id: r._id,
      siteName: r.siteId?.name || "—",
      purpose: r.purpose,
      approvedAmount: r.amount,
      expenseUsed: r.expenseUsed,
      remainingBalance: r.remainingBalance,
      status: r.status,
    }))
    .filter((r) => {
      if (!search) return true;
      const term = search.toLowerCase();
      return (
        r.siteName.toLowerCase().includes(term) ||
        (r.purpose && r.purpose.toLowerCase().includes(term))
      );
    });

  const columns = [
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
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <button
          onClick={(e) => { e.stopPropagation(); setSelectedId(row._id); }}
          className="px-3 py-1.5 rounded-lg border border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-theme"
        >
          View Details
        </button>
      ),
    },
  ];

  const summary = activeDetail?.summary || { approvedAmount: 0, expenseUsed: 0, remainingBalance: 0, status: "Open" };

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Expense History</h1>
        <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">
          View expenses recorded against approved payment requests
        </p>
      </div>

      <Card>
        <div className="mb-3 sm:mb-4">
          <SearchBar placeholder="Search by site or purpose..." onSearch={setSearch} />
        </div>
        <Table
          columns={columns}
          data={requests}
          onRowClick={(row) => setSelectedId(row._id)}
          isLoading={listApi.status === API_STATUS.LOADING}
          emptyMessage="No expense records found"
        />
      </Card>

      <Modal
        isOpen={!!selectedId}
        onClose={() => setSelectedId(null)}
        title="Expense Details"
        subtitle={
          activeDetail
            ? `${activeDetail.paymentRequest?.siteId?.name || "—"} · ${activeDetail.paymentRequest?.purpose || ""}`
            : "Loading..."
        }
      >
        {activeDetail ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Approved Amount</p>
                <p className="font-semibold text-secondary-900 dark:text-white">₹{summary.approvedAmount}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Expense Used</p>
                <p className="font-semibold text-secondary-900 dark:text-white">₹{summary.expenseUsed}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Remaining Balance</p>
                <p className="font-semibold text-secondary-900 dark:text-white">₹{summary.remainingBalance}</p>
              </div>
            </div>

            <div className="border-t border-secondary-200 dark:border-secondary-700 pt-4">
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Expense History ({expenses.length})
              </p>
              {expenses.length === 0 ? (
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
                      {expenses.map((expense) => (
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

export default ExpenseHistory;
