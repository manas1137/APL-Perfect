import Site from "../models/Site.js";
import PaymentRequest from "../models/PaymentRequest.js";
import Expense from "../models/Expense.js";
import Notification from "../models/Notification.js";
import { ApiError } from "../utils/ApiError.js";

const buildWalletMap = async (paymentRequestIds) => {
  const ids = paymentRequestIds.map((id) => id.toString());
  const agg = await Expense.aggregate([
    { $match: { paymentRequestId: { $in: paymentRequestIds } } },
    { $group: { _id: "$paymentRequestId", expenseUsed: { $sum: "$amount" } } },
  ]);

  const usedMap = {};
  agg.forEach((row) => {
    usedMap[row._id.toString()] = row.expenseUsed;
  });

  const resolve = (paymentRequest) => {
    const approvedAmount = paymentRequest.amount || 0;
    const expenseUsed = usedMap[paymentRequest._id.toString()] || 0;
    const remainingBalance = approvedAmount - expenseUsed;
    const status = remainingBalance > 0 ? "Open" : "Closed";
    return { approvedAmount, expenseUsed, remainingBalance, status };
  };

  return { ids, resolve };
};

const addExpense = async (siteId, paymentRequestId, data, createdBy) => {
  const paymentRequest = await PaymentRequest.findById(paymentRequestId);
  if (!paymentRequest) {
    throw new ApiError(404, "Payment request not found");
  }

  if (paymentRequest.siteId.toString() !== siteId.toString()) {
    throw new ApiError(403, "Payment request does not belong to this site");
  }

  if (paymentRequest.status !== "approved") {
    throw new ApiError(400, "Expenses can only be added for approved payment requests");
  }

  const { resolve } = await buildWalletMap([paymentRequest._id]);
  const { remainingBalance } = resolve(paymentRequest);

  if (Number(data.amount) > remainingBalance) {
    throw new ApiError(400, "Expense amount cannot exceed remaining approved balance.");
  }

  const site = await Site.findById(siteId);

  const expense = await Expense.create({
    siteId,
    paymentRequestId,
    purpose: data.purpose,
    amount: data.amount,
    description: data.description || "",
    createdBy: createdBy || "",
  });

  await Notification.create({
    title: "New Site Expense",
    message: `${site?.name || "A site"} added an expense of ₹${data.amount} for ${paymentRequest.purpose}`,
    type: "expense",
    siteId,
    siteName: site?.name || "",
  });

  return expense;
};

const getSiteExpenseWallets = async (siteId) => {
  const payments = await PaymentRequest.find({ siteId, status: "approved" })
    .sort({ createdAt: -1 })
    .lean();

  const { resolve } = await buildWalletMap(payments.map((p) => p._id));

  return payments.map((payment) => {
    const wallet = resolve(payment);
    return {
      ...payment,
      expenseUsed: wallet.expenseUsed,
      remainingBalance: wallet.remainingBalance,
      status: wallet.status,
    };
  });
};

const getPaymentExpenseDetail = async (paymentRequestId, siteId) => {
  const paymentRequest = await PaymentRequest.findById(paymentRequestId)
    .populate("siteId", "name ownerName location")
    .lean();

  if (!paymentRequest) {
    throw new ApiError(404, "Payment request not found");
  }

  if (siteId && paymentRequest.siteId?._id?.toString() !== siteId.toString()) {
    throw new ApiError(403, "Payment request does not belong to this site");
  }

  const expenses = await Expense.find({ paymentRequestId, siteId })
    .sort({ createdAt: -1 })
    .lean();

  const { resolve } = await buildWalletMap([paymentRequest._id]);
  const summary = resolve(paymentRequest);

  return {
    paymentRequest,
    expenses,
    summary: {
      approvedAmount: summary.approvedAmount,
      expenseUsed: summary.expenseUsed,
      remainingBalance: summary.remainingBalance,
      status: summary.status,
    },
  };
};

const getSiteExpenseHistory = async (siteId) => {
  const expenses = await Expense.find({ siteId })
    .sort({ createdAt: -1 })
    .populate("paymentRequestId", "purpose amount")
    .lean();

  return expenses;
};

const getAdminExpenseSummary = async () => {
  const payments = await PaymentRequest.find({ status: "approved" })
    .populate("siteId", "name ownerName location")
    .sort({ createdAt: -1 })
    .lean();

  const { resolve } = await buildWalletMap(payments.map((p) => p._id));

  return payments.map((payment) => {
    const wallet = resolve(payment);
    return {
      ...payment,
      expenseUsed: wallet.expenseUsed,
      remainingBalance: wallet.remainingBalance,
      status: wallet.status,
    };
  });
};

const getAdminPaymentExpenseDetail = async (paymentRequestId) => {
  const paymentRequest = await PaymentRequest.findById(paymentRequestId)
    .populate("siteId", "name ownerName location")
    .lean();

  if (!paymentRequest) {
    throw new ApiError(404, "Payment request not found");
  }

  const expenses = await Expense.find({ paymentRequestId })
    .sort({ createdAt: -1 })
    .lean();

  const { resolve } = await buildWalletMap([paymentRequest._id]);
  const summary = resolve(paymentRequest);

  return {
    paymentRequest,
    expenses,
    summary: {
      approvedAmount: summary.approvedAmount,
      expenseUsed: summary.expenseUsed,
      remainingBalance: summary.remainingBalance,
      status: summary.status,
    },
  };
};

const getAdminExpenseHistory = async () => {
  const expenses = await Expense.find()
    .sort({ createdAt: -1 })
    .populate("siteId", "name")
    .populate("paymentRequestId", "purpose amount")
    .lean();

  return expenses;
};

export {
  addExpense,
  getSiteExpenseWallets,
  getPaymentExpenseDetail,
  getSiteExpenseHistory,
  getAdminExpenseSummary,
  getAdminPaymentExpenseDetail,
  getAdminExpenseHistory,
};
