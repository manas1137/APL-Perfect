import Notification from "../models/Notification.js";
import { ApiError } from "../utils/ApiError.js";

const createNotification = async (notificationData) => {
  const notification = await Notification.create(notificationData);
  return notification;
};

const getAllNotifications = async ({ page = 1, limit = 10, search = "", sort = "-createdAt", type, isRead }) => {
  const skip = (page - 1) * limit;

  const query = {};

  if (type) {
    query.type = type;
  }

  if (isRead !== undefined && isRead !== "") {
    query.isRead = isRead === "true";
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
      { siteName: { $regex: search, $options: "i" } },
    ];
  }

  const [notifications, total] = await Promise.all([
    Notification.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(query),
  ]);

  return {
    notifications,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getNotificationById = async (id) => {
  const notification = await Notification.findById(id).lean();

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return notification;
};

const markAsRead = async (id) => {
  const notification = await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return notification;
};

const markAllAsRead = async () => {
  const result = await Notification.updateMany(
    { isRead: false },
    { isRead: true }
  );

  return result;
};

const getUnreadCount = async () => {
  const count = await Notification.countDocuments({ isRead: false });
  return count;
};

const getLatestNotifications = async (limit = 10) => {
  const notifications = await Notification.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return notifications;
};

const getSiteNotifications = async (siteId, { page = 1, limit = 10, isRead } = {}) => {
  const skip = (page - 1) * limit;

  const query = { siteId };

  if (isRead !== undefined && isRead !== "") {
    query.isRead = isRead === "true";
  }

  const [notifications, total] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(query),
  ]);

  return {
    notifications,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getSiteUnreadCount = async (siteId) => {
  const count = await Notification.countDocuments({ siteId, isRead: false });
  return count;
};

const markSiteAllAsRead = async (siteId) => {
  const result = await Notification.updateMany(
    { siteId, isRead: false },
    { isRead: true }
  );

  return result;
};

const markSiteRead = async (siteId, id) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: id, siteId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return notification;
};

const deleteSiteNotification = async (siteId, id) => {
  const notification = await Notification.findOneAndDelete({ _id: id, siteId });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return notification;
};

const deleteNotification = async (id) => {
  const notification = await Notification.findByIdAndDelete(id);

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return notification;
};

const deleteAllNotifications = async () => {
  const result = await Notification.deleteMany({});

  return result;
};

const getDashboardNotifications = async (limit = 5) => {
  const notifications = await Notification.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return notifications;
};

export {
  createNotification,
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
};
