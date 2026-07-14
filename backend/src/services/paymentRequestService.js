import Site from "../models/Site.js";
import PaymentRequest from "../models/PaymentRequest.js";
import Notification from "../models/Notification.js";
import { ApiError } from "../utils/ApiError.js";

const submitPaymentRequest = async (siteId, data) => {
  const { date, purpose, requestedBy, siteLocation, amount, note } = data;

  const site = await Site.findById(siteId);
  if (!site) {
    throw new ApiError(404, "Site not found");
  }

  const requestDate = new Date(date);
  requestDate.setHours(0, 0, 0, 0);

  const request = await PaymentRequest.create({
    siteId,
    date: requestDate,
    purpose,
    requestedBy: requestedBy || site.ownerName || site.name,
    siteLocation: siteLocation || site.location,
    amount,
    note,
    status: "pending",
  });

  await Notification.create({
    title: "New Payment Request",
    message: `${site.name} submitted a payment request for ${amount}`,
    type: "payment",
    siteId,
    siteName: site.name,
  });

  return request;
};

const getPaymentRequestHistory = async (siteId) => {
  const requests = await PaymentRequest.find({ siteId })
    .sort({ createdAt: -1 })
    .select("date purpose amount status adminRemark reviewedBy reviewedAt createdAt");

  return requests;
};

const getAllPaymentRequests = async ({ page = 1, limit = 10, search = "", sort = "-createdAt", siteId, status }) => {
  const skip = (page - 1) * limit;

  const query = {};

  if (siteId) {
    query.siteId = siteId;
  }

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { purpose: { $regex: search, $options: "i" } },
      { requestedBy: { $regex: search, $options: "i" } },
      { siteLocation: { $regex: search, $options: "i" } },
      { note: { $regex: search, $options: "i" } },
    ];
  }

  const [requests, total] = await Promise.all([
    PaymentRequest.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("siteId", "name ownerName location")
      .lean(),
    PaymentRequest.countDocuments(query),
  ]);

  return {
    requests,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getPaymentRequestById = async (id) => {
  const request = await PaymentRequest.findById(id)
    .populate("siteId", "name ownerName location")
    .lean();

  if (!request) {
    throw new ApiError(404, "Payment request not found");
  }

  return request;
};

const approvePaymentRequest = async (id, adminId, adminRemark) => {
  const request = await PaymentRequest.findByIdAndUpdate(
    id,
    {
      status: "approved",
      reviewedBy: adminId,
      reviewedAt: new Date(),
      adminRemark: adminRemark || "",
    },
    { new: true }
  );

  if (!request) {
    throw new ApiError(404, "Payment request not found");
  }

  const site = await Site.findById(request.siteId);
  await Notification.create({
    title: `Payment Request ${request.status}`,
    message: `Your payment request was ${request.status} by admin.`,
    type: "payment",
    siteId: request.siteId,
    siteName: site?.name || "",
  });

  return request;
};

const rejectPaymentRequest = async (id, adminId, adminRemark) => {
  const request = await PaymentRequest.findByIdAndUpdate(
    id,
    {
      status: "rejected",
      reviewedBy: adminId,
      reviewedAt: new Date(),
      adminRemark: adminRemark || "",
    },
    { new: true }
  );

  if (!request) {
    throw new ApiError(404, "Payment request not found");
  }

  const site = await Site.findById(request.siteId);
  await Notification.create({
    title: `Payment Request ${request.status}`,
    message: `Your payment request was ${request.status} by admin.`,
    type: "payment",
    siteId: request.siteId,
    siteName: site?.name || "",
  });

  return request;
};

export {
  submitPaymentRequest,
  getPaymentRequestHistory,
  getAllPaymentRequests,
  getPaymentRequestById,
  approvePaymentRequest,
  rejectPaymentRequest,
};
