import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { siteProtect } from "../middleware/siteProtect.js";
import { getAdminDashboardData, getSiteDashboardData } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/admin", protect, authorize("admin"), getAdminDashboardData);

router.get("/site", siteProtect, getSiteDashboardData);

export default router;
