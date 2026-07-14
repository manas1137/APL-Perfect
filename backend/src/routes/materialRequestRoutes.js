import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { siteProtect } from "../middleware/siteProtect.js";
import {
  createMaterialRequest,
  getMaterialRequestHistoryList,
  getAllMaterialRequestsAdmin,
  getMaterialRequestByIdAdmin,
  approveMaterial,
  rejectMaterial,
} from "../controllers/materialRequestController.js";
import {
  validateMaterialRequest,
  validateMaterialReview,
  validateMaterialId,
  validateMaterialQuery,
} from "../validations/materialRequestValidation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/submit", siteProtect, validateMaterialRequest, asyncHandler(createMaterialRequest));

router.get("/history", siteProtect, validateMaterialQuery, asyncHandler(getMaterialRequestHistoryList));

router.get("/", protect, authorize("admin"), validateMaterialQuery, asyncHandler(getAllMaterialRequestsAdmin));

router.get("/:id", protect, authorize("admin"), validateMaterialId, asyncHandler(getMaterialRequestByIdAdmin));

router.patch("/:id/approve", protect, authorize("admin"), validateMaterialReview, asyncHandler(approveMaterial));

router.patch("/:id/reject", protect, authorize("admin"), validateMaterialReview, asyncHandler(rejectMaterial));

export default router;
