import Site from "../models/Site.js";
import MaterialRequest from "../models/MaterialRequest.js";
import Notification from "../models/Notification.js";
import { ApiError } from "../utils/ApiError.js";

const submitMaterialRequest = async (siteId, data) => {
  const { materials, note } = data;

  const site = await Site.findById(siteId);
  if (!site) {
    throw new ApiError(404, "Site not found");
  }

  if (!Array.isArray(materials) || materials.length === 0) {
    throw new ApiError(400, "At least one material is required");
  }

  const seen = new Set();
  for (const m of materials) {
    const key = m.materialId || m.name;
    if (seen.has(key)) {
      throw new ApiError(400, "Duplicate materials are not allowed in the same request");
    }
    seen.add(key);
  }

  const request = await MaterialRequest.create({
    siteId,
    date: new Date(),
    materials: materials.map((m) => ({
      materialId: m.materialId || null,
      name: m.name,
      quantity: m.quantity,
      unit: m.unit,
      price: m.price,
    })),
    note,
    status: "pending",
  });

  await Notification.create({
    title: "New Material Request",
    message: `${site.name} submitted a material request`,
    type: "material",
    siteId,
    siteName: site.name,
  });

  return request;
};

const getMaterialRequestHistory = async (siteId) => {
  const requests = await MaterialRequest.find({ siteId })
    .sort({ createdAt: -1 })
    .select("date materials note status adminRemark reviewedBy reviewedAt createdAt");

  return requests;
};

const getAllMaterialRequests = async ({ page = 1, limit = 10, search = "", sort = "-createdAt", siteId, status }) => {
  const skip = (page - 1) * limit;

  const query = {};

  if (siteId) {
    query.siteId = siteId;
  }

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { note: { $regex: search, $options: "i" } },
      { "materials.name": { $regex: search, $options: "i" } },
    ];
  }

  const [requests, total] = await Promise.all([
    MaterialRequest.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("siteId", "name ownerName location")
      .lean(),
    MaterialRequest.countDocuments(query),
  ]);

  return {
    requests,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getMaterialRequestById = async (id) => {
  const request = await MaterialRequest.findById(id)
    .populate("siteId", "name ownerName location")
    .lean();

  if (!request) {
    throw new ApiError(404, "Material request not found");
  }

  return request;
};

const approveMaterialRequest = async (id, adminId, adminRemark) => {
  const request = await MaterialRequest.findByIdAndUpdate(
    id,
    {
      status: "approved",
      reviewedBy: adminId,
      reviewedAt: new Date(),
      adminRemark: adminRemark || "",
    },
    { new: true }
  );

  if (!request) {
    throw new ApiError(404, "Material request not found");
  }

  const site = await Site.findById(request.siteId);
  await Notification.create({
    title: `Material Request ${request.status}`,
    message: `Your material request was ${request.status} by admin.`,
    type: "material",
    siteId: request.siteId,
    siteName: site?.name || "",
  });

  return request;
};

const rejectMaterialRequest = async (id, adminId, adminRemark) => {
  const request = await MaterialRequest.findByIdAndUpdate(
    id,
    {
      status: "rejected",
      reviewedBy: adminId,
      reviewedAt: new Date(),
      adminRemark: adminRemark || "",
    },
    { new: true }
  );

  if (!request) {
    throw new ApiError(404, "Material request not found");
  }

  const site = await Site.findById(request.siteId);
  await Notification.create({
    title: `Material Request ${request.status}`,
    message: `Your material request was ${request.status} by admin.`,
    type: "material",
    siteId: request.siteId,
    siteName: site?.name || "",
  });

  return request;
};

export {
  submitMaterialRequest,
  getMaterialRequestHistory,
  getAllMaterialRequests,
  getMaterialRequestById,
  approveMaterialRequest,
  rejectMaterialRequest,
};
