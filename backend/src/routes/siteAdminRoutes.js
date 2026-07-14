import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  addSite,
  getSites,
  getSite,
  updateSiteById,
  removeSite,
  getAssignedWorkersForSite,
  getSiteStats,
} from "../controllers/siteController.js";
import {
  validateSiteCreate,
  validateSiteUpdate,
  validateSiteId,
} from "../validations/siteValidation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.post("/", validateSiteCreate, asyncHandler(addSite));

router.get("/", asyncHandler(getSites));

router.get("/:id", validateSiteId, asyncHandler(getSite));

router.get("/:id/assigned-workers", validateSiteId, asyncHandler(getAssignedWorkersForSite));

router.get("/:id/stats", validateSiteId, asyncHandler(getSiteStats));

router.put("/:id", validateSiteUpdate, asyncHandler(updateSiteById));

router.delete("/:id", validateSiteId, asyncHandler(removeSite));

export default router;
