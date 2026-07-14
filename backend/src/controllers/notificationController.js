import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  getAllNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getLatestNotifications,
  getDashboardNotifications,
  getSiteNotifications,
  getSiteUnreadCount,
  markSiteAllAsRead,
  markSiteRead,
  deleteSiteNotification,
  deleteNotification,
  deleteAllNotifications,
} from "../services/notificationService.js";

const getNotifications = async (req, res, next) => {
  try {
    const { page, limit, search, sort, type, isRead } = req.query;

    const result = await getAllNotifications({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      search: search || "",
      sort: sort || "-createdAt",
      type: type || "",
      isRead: isRead !== undefined ? isRead : "",
    });

    const response = new ApiResponse(200, result, "Notifications fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getNotification = async (req, res, next) => {
  try {
    const notification = await getNotificationById(req.params.id);

    const response = new ApiResponse(200, notification, "Notification fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const readNotification = async (req, res, next) => {
  try {
    const notification = await markAsRead(req.params.id);

    const response = new ApiResponse(200, notification, "Notification marked as read");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const readAllNotifications = async (req, res, next) => {
  try {
    const result = await markAllAsRead();

    const response = new ApiResponse(200, { modifiedCount: result.modifiedCount }, "All notifications marked as read");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getUnreadCountHandler = async (req, res, next) => {
  try {
    const count = await getUnreadCount();

    const response = new ApiResponse(200, { count }, "Unread count fetched");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getLatest = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const notifications = await getLatestNotifications(limit ? parseInt(limit) : 10);

    const response = new ApiResponse(200, notifications, "Latest notifications fetched");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const notifications = await getDashboardNotifications(limit ? parseInt(limit) : 5);

    const response = new ApiResponse(200, notifications, "Dashboard notifications fetched");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getSiteNotificationsHandler = async (req, res, next) => {
  try {
    const { page, limit, isRead } = req.query;
    const result = await getSiteNotifications(req.site._id, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      isRead: isRead !== undefined ? isRead : "",
    });

    const response = new ApiResponse(200, result, "Site notifications fetched");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getSiteUnreadCountHandler = async (req, res, next) => {
  try {
    const count = await getSiteUnreadCount(req.site._id);

    const response = new ApiResponse(200, { count }, "Site unread count fetched");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const readSiteAllNotifications = async (req, res, next) => {
  try {
    const result = await markSiteAllAsRead(req.site._id);

    const response = new ApiResponse(200, { modifiedCount: result.modifiedCount }, "All site notifications marked as read");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const markSiteReadHandler = async (req, res, next) => {
  try {
    const notification = await markSiteRead(req.site._id, req.params.id);

    const response = new ApiResponse(200, notification, "Site notification marked as read");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const deleteSiteNotificationHandler = async (req, res, next) => {
  try {
    const notification = await deleteSiteNotification(req.site._id, req.params.id);

    const response = new ApiResponse(200, notification, "Site notification deleted");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const deleteNotificationHandler = async (req, res, next) => {
  try {
    const notification = await deleteNotification(req.params.id);

    const response = new ApiResponse(200, notification, "Notification deleted");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const deleteAllNotificationsHandler = async (req, res, next) => {
  try {
    const result = await deleteAllNotifications();

    const response = new ApiResponse(200, { deletedCount: result.deletedCount }, "All notifications deleted");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

export {
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
};
