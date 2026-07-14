import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  createMaterial,
  getAllMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} from "../services/materialService.js";

const addMaterial = async (req, res, next) => {
  try {
    const material = await createMaterial(req.body);

    const response = new ApiResponse(201, material, "Material added successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getMaterials = async (req, res, next) => {
  try {
    const { page, limit, search, sort } = req.query;

    const result = await getAllMaterials({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      search: search || "",
      sort: sort || "-createdAt",
    });

    const response = new ApiResponse(200, result, "Materials fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getMaterial = async (req, res, next) => {
  try {
    const material = await getMaterialById(req.params.id);

    const response = new ApiResponse(200, material, "Material fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const updateMaterialById = async (req, res, next) => {
  try {
    const material = await updateMaterial(req.params.id, req.body);

    const response = new ApiResponse(200, material, "Material updated successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const removeMaterial = async (req, res, next) => {
  try {
    const material = await deleteMaterial(req.params.id);

    const response = new ApiResponse(200, material, "Material deleted successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

export {
  addMaterial,
  getMaterials,
  getMaterial,
  updateMaterialById,
  removeMaterial,
};
