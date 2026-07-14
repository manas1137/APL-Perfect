import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  submitMaterialRequest,
  getMaterialRequestHistory,
  getAllMaterialRequests,
  getMaterialRequestById,
  approveMaterialRequest,
  rejectMaterialRequest,
} from "../services/materialRequestService.js";

const createMaterialRequest = async (req, res, next) => {
  try {
    const order = await submitMaterialRequest(req.site._id, req.body);

    const response = new ApiResponse(
      201,
      order,
      "Material request submitted successfully"
    );
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getMaterialRequestHistoryList = async (req, res, next) => {
  try {
    const history = await getMaterialRequestHistory(req.site._id);

    const response = new ApiResponse(
      200,
      history,
      "Material request history fetched"
    );
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getAllMaterialRequestsAdmin = async (req, res, next) => {
  try {
    const { page, limit, search, sort, siteId, status } = req.query;

    const result = await getAllMaterialRequests({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      search: search || "",
      sort: sort || "-createdAt",
      siteId: siteId || "",
      status: status || "",
    });

    const response = new ApiResponse(200, result, "Material requests fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getMaterialRequestByIdAdmin = async (req, res, next) => {
  try {
    const materialRequest = await getMaterialRequestById(req.params.id);

    const response = new ApiResponse(200, materialRequest, "Material request fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const approveMaterial = async (req, res, next) => {
  try {
    const { adminRemark } = req.body;
    const request = await approveMaterialRequest(req.params.id, req.admin._id, adminRemark);

    const response = new ApiResponse(200, request, "Material request approved successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const rejectMaterial = async (req, res, next) => {
  try {
    const { adminRemark } = req.body;
    const request = await rejectMaterialRequest(req.params.id, req.admin._id, adminRemark);

    const response = new ApiResponse(200, request, "Material request rejected successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

export {
  createMaterialRequest,
  getMaterialRequestHistoryList,
  getAllMaterialRequestsAdmin,
  getMaterialRequestByIdAdmin,
  approveMaterial,
  rejectMaterial,
};
