import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { siteProtect } from "../middleware/siteProtect.js";
import {
  createPaymentRequest,
  getPaymentRequestHistoryList,
  getAllPaymentRequestsAdmin,
  getPaymentRequestByIdAdmin,
  approvePayment,
  rejectPayment,
} from "../controllers/paymentRequestController.js";
import {
  validatePaymentRequest,
  validatePaymentReview,
  validatePaymentId,
  validatePaymentQuery,
} from "../validations/paymentRequestValidation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/submit", siteProtect, validatePaymentRequest, asyncHandler(createPaymentRequest));

router.get("/history", siteProtect, validatePaymentQuery, asyncHandler(getPaymentRequestHistoryList));

router.get("/", protect, authorize("admin"), validatePaymentQuery, asyncHandler(getAllPaymentRequestsAdmin));

router.get("/:id", protect, authorize("admin"), validatePaymentId, asyncHandler(getPaymentRequestByIdAdmin));

router.patch("/:id/approve", protect, authorize("admin"), validatePaymentReview, asyncHandler(approvePayment));

router.patch("/:id/reject", protect, authorize("admin"), validatePaymentReview, asyncHandler(rejectPayment));

export default router;
