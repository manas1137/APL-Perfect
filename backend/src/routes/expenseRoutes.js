import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { siteProtect } from "../middleware/siteProtect.js";
import {
  createExpense,
  getWallets,
  getSiteDetail,
  getSiteHistory,
  getAdminSummary,
  getAdminDetail,
  getAdminHistory,
} from "../controllers/expenseController.js";
import {
  validateAddExpense,
  validateExpenseId,
  validateExpenseQuery,
} from "../validations/expenseValidation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/submit", siteProtect, validateAddExpense, asyncHandler(createExpense));

router.get("/wallet", siteProtect, asyncHandler(getWallets));

router.get("/history", siteProtect, validateExpenseQuery, asyncHandler(getSiteHistory));

router.get("/payment/:id", siteProtect, validateExpenseId, asyncHandler(getSiteDetail));

router.get("/admin/summary", protect, authorize("admin"), asyncHandler(getAdminSummary));

router.get("/admin/history", protect, authorize("admin"), validateExpenseQuery, asyncHandler(getAdminHistory));

router.get("/admin/payment/:id", protect, authorize("admin"), validateExpenseId, asyncHandler(getAdminDetail));

export default router;
