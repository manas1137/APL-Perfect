import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  getDashboardStats,
  getSiteDetails,
  getAssignedWorkers,
  getAllMaterials,
  createSite,
  getAllSites,
  getSiteById,
  updateSite,
  deleteSite,
} from "../services/siteService.js";

const getDashboard = async (req, res, next) => {
  try {
    const stats = await getDashboardStats(req.site._id);

    const response = new ApiResponse(200, stats, "Dashboard stats fetched");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getDetails = async (req, res, next) => {
  try {
    const site = await getSiteDetails(req.site._id);

    const response = new ApiResponse(200, site, "Site details fetched");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getAssignedWorkersForSite = async (req, res, next) => {
  try {
    const workers = await getAssignedWorkers(req.params.id);

    const response = new ApiResponse(200, workers, "Assigned workers fetched");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getSiteStats = async (req, res, next) => {
  try {
    const stats = await getDashboardStats(req.params.id);

    const response = new ApiResponse(200, stats, "Site stats fetched");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getAssignedWorkersList = async (req, res, next) => {
  try {
    const workers = await getAssignedWorkers(req.site._id);

    const response = new ApiResponse(200, workers, "Assigned workers fetched");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getMaterialsList = async (req, res, next) => {
  try {
    const materials = await getAllMaterials();

    const response = new ApiResponse(200, materials, "Materials fetched");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const addSite = async (req, res, next) => {
  try {
    console.log("[siteController] Budget Received:", req.body.budget);
    const site = await createSite(req.body);

    console.log("[siteController] Budget Returned:", site.budget);
    const response = new ApiResponse(201, site, "Site created successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getSites = async (req, res, next) => {
  try {
    const { page, limit, search, sort } = req.query;

    const result = await getAllSites({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      search: search || "",
      sort: sort || "-createdAt",
    });

    const response = new ApiResponse(200, result, "Sites fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getSite = async (req, res, next) => {
  try {
    const site = await getSiteById(req.params.id);

    const response = new ApiResponse(200, site, "Site fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const updateSiteById = async (req, res, next) => {
  try {
    const site = await updateSite(req.params.id, req.body);

    const response = new ApiResponse(200, site, "Site updated successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const removeSite = async (req, res, next) => {
  try {
    const site = await deleteSite(req.params.id);

    const response = new ApiResponse(200, site, "Site deleted successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

export {
  getDashboard,
  getDetails,
  getAssignedWorkersList,
  getAssignedWorkersForSite,
  getMaterialsList,
  getSiteStats,
  addSite,
  getSites,
  getSite,
  updateSiteById,
  removeSite,
};
