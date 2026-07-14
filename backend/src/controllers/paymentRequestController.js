import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  submitPaymentRequest,
  getPaymentRequestHistory,
  getAllPaymentRequests,
  getPaymentRequestById,
  approvePaymentRequest,
  rejectPaymentRequest,
} from "../services/paymentRequestService.js";

const createPaymentRequest = async (req, res, next) => {
  try {
    const paymentRequest = await submitPaymentRequest(req.site._id, req.body);

    const response = new ApiResponse(
      201,
      paymentRequest,
      "Payment request submitted successfully"
    );
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getPaymentRequestHistoryList = async (req, res, next) => {
  try {
    const history = await getPaymentRequestHistory(req.site._id);

    const response = new ApiResponse(
      200,
      history,
      "Payment request history fetched"
    );
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getAllPaymentRequestsAdmin = async (req, res, next) => {
  try {
    const { page, limit, search, sort, siteId, status } = req.query;

    const result = await getAllPaymentRequests({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      search: search || "",
      sort: sort || "-createdAt",
      siteId: siteId || "",
      status: status || "",
    });

    const response = new ApiResponse(200, result, "Payment requests fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getPaymentRequestByIdAdmin = async (req, res, next) => {
  try {
    const paymentRequest = await getPaymentRequestById(req.params.id);

    const response = new ApiResponse(200, paymentRequest, "Payment request fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const approvePayment = async (req, res, next) => {
  try {
    const { adminRemark } = req.body;
    const request = await approvePaymentRequest(req.params.id, req.admin._id, adminRemark);

    const response = new ApiResponse(200, request, "Payment request approved successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const rejectPayment = async (req, res, next) => {
  try {
    const { adminRemark } = req.body;
    const request = await rejectPaymentRequest(req.params.id, req.admin._id, adminRemark);

    const response = new ApiResponse(200, request, "Payment request rejected successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

export {
  createPaymentRequest,
  getPaymentRequestHistoryList,
  getAllPaymentRequestsAdmin,
  getPaymentRequestByIdAdmin,
  approvePayment,
  rejectPayment,
};
