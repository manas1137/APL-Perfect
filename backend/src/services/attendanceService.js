import Site from "../models/Site.js";
import Attendance from "../models/Attendance.js";
import Notification from "../models/Notification.js";
import { ApiError } from "../utils/ApiError.js";

const getTodayStart = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const submitAttendance = async (siteId, data) => {
  const { date, workers, submittedBy, note } = data;

  const site = await Site.findById(siteId);
  if (!site) {
    throw new ApiError(404, "Site not found");
  }

  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  const existing = await Attendance.findOne({
    siteId,
    date: attendanceDate,
  }).lean();

  if (existing) {
    throw new ApiError(409, "Attendance has already been submitted for today.");
  }

  try {
    const attendance = await Attendance.create({
      siteId,
      date: attendanceDate,
      totalWorkers: workers.length,
      workers: workers.map((w) => ({
        workerId: w.workerId,
        name: w.name,
        status: w.status,
      })),
      submittedBy,
      note,
      submittedAt: new Date(),
      status: "pending",
    });

    await Notification.create({
      title: "New Attendance Submitted",
      message: `${site.name} submitted attendance for ${attendanceDate.toISOString().split("T")[0]}`,
      type: "attendance",
      siteId,
      siteName: site.name,
    });

    return attendance;
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "Attendance has already been submitted for today.");
    }
    throw error;
  }
};

const getAttendanceHistory = async (siteId, date) => {
  const query = { siteId };

  if (date) {
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(attendanceDate);
    nextDay.setDate(nextDay.getDate() + 1);
    query.date = { $gte: attendanceDate, $lt: nextDay };
  }

  const attendances = await Attendance.find(query)
    .sort({ date: -1 })
    .select("date totalWorkers workers submittedBy submittedAt status createdAt");

  return attendances;
};

const getAllAttendances = async ({ page = 1, limit = 10, search = "", sort = "-createdAt", siteId, date }) => {
  const skip = (page - 1) * limit;

  const query = {};

  if (siteId) {
    query.siteId = siteId;
  }

  if (date) {
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(attendanceDate);
    nextDay.setDate(nextDay.getDate() + 1);
    query.date = { $gte: attendanceDate, $lt: nextDay };
  }

  if (search) {
    const matchedSites = await Site.find({ name: { $regex: search, $options: "i" } })
      .select("_id")
      .lean();
    const siteIds = matchedSites.map((s) => s._id);

    query.$or = [
      { note: { $regex: search, $options: "i" } },
      { siteId: { $in: siteIds } },
    ];
  }

  const [attendances, total] = await Promise.all([
    Attendance.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("siteId", "name ownerName location")
      .lean(),
    Attendance.countDocuments(query),
  ]);

  return {
    attendances,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getAttendanceById = async (id) => {
  const attendance = await Attendance.findById(id)
    .populate("siteId", "name ownerName location")
    .lean();

  if (!attendance) {
    throw new ApiError(404, "Attendance not found");
  }

  return attendance;
};

const approveAttendance = async (id, adminId, adminRemark) => {
  const attendance = await Attendance.findByIdAndUpdate(
    id,
    {
      status: "approved",
      reviewedBy: adminId,
      reviewedAt: new Date(),
      adminRemark: adminRemark || "",
    },
    { new: true }
  );

  if (!attendance) {
    throw new ApiError(404, "Attendance not found");
  }

  const site = await Site.findById(attendance.siteId);
  await Notification.create({
    title: `Attendance ${attendance.status}`,
    message: `Your attendance was ${attendance.status} by admin.`,
    type: "attendance",
    siteId: attendance.siteId,
    siteName: site?.name || "",
  });

  return attendance;
};

const rejectAttendance = async (id, adminId, adminRemark) => {
  const attendance = await Attendance.findByIdAndUpdate(
    id,
    {
      status: "rejected",
      reviewedBy: adminId,
      reviewedAt: new Date(),
      adminRemark: adminRemark || "",
    },
    { new: true }
  );

  if (!attendance) {
    throw new ApiError(404, "Attendance not found");
  }

  const site = await Site.findById(attendance.siteId);
  await Notification.create({
    title: `Attendance ${attendance.status}`,
    message: `Your attendance was ${attendance.status} by admin.`,
    type: "attendance",
    siteId: attendance.siteId,
    siteName: site?.name || "",
  });

  return attendance;
};

export {
  submitAttendance,
  getAttendanceHistory,
  getAllAttendances,
  getAttendanceById,
  approveAttendance,
  rejectAttendance,
};
