import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { siteProtect } from "../middleware/siteProtect.js";
import {
  getNotifications,
  getNotification,
  readNotification,
  readAllNotifications,
  getUnreadCountHandler,
  getLatest,
  getDashboard,
  getSiteNotificationsHandler,
  getSiteUnreadCountHandler,
  readSiteAllNotifications,
  markSiteReadHandler,
  deleteSiteNotificationHandler,
  deleteNotificationHandler,
  deleteAllNotificationsHandler,
} from "../controllers/notificationController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/site", siteProtect, asyncHandler(getSiteNotificationsHandler));

router.get("/site/unread-count", siteProtect, asyncHandler(getSiteUnreadCountHandler));

router.patch("/site/read-all", siteProtect, asyncHandler(readSiteAllNotifications));

router.patch("/site/:id/read", siteProtect, asyncHandler(markSiteReadHandler));

router.delete("/site/:id", siteProtect, asyncHandler(deleteSiteNotificationHandler));

router.use(protect);
router.use(authorize("admin"));

router.get("/", asyncHandler(getNotifications));

router.get("/unread-count", asyncHandler(getUnreadCountHandler));

router.get("/latest", asyncHandler(getLatest));

router.get("/dashboard", asyncHandler(getDashboard));

router.get("/:id", asyncHandler(getNotification));

router.patch("/:id/read", asyncHandler(readNotification));

router.patch("/read-all", asyncHandler(readAllNotifications));

router.delete("/:id", asyncHandler(deleteNotificationHandler));

router.delete("/", asyncHandler(deleteAllNotificationsHandler));

export default router;
