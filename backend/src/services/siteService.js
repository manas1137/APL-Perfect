import bcrypt from "bcryptjs";
import Site from "../models/Site.js";
import Worker from "../models/Worker.js";
import Material from "../models/Material.js";
import Attendance from "../models/Attendance.js";
import PaymentRequest from "../models/PaymentRequest.js";
import MaterialRequest from "../models/MaterialRequest.js";
import Notification from "../models/Notification.js";
import { ApiError } from "../utils/ApiError.js";

const getDashboardStats = async (siteId) => {
  const site = await Site.findById(siteId).select(
    "stats totalWorkers assignedWorkers"
  );

  const assignedWorkersCount = site.assignedWorkers.length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayAttendance = await Attendance.findOne({
    siteId,
    date: { $gte: today },
  });

  let presentToday = 0;
  let absentToday = 0;

  if (todayAttendance && todayAttendance.workers) {
    todayAttendance.workers.forEach((worker) => {
      if (worker.status === "present") presentToday++;
      else absentToday++;
    });
  }

  const pendingMaterialRequests = await MaterialRequest.countDocuments({
    siteId,
    status: "pending",
  });

  const pendingPaymentRequests = await PaymentRequest.countDocuments({
    siteId,
    status: "pending",
  });

  const totalPending = pendingMaterialRequests + pendingPaymentRequests;

  const approvedMaterialRequests = await MaterialRequest.countDocuments({
    siteId,
    status: "approved",
  });

  const approvedPaymentRequests = await PaymentRequest.countDocuments({
    siteId,
    status: "approved",
  });

  const rejectedMaterialRequests = await MaterialRequest.countDocuments({
    siteId,
    status: "rejected",
  });

  const rejectedPaymentRequests = await PaymentRequest.countDocuments({
    siteId,
    status: "rejected",
  });

  const totalApproved = approvedMaterialRequests + approvedPaymentRequests;
  const totalRejected = rejectedMaterialRequests + rejectedPaymentRequests;

  return {
    totalAssignedWorkers: assignedWorkersCount,
    attendance: {
      presentToday,
      absentToday,
    },
    requests: {
      pendingMaterial: pendingMaterialRequests,
      pendingPayment: pendingPaymentRequests,
      totalPending,
      approvedMaterial: approvedMaterialRequests,
      approvedPayment: approvedPaymentRequests,
      totalApproved,
      rejectedMaterial: rejectedMaterialRequests,
      rejectedPayment: rejectedPaymentRequests,
      totalRejected,
    },
  };
};

const getSiteDetails = async (siteId) => {
  const site = await Site.findById(siteId).select("-password");

  if (!site) {
    throw new ApiError(404, "Site not found");
  }

  return site;
};

const getAssignedWorkers = async (siteId) => {
  const site = await Site.findById(siteId).populate(
    "assignedWorkers",
    "name esiNumber pfNumber mobileNumber isActive"
  );

  if (!site) {
    throw new ApiError(404, "Site not found");
  }

  return site.assignedWorkers;
};

const getAllMaterials = async () => {
  const materials = await Material.find({}).select("_id name unit unitPrice");
  return materials;
};

const createSite = async (siteData) => {
  const budgetValue = Number(siteData.budget);
  console.log("[siteService] Budget Before Save:", siteData.budget);
  console.log("[siteService] Budget Converted:", budgetValue);
  const site = await Site.create({
    ...siteData,
    budget: budgetValue,
    originalBudget: budgetValue,
  });
  console.log("[siteService] Budget Stored:", site.budget);
  return site;
};

const getAllSites = async ({ page = 1, limit = 10, search = "", sort = "-createdAt" }) => {
  const skip = (page - 1) * limit;

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { ownerName: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const [sites, total] = await Promise.all([
    Site.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Site.countDocuments(query),
  ]);

  return {
    sites,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getSiteById = async (id) => {
  const site = await Site.findById(id).lean();

  if (!site) {
    throw new ApiError(404, "Site not found");
  }

  return site;
};

const updateSite = async (id, updateData) => {
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  delete updateData.budget;
  delete updateData.originalBudget;

  const site = await Site.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!site) {
    throw new ApiError(404, "Site not found");
  }

  return site;
};

const deleteSite = async (id) => {
  const site = await Site.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!site) {
    throw new ApiError(404, "Site not found");
  }

  return site;
};

export {
  getDashboardStats,
  getSiteDetails,
  getAssignedWorkers,
  getAllMaterials,
  createSite,
  getAllSites,
  getSiteById,
  updateSite,
  deleteSite,
};
