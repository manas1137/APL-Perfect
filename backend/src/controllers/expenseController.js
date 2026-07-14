import { ApiResponse } from "../utils/ApiResponse.js";
import {
  addExpense,
  getSiteExpenseWallets,
  getPaymentExpenseDetail,
  getSiteExpenseHistory,
  getAdminExpenseSummary,
  getAdminPaymentExpenseDetail,
  getAdminExpenseHistory,
} from "../services/expenseService.js";

const createExpense = async (req, res, next) => {
  try {
    const expense = await addExpense(
      req.site._id,
      req.body.paymentRequestId,
      req.body,
      req.site?.name
    );

    const response = new ApiResponse(201, expense, "Expense added successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getWallets = async (req, res, next) => {
  try {
    const wallets = await getSiteExpenseWallets(req.site._id);

    const response = new ApiResponse(200, wallets, "Expense wallets fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getSiteDetail = async (req, res, next) => {
  try {
    const detail = await getPaymentExpenseDetail(req.params.id, req.site._id);

    const response = new ApiResponse(200, detail, "Expense detail fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getSiteHistory = async (req, res, next) => {
  try {
    const history = await getSiteExpenseHistory(req.site._id);

    const response = new ApiResponse(200, history, "Expense history fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getAdminSummary = async (req, res, next) => {
  try {
    const summary = await getAdminExpenseSummary();

    const response = new ApiResponse(200, summary, "Expense summary fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getAdminDetail = async (req, res, next) => {
  try {
    const detail = await getAdminPaymentExpenseDetail(req.params.id);

    const response = new ApiResponse(200, detail, "Expense detail fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getAdminHistory = async (req, res, next) => {
  try {
    const history = await getAdminExpenseHistory();

    const response = new ApiResponse(200, history, "Expense history fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

export {
  createExpense,
  getWallets,
  getSiteDetail,
  getSiteHistory,
  getAdminSummary,
  getAdminDetail,
  getAdminHistory,
};
