import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../components/cards";
import { Input } from "../../components/forms";
import { useApi } from "../../hooks/useApi";
import { API_STATUS } from "../../constants";
import { expenseApi } from "../../api";
import { toast } from "react-hot-toast";
import { formatDate } from "../../utils";

const ExpenseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const detailApi = useApi(expenseApi.getDetail);

  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) detailApi.execute(id);
  }, [id, detailApi.execute]);

  const detail = detailApi.data?.data || null;
  const paymentRequest = detail?.paymentRequest || null;
  const expenses = Array.isArray(detail?.expenses) ? detail.expenses : [];
  const summary = detail?.summary || { approvedAmount: 0, expenseUsed: 0, remainingBalance: 0, status: "Open" };
  const isLoading = detailApi.status === API_STATUS.LOADING;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!purpose.trim()) {
      toast.error("Expense purpose is required");
      return;
    }

    const amountValue = parseFloat(amount);
    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amountValue > summary.remainingBalance) {
      toast.error("Expense amount cannot exceed remaining approved balance.");
      return;
    }

    setIsSubmitting(true);
    try {
      await expenseApi.submit({
        paymentRequestId: id,
        purpose,
        amount: amountValue,
        description,
      });
      toast.success("Expense added successfully!");
      setPurpose("");
      setAmount("");
      setDescription("");
      detailApi.execute(id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusBadge = (status) => (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
      status === "Open"
        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }`}>
      {status}
    </span>
  );

  const summaryCard = [
    { label: "Approved Amount", value: `₹${summary.approvedAmount}` },
    { label: "Expense Used", value: `₹${summary.expenseUsed}` },
    { label: "Remaining Balance", value: `₹${summary.remainingBalance}` },
  ];

  return (
    <div>
      <div className="mb-4 sm:mb-6 flex items-start justify-between gap-3">
        <div>
          <button
            onClick={() => navigate("/site/expenses")}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline mb-2"
          >
            ← Back to Site Expenses
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Expense Details</h1>
          <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">
            {paymentRequest?.purpose || "Loading..."}
          </p>
        </div>
        {paymentRequest && statusBadge(summary.status)}
      </div>

      <Card>
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
      </Card>

      <Card title="Site Expense Request" className="mt-4 sm:mt-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <Input
            label="Expense Purpose"
            placeholder="Enter expense purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />

          <Input
            label="Amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm sm:text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Description / Other
            </label>
            <textarea
              rows={3}
              placeholder="Additional details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-4 py-3 sm:py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-base sm:text-sm text-secondary-900 dark:text-white placeholder:text-secondary-400 dark:placeholder:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[44px] sm:min-h-0"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 sm:py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-theme disabled:opacity-50 min-h-[44px] sm:min-h-0"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </Card>

      <Card title="Expense History" className="mt-4 sm:mt-6">
        {isLoading ? (
          <p className="text-sm text-secondary-500 dark:text-secondary-400">Loading...</p>
        ) : expenses.length === 0 ? (
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
      </Card>

      <Card title="Summary" className="mt-4 sm:mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {summaryCard.map((item) => (
            <div key={item.label}>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">{item.label}</p>
              <p className="font-semibold text-secondary-900 dark:text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ExpenseDetails;
