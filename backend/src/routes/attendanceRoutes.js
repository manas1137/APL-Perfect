import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { siteProtect } from "../middleware/siteProtect.js";
import {
  createAttendance,
  getAttendanceHistoryList,
  getAllAttendancesAdmin,
  getAttendanceByIdAdmin,
  approveAttendanceAdmin,
  rejectAttendanceAdmin,
} from "../controllers/attendanceController.js";
import {
  validateAttendance,
  validateAttendanceQuery,
  validateAttendanceId,
} from "../validations/attendanceValidation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/submit", siteProtect, validateAttendance, asyncHandler(createAttendance));

router.get("/history", siteProtect, validateAttendanceQuery, asyncHandler(getAttendanceHistoryList));

router.get("/", protect, authorize("admin"), validateAttendanceQuery, asyncHandler(getAllAttendancesAdmin));

router.get("/:id", protect, authorize("admin"), validateAttendanceId, asyncHandler(getAttendanceByIdAdmin));

router.patch("/:id/approve", protect, authorize("admin"), validateAttendanceId, asyncHandler(approveAttendanceAdmin));

router.patch("/:id/reject", protect, authorize("admin"), validateAttendanceId, asyncHandler(rejectAttendanceAdmin));

export default router;
