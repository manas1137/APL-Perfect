import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/cards";
import { useApi } from "../../hooks/useApi";
import { API_STATUS } from "../../constants";
import { expenseApi } from "../../api";

const SiteExpenses = () => {
  const navigate = useNavigate();
  const walletApi = useApi(expenseApi.getWallet);

  useEffect(() => {
    walletApi.execute();
  }, [walletApi.execute]);

  const wallets = Array.isArray(walletApi.data?.data) ? walletApi.data.data : [];
  const isLoading = walletApi.status === API_STATUS.LOADING;

  const statusBadge = (status) => (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
      status === "Open"
        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }`}>
      {status}
    </span>
  );

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Site Expenses</h1>
        <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">
          Record expenses against approved payment requests
        </p>
      </div>

      <Card>
        {isLoading ? (
          <p className="text-sm text-secondary-500 dark:text-secondary-400">Loading approved payments...</p>
        ) : wallets.length === 0 ? (
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            No approved payment requests available. Expenses can only be added after a payment request is approved by the admin.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wallets.map((wallet) => (
              <div
                key={wallet._id}
                className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">Payment Purpose</p>
                    <p className="font-semibold text-secondary-900 dark:text-white">{wallet.purpose}</p>
                  </div>
                  {statusBadge(wallet.status)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">Approved Amount</p>
                    <p className="font-medium text-secondary-900 dark:text-white">₹{wallet.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">Remaining Balance</p>
                    <p className="font-medium text-secondary-900 dark:text-white">₹{wallet.remainingBalance}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/site/expenses/${wallet._id}`)}
                  className="mt-1 w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-theme text-sm min-h-[44px] sm:min-h-0"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SiteExpenses;
